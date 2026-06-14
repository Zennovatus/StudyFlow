import { normaliseDate, daysUntil } from "./dates";
import { expandRecurringTask } from "./recurrence";
import { getTaskStatus, getUrgencyScore, sortTasksForPlanner } from "./scoring";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createTask(input = {}) {
  const recurring = expandRecurringTask(input);

  return {
    id: recurring.id ?? generateId(),
    title: recurring.title?.trim() || "Untitled task",
    subject: recurring.subject?.trim() || "General",
    notes: recurring.notes?.trim() || "",
    dueDate: normaliseDate(recurring.dueDate),
    stage: recurring.stage || "Senior School",
    priority: recurring.priority || "medium",
    estimateHours: Number(recurring.estimateHours ?? 1),
    completed: Boolean(recurring.completed),
    category: recurring.category || "study",
    recurrence: recurring.recurrence || "none",
    createdAt: recurring.createdAt || new Date().toISOString()
  };
}

export function enrichTask(task) {
  const safe = createTask(task);
  const computedDaysLeft = daysUntil(safe.dueDate);

  const enriched = {
    ...safe,
    daysLeft: computedDaysLeft
  };

  return {
    ...enriched,
    status: getTaskStatus(enriched),
    urgencyScore: getUrgencyScore(enriched)
  };
}

export function rebalanceTasks(tasks, stage) {
  const updated = tasks.map((task) => {
    const enriched = enrichTask(task);

    let priority = task.priority || "medium";

    if (!task.completed) {
      if (enriched.daysLeft !== null && enriched.daysLeft <= 1) priority = "high";
      else if (enriched.daysLeft !== null && enriched.daysLeft <= 5) priority = "medium";
      else if (!task.priority) priority = "low";
    }

    return createTask({
      ...task,
      priority,
      stage: task.stage || stage
    });
  });

  return sortTasksForPlanner(updated.map(enrichTask)).map((task) =>
    createTask(task)
  );
}
