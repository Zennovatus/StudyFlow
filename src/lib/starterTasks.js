import { addDays, todayKey } from "../lib/dates";
import { createTask } from "../lib/planner";

export const STARTER_TASKS = [
  createTask({
    title: "English essay draft",
    subject: "English",
    type: "Assignment",
    dueDate: addDays(todayKey(), 5),
    startDate: addDays(todayKey(), 5),
    estimateHours: 4,
    progress: 20,
    priority: "High",
    notes: "Finish draft and improve conclusion.",
    stage: "Senior School",
    reminderDaysBefore: 2,
    recurrence: { frequency: "None", interval: 1, weekdays: [] }
  }),
  createTask({
    title: "Basketball training",
    subject: "Sport",
    type: "Activity",
    dueDate: addDays(todayKey(), 1),
    startDate: addDays(todayKey(), 1),
    estimateHours: 1.5,
    progress: 0,
    priority: "Medium",
    notes: "Team training session.",
    stage: "Senior School",
    reminderDaysBefore: 0,
    recurrence: { frequency: "Weekly", interval: 1, weekdays: [2, 4] }
  })
];
