"""
new garmin ids to strava;
not the same logic as nike_to_strava_sync
"""

import argparse
import asyncio
import json
import os
import sys
import time

from config import FOLDER_DICT, STRAVA_PENDING_FILE
from garmin_sync import download_new_activities, get_downloaded_ids
from utils import make_strava_client, upload_file_to_strava


def load_pending_ids():
    if not os.path.exists(STRAVA_PENDING_FILE):
        return []
    try:
        with open(STRAVA_PENDING_FILE, "r", encoding="utf-8") as f:
            return list(dict.fromkeys(str(value) for value in json.load(f)))
    except (OSError, TypeError, ValueError) as e:
        print(f"Failed to load Strava pending queue: {e}")
        return []


def save_pending_ids(activity_ids):
    if activity_ids:
        with open(STRAVA_PENDING_FILE, "w", encoding="utf-8") as f:
            f.write(json.dumps(activity_ids, separators=(",", ":")) + "\n")
    elif os.path.exists(STRAVA_PENDING_FILE):
        os.remove(STRAVA_PENDING_FILE)


def choose_upload_file(activity_id, preferred_type):
    """Prefer FIT for treadmill/indoor activities, GPX otherwise."""
    fit_path = os.path.join(FOLDER_DICT["fit"], f"{activity_id}.fit")
    gpx_path = os.path.join(FOLDER_DICT["gpx"], f"{activity_id}.gpx")

    if preferred_type == "fit" and os.path.exists(fit_path):
        return fit_path, "fit"

    if os.path.exists(gpx_path):
        try:
            with open(gpx_path, "r", encoding="utf-8", errors="ignore") as f:
                gpx = f.read()
        except OSError:
            gpx = ""
        is_empty_treadmill_gpx = (
            "treadmill_running" in gpx and "<trkpt" not in gpx
        )
        if is_empty_treadmill_gpx and os.path.exists(fit_path):
            return fit_path, "fit"
        return gpx_path, "gpx"

    if os.path.exists(fit_path):
        return fit_path, "fit"

    return None, None

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("strava_client_id", help="strava client id")
    parser.add_argument("strava_client_secret", help="strava client secret")
    parser.add_argument("strava_refresh_token", help="strava refresh token")
    parser.add_argument(
        "secret_string", nargs="?", help="secret_string fro get_garmin_secret.py"
    )
    parser.add_argument(
        "--is-cn",
        dest="is_cn",
        action="store_true",
        help="if garmin account is cn",
    )
    parser.add_argument(
        "--tcx",
        dest="download_file_type",
        action="store_const",
        const="tcx",
        default="gpx",
        help="to download personal documents or ebook",
    )
    parser.add_argument(
        "--fit",
        dest="download_file_type",
        action="store_const",
        const="fit",
        default="gpx",
        help="download and upload FIT files, preferred for treadmill activities",
    )
    options = parser.parse_args()
    strava_client = make_strava_client(
        options.strava_client_id,
        options.strava_client_secret,
        options.strava_refresh_token,
    )
    secret_string = options.secret_string
    garmin_auth_domain = "CN" if options.is_cn else ""
    email = options.secret_string
    file_type = options.download_file_type
    is_only_running = False
    if secret_string is None:
        print("Missing argument nor valid configuration file")
        sys.exit(1)
    folder = FOLDER_DICT.get(file_type, "gpx")
    pending_ids = load_pending_ids()
    upload_ids = pending_ids

    if not pending_ids:
        downloaded_ids = get_downloaded_ids(folder)
        loop = asyncio.get_event_loop()
        future = asyncio.ensure_future(
            download_new_activities(
                secret_string,
                garmin_auth_domain,
                downloaded_ids,
                is_only_running,
                folder,
                file_type,
            )
        )
        loop.run_until_complete(future)
        upload_ids, _ = future.result()

    upload_items = []
    missing_ids = []
    for activity_id in upload_ids:
        file_path, upload_type = choose_upload_file(activity_id, file_type)
        if file_path:
            upload_items.append((str(activity_id), file_path, upload_type))
        else:
            missing_ids.append(str(activity_id))

    print(f"To upload to strava {len(upload_items)} files")
    uploaded_ids = []
    index = 1
    for activity_id, file_path, upload_type in upload_items:
        try:
            upload_file_to_strava(strava_client, file_path, upload_type)
            uploaded_ids.append(activity_id)
        except Exception as e:
            print(f"Upload failed for Garmin activity {activity_id}: {e}")
        if index % 10 == 0:
            print("For the rate limit will sleep 10s")
            time.sleep(10)
        index += 1
        time.sleep(1)

    if pending_ids:
        remaining_ids = [
            activity_id
            for activity_id in pending_ids
            if activity_id not in uploaded_ids
        ]
        save_pending_ids(remaining_ids)
        if missing_ids:
            print(
                "Pending activities without a local FIT/GPX file: "
                + ", ".join(missing_ids)
            )
