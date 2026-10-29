// One place for how the admin panel reads and shows form-submission times.
//
// The server stores every time in UTC, but sends it as text WITHOUT a "Z" (for example "2026-10-29T06:58:54"),
// so a browser would wrongly read it as local time and show it hours off. parseApiDate() reads it as UTC.
// Everything is shown in Indian Standard Time, whatever time zone the viewer's computer is set to.

export const IST_TIME_ZONE = 'Asia/Kolkata';

/** Reads a server timestamp as the UTC moment it is. */
export function parseApiDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value.trim());
  const date = new Date(hasZone ? value : `${value.trim()}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const full = new Intl.DateTimeFormat('en-IN', {
  timeZone: IST_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
});
const short = new Intl.DateTimeFormat('en-IN', {
  timeZone: IST_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
});
const dayOnly = new Intl.DateTimeFormat('en-CA', { timeZone: IST_TIME_ZONE }); // 2026-10-29

/** "29 Oct 2026, 03:42:17 pm IST": the exact moment, with seconds. */
export function formatExact(value: string | Date | null | undefined): string {
  const d = parseApiDate(value);
  return d ? `${full.format(d)} IST` : '—';
}

/** "29 Oct 2026, 03:42 pm IST": for tables and lists. */
export function formatShort(value: string | Date | null | undefined): string {
  const d = parseApiDate(value);
  return d ? `${short.format(d)} IST` : '—';
}

const compact = new Intl.DateTimeFormat('en-IN', { timeZone: IST_TIME_ZONE, day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });

/** "29 Oct, 3:42 pm": the short exact stamp for crowded lists. */
export function formatCompact(value: string | Date | null | undefined): string {
  const d = parseApiDate(value);
  return d ? compact.format(d) : '—';
}

/** The Indian calendar day, "2026-10-29": for day filters and counts. */
export function istDay(value: string | Date | null | undefined): string {
  const d = parseApiDate(value);
  return d ? dayOnly.format(d) : '';
}

/** "5 minutes ago", "3 days ago". */
export function timeAgo(value: string | Date | null | undefined, now: Date = new Date()): string {
  const d = parseApiDate(value);
  if (!d) return '';
  const minutes = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? '' : 's'} ago`;
}
