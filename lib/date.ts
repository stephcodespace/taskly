/**
 * Date manipulation and formatting utilities for Taskly.
 */

const MONTH_NAMES_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Returns today's date in YYYY-MM-DD string format based on local browser time.
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD date string into English display format (e.g., "Oct 31, 2026").
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "";

  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(monthIndex) || isNaN(day)) return dateStr;
  if (monthIndex < 0 || monthIndex > 11) return dateStr;

  return `${MONTH_NAMES_EN[monthIndex]} ${day}, ${year}`;
}

/**
 * Determines whether a task is overdue.
 * A task is overdue only if:
 * 1. It has a due date.
 * 2. Its status is NOT 'done'.
 * 3. Its due date is strictly earlier than today's local date.
 */
export function isTaskOverdue(dueDate?: string, status?: string): boolean {
  if (!dueDate || status === "done") {
    return false;
  }

  const today = getTodayString();
  return dueDate < today;
}
