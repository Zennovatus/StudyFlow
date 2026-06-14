export function dateKey(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).toISOString().slice(0, 10);
}

export function todayKey() {
  return dateKey(new Date());
}

export function addDays(dateString, days) {
  const d = new Date(`${dateString}T12:00:00`);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

export function fmtDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function daysUntil(dateString) {
  const start = new Date(`${todayKey()}T12:00:00`);
  const end = new Date(`${dateString}T12:00:00`);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}
