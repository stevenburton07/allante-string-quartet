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
