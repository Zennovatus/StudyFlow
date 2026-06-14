import { addDays, daysUntil } from "./dates";
import { getOccurrenceDates } from "./recurrence";
import { calculateEffortScore } from "./scoring";

export const STAGE_CONFIG = {
  "Year 7-8": { threshold: 1.5, chunkSize: 0.5 },
  "Year 9-10": { threshold: 2, chunkSize: 0.75 },
  "Senior School": { threshold: 2.5, chunkSize: 1 },
  University: { threshold: 4, chunkSize: 1.5 }
};

const STEP_LIBRARY = {
  Homework: ["Read brief", "Complete work", "Check answers"],
  Assignment: ["Research", "Plan", "Draft", "Improve", "Final check"],
  Activity: ["Prepare", "Attend", "Reflect / pack up"],
  Revision: ["Review notes", "Practice questions", "Self-check"]
};

export function makeSteps(task) {
  const labels = STEP_LIBRARY[task.type] || ["Start", "Work", "Finish"];
  const completed = Math.floor((task.progress / 100) * labels.length);
  return labels.map((label, i) => ({ id: `${task.id}-step-${i}`, title: label, done: i < completed }));
}

export function createPlan(task) {
  const cfg = STAGE_CONFIG[task.stage] || STAGE_CONFIG["Senior School"];
  const remaining = Math.max(0.5, +(task.estimateHours * (1 - task.progress / 100)).toFixed(1));
  const chunkCount = Math.max(1, Math.ceil(remaining / cfg.chunkSize));
  const labels = STEP_LIBRARY[task.type] || ["Start", "Work", "Finish"];
  const recurring = task.recurrence?.frequency && task.recurrence.frequency !== "None";

  if (recurring) {
    return getOccurrenceDates(task.startDate || task.dueDate, task.recurrence, 45).slice(0, 12).map((date, i) => ({
      id: `${task.id}-rec-${i}`,
      date,
      hours: +(task.estimateHours || 1),
      label: task.title,
      locked: true,
      recurring: true
    }));
  }

  const plan = [];
  for (let i = 0; i < chunkCount; i++) {
    plan.push({
      id: `${task.id}-plan-${i}`,
      date: addDays(task.dueDate, -Math.max(1, chunkCount - i)),
      hours: i === chunkCount - 1 ? remaining - cfg.chunkSize * (chunkCount - 1) || cfg.chunkSize : cfg.chunkSize,
      label: labels[Math.min(i, labels.length - 1)],
      locked: task.type === "Activity",
      recurring: false
    });
  }
  return plan;
}

export function createTask(payload) {
  const base = {
    ...payload,
    id: payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    estimateHours: Number(payload.estimateHours) || 1,
    progress: Number(payload.progress) || 0,
    reminderDaysBefore: Number(payload.reminderDaysBefore ?? 1)
  };
  return {
    ...base,
    plan: createPlan(base),
    steps: makeSteps(base),
    effortScore: calculateEffortScore(base)
  };
}

export function enrichTask(task) {
  const dueIn = daysUntil(task.dueDate);
  const remaining = Math.max(0, +(task.estimateHours * (1 - task.progress / 100)).toFixed(1));
  const recurring = task.recurrence?.frequency && task.recurrence.frequency !== "None";
  const status = task.progress >= 100 ? "Done" : recurring ? "Recurring" : dueIn < 0 ? "Overdue" : dueIn <= 2 ? "Due soon" : "On track";
  return { ...task, dueIn, remaining, status, effortScore: calculateEffortScore(task) };
}

export function rebalanceTasks(tasks, stage) {
  const threshold = STAGE_CONFIG[stage]?.threshold ?? 2.5;
  const clone = tasks.map((t) => ({ ...t, plan: (t.plan || []).map((p) => ({ ...p })) }));
  const daily = {};
  clone.forEach((task) => (task.plan || []).forEach((chunk) => { daily[chunk.date] = (daily[chunk.date] || 0) + chunk.hours; }));

  Object.keys(daily).sort().forEach((date) => {
    while ((daily[date] || 0) > threshold + 0.01) {
      const movable = clone
        .flatMap((task) => (task.plan || []).map((chunk) => ({ task, chunk })))
        .filter(({ task, chunk }) => chunk.date === date && !chunk.locked && task.progress < 100)
        .sort((a, b) => b.chunk.hours - a.chunk.hours)[0];
      if (!movable) break;

      let moved = false;
      for (let shift = 1; shift <= 7; shift++) {
        const target = addDays(date, -shift);
        if (target >= movable.task.dueDate) continue;
        if ((daily[target] || 0) + movable.chunk.hours <= threshold) {
          daily[date] -= movable.chunk.hours;
          daily[target] = (daily[target] || 0) + movable.chunk.hours;
          movable.chunk.date = target;
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }
  });

  return clone;
}
