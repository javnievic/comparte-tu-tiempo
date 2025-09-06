export function formatDuration(duration) {
  if (!duration) return "Sin duración";

  // Format "HH:MM:SS"
  const [hours, minutes] = duration.split(":").map(Number);

  if (hours && minutes) return `${hours}h ${minutes}min`;
  if (hours) return `${hours}h`;
  if (minutes) return `${minutes}min`;
  return "0h";
}