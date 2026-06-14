import { daysUntil } from "./dates";

export function calculateEffortScore(task) {
  const urgency = Math.max(1, 10 - Math.max(0, daysUntil(task.dueDate)));
  const hours = Number(task.estimateHours || 0);
  const progressPenalty = 1 + (100 - Number(task.progress || 0)) / 100;
  const typeWeight =
    task.type === "Assignment" ? 1.35 :
    task.type === "Revision" ? 1.15 :
    task.type === "Activity" ? 0.8 : 1;

  return Math.round(hours * urgency * progressPenalty * typeWeight);
}
