import { addDays, dateKey, todayKey } from "./dates";

export function getOccurrenceDates(startDate, recurrence, rangeDays = 60) {
  const out = [];
  const start = new Date(`${startDate}T12:00:00`);
  const today = new Date(`${todayKey()}T12:00:00`);
  const end = new Date(`${addDays(todayKey(), rangeDays)}T12:00:00`);

  if (!recurrence || recurrence.frequency === "None") return [dateKey(start)];

  if (recurrence.frequency === "Daily") {
    let cursor = new Date(start);
    while (cursor <= end) {
      if (cursor >= today) out.push(dateKey(cursor));
      cursor.setDate(cursor.getDate() + (recurrence.interval || 1));
    }
  }

  if (recurrence.frequency === "Weekly") {
    const weekdays = recurrence.weekdays?.length ? recurrence.weekdays : [start.getDay()];
    let cursor = new Date(today > start ? today : start);
    while (cursor <= end) {
      if (weekdays.includes(cursor.getDay())) out.push(dateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return out.length ? out : [dateKey(start)];
}
