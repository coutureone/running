import json
import sys
from pathlib import Path

RUN_PAGE_DIR = Path(__file__).parent / "run_page"
sys.path.insert(0, str(RUN_PAGE_DIR))

import garmin_to_strava_sync as sync  # noqa: E402


def test_pending_queue_deduplicates_and_clears(tmp_path, monkeypatch):
    pending_file = tmp_path / "strava_pending.json"
    monkeypatch.setattr(sync, "STRAVA_PENDING_FILE", str(pending_file))

    pending_file.write_text(json.dumps(["1", 2, "1"]), encoding="utf-8")
    assert sync.load_pending_ids() == ["1", "2"]

    sync.save_pending_ids(["2", "3"])
    assert json.loads(pending_file.read_text(encoding="utf-8")) == ["2", "3"]

    sync.save_pending_ids([])
    assert not pending_file.exists()


def test_choose_upload_file_prefers_fit(tmp_path, monkeypatch):
    fit_dir = tmp_path / "fit"
    gpx_dir = tmp_path / "gpx"
    fit_dir.mkdir()
    gpx_dir.mkdir()
    monkeypatch.setattr(
        sync,
        "FOLDER_DICT",
        {"fit": str(fit_dir), "gpx": str(gpx_dir)},
    )

    (fit_dir / "42.fit").write_bytes(b"fit")
    (gpx_dir / "42.gpx").write_text("<gpx><trkpt /></gpx>", encoding="utf-8")

    assert sync.choose_upload_file("42", "fit") == (
        str(fit_dir / "42.fit"),
        "fit",
    )
    assert sync.choose_upload_file("42", "gpx") == (
        str(gpx_dir / "42.gpx"),
        "gpx",
    )


def test_treadmill_gpx_without_trackpoints_falls_back_to_fit(tmp_path, monkeypatch):
    fit_dir = tmp_path / "fit"
    gpx_dir = tmp_path / "gpx"
    fit_dir.mkdir()
    gpx_dir.mkdir()
    monkeypatch.setattr(
        sync,
        "FOLDER_DICT",
        {"fit": str(fit_dir), "gpx": str(gpx_dir)},
    )

    (fit_dir / "99.fit").write_bytes(b"fit")
    (gpx_dir / "99.gpx").write_text(
        "<gpx><type>treadmill_running</type></gpx>",
        encoding="utf-8",
    )

    assert sync.choose_upload_file("99", "gpx") == (
        str(fit_dir / "99.fit"),
        "fit",
    )
