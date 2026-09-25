import type { Activity } from './types';

const keepDefaultNames = new Set(['Run from keep', 'VirtualRun from keep']);

export function getActivityDisplayName(
  activity: Pick<Activity, 'name' | 'type' | 'start_date_local'>
): string {
  const name = activity.name?.trim();
  if (name && !keepDefaultNames.has(name)) return name;

  const hour = Number(activity.start_date_local.slice(11, 13));
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return name || activity.type;
  }

  const timeOfDay =
    hour < 5 || hour >= 21
      ? 'Night'
      : hour < 11
        ? 'Morning'
        : hour < 14
          ? 'Lunch'
          : hour < 18
            ? 'Afternoon'
            : 'Evening';
  const sport = activity.type === 'VirtualRun' ? 'Virtual Run' : activity.type;

  return `${timeOfDay} ${sport}`;
}
