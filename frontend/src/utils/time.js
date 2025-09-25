// src/utils/time.js

/**
 * Converts "HH:MM" format to a more readable format like "Xh Ymin"
 * @param {string} duration - Duration in "HH:MM" format
 * @returns {string} Formatted duration
 */
export function formatDuration(duration) {
  if (!duration) return "0h";

  const [hours, minutes] = duration.split(":").map(Number);

  if (hours && minutes) return `${hours}h ${minutes}min`;
  if (hours) return `${hours}h`;
  if (minutes) return `${minutes}min`;
  return "0h";
}

/**
 * Converts minutes (number) to "Xh Ymin" format
 * @param {number} minutes
 * @returns {string} Formatted duration "Xh Ymin"
 */
export function formatMinutesToXhYmin(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  if (m) return `${m}min`;
  return "0h";
}

/**
 * Converts minutes (number) to "HH:MM:SS" format
 * @param {number} minutes
 * @returns {string} Formatted duration "HH:MM:SS"
 */
export function minutesToHHMMSS(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
}