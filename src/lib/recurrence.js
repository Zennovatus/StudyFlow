import { normaliseDate } from "./dates";

export function getNextRecurringDate(baseDate, recurrence) {
  if (!baseDate || !recurrence || recurrence === "none") return normaliseDate(baseDate);

  const d = new Date(baseDate);

  if (recurrence === "daily") d.setDate(d.getDate() + 1);
  if (recurrence === "weekly") d.setDate(d.getDate() + 7);
  if (recurrence === "monthly") d.setMonth(d.getMonth() + 1);

  return normaliseDate(d);
}

export function expandRecurringTask(task) {
  return {
    ...task,
    recurrence: task.recurrence || "none"
  };
}
``
