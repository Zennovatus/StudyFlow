export function normaliseDate(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function startOfDay(dateValue = new Date()) {
  const d = new Date(dateValue);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntil(dateValue) {
  if (!dateValue) return null;

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dateValue));

  if (Number.isNaN(due.getTime())) return null;

  const diff = due.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function formatMonthYear(dateValue) {
  const d = new Date(dateValue);
  return d.toLocaleString(undefined, {
    month: "long",
    year: "numeric"
  });
}

export function isSameDay(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
