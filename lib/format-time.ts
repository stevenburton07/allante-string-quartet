/**
 * Format a calendar date (a "YYYY-MM-DD" string from a Postgres DATE column)
 * for display. Dates without a time are parsed by JS as UTC midnight, so
 * rendering them in a negative-offset timezone (e.g. US Mountain) shifts them
 * to the previous day. Pinning the display timezone to UTC keeps the calendar
 * date exactly as stored.
 */
export function formatEventDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  // Always render in UTC so the stored calendar date (or wall-clock event
  // time) is shown exactly as entered, never shifted by the viewer's or
  // server's timezone.
  return new Date(date).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
}

export function formatTime12h(time24: string): string {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatSunsetRange(startTime: string, endTime?: string | null): string {
  if (!endTime) {
    return `Sunset · Estimated ${formatTime12h(startTime)}`;
  }

  const [startHours, startMinutes] = startTime.split(':');
  const [endHours, endMinutes] = endTime.split(':');
  const startHour = parseInt(startHours);
  const endHour = parseInt(endHours);
  const startAmpm = startHour >= 12 ? 'PM' : 'AM';
  const endAmpm = endHour >= 12 ? 'PM' : 'AM';
  const startDisplayHour = startHour % 12 || 12;
  const endDisplayHour = endHour % 12 || 12;

  if (startAmpm === endAmpm) {
    return `Sunset · Estimated ${startDisplayHour}:${startMinutes}–${endDisplayHour}:${endMinutes} ${endAmpm}`;
  }
  return `Sunset · Estimated ${startDisplayHour}:${startMinutes} ${startAmpm}–${endDisplayHour}:${endMinutes} ${endAmpm}`;
}
