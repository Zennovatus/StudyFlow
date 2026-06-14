import { useMemo, useState } from "react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRIORITY_STYLES = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
  Critical: "priority-critical"
};

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfCalendarGrid(date) {
  const first = startOfMonth(date);
  const result = new Date(first);
  result.setDate(first.getDate() - first.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfCalendarGrid(date) {
  const last = endOfMonth(date);
  const result = new Date(last);
  result.setDate(last.getDate() + (6 - last.getDay()));
  result.setHours(23, 59, 59, 999);
  return result;
}

function formatMonthLabel(date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseTaskDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function groupTasksByDate(tasks) {
  const map = new Map();

  for (const task of tasks) {
    const due = parseTaskDate(task.dueDate);
    if (!due) continue;

    const key = formatDateKey(due);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(task);
  }

  for (const [, list] of map.entries()) {
    list.sort((a, b) => {
      const aUrgency = a.urgencyScore ?? 0;
      const bUrgency = b.urgencyScore ?? 0;
      return bUrgency - aUrgency;
    });
  }

  return map;
}

function buildCalendarDays(month) {
  const start = startOfCalendarGrid(month);
  const end = endOfCalendarGrid(month);
  const days = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function TaskPill({
  task,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragEnd
}) {
  const priorityClass = PRIORITY_STYLES[task.priority] || "priority-medium";

  return (
    <div
      className={`calendar-task ${priorityClass}`}
      draggable
      onDragStart={(event) => onDragStart(event, task)}
      onDragEnd={onDragEnd}
      title={task.title}
    >
      <div className="calendar-task-main">
        <span className="calendar-task-title">{task.title}</span>
        {task.subject ? (
          <span className="calendar-task-subject">{task.subject}</span>
        ) : null}
      </div>

      <div className="calendar-task-actions">
        <button
          type="button"
          className="calendar-task-btn"
          onClick={(event) => {
            event.stopPropagation();
            onEditTask?.(task);
          }}
        >
          Edit
        </button>

        <button
          type="button"
          className="calendar-task-btn danger"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteTask?.(task);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function CalendarPanel({
  tasks,
  month,
  setMonth,
  onEditTask,
  onDeleteTask,
  onTaskDrop
}) {
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  const today = new Date();

  const days = useMemo(() => buildCalendarDays(month), [month]);
  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks]);

  function goPrevMonth() {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  }

  function goNextMonth() {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  }

  function handleDragStart(event, task) {
    setDraggingTaskId(task.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(task.id));
  }

  function handleDragEnd() {
    setDraggingTaskId(null);
    setDragOverDate(null);
  }

  function handleDragOver(event, dateKey) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverDate(dateKey);
  }

  function handleDragLeave(dateKey) {
    if (dragOverDate === dateKey) {
      setDragOverDate(null);
    }
  }

  function handleDrop(event, date) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("text/plain");
    const newDate = formatDateKey(date);

    setDragOverDate(null);
    setDraggingTaskId(null);

    if (!taskId) return;
    if (onTaskDrop) {
      onTaskDrop(taskId, newDate);
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Calendar</h2>
          <p className="muted-text">
            Monthly study plan with drag-and-drop scheduling.
          </p>
        </div>

        <div className="inline-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={goPrevMonth}
          >
            Prev
          </button>

          <div className="calendar-month-label">{formatMonthLabel(month)}</div>

          <button
            type="button"
            className="secondary-btn"
            onClick={goNextMonth}
          >
            Next
          </button>
        </div>
      </div>

      <div className="calendar-board">
        <div className="calendar-weekdays">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day) => {
            const dateKey = formatDateKey(day);
            const dayTasks = tasksByDate.get(dateKey) || [];
            const isTodayCell = isSameDay(day, today);
            const isCurrentMonth = day.getMonth() === month.getMonth();
            const isDropTarget = dragOverDate === dateKey;

            return (
              <div
                key={dateKey}
                className={[
                  "calendar-cell",
                  isCurrentMonth ? "current-month" : "outside-month",
                  isTodayCell ? "today" : "",
                  isDropTarget ? "drag-over" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                onDragOver={(event) => handleDragOver(event, dateKey)}
                onDragLeave={() => handleDragLeave(dateKey)}
                onDrop={(event) => handleDrop(event, day)}
              >
                <div className="calendar-cell-header">
                  <span className="calendar-day-number">{day.getDate()}</span>
                  {dayTasks.length > 0 ? (
                    <span className="calendar-day-count">{dayTasks.length}</span>
                  ) : null}
                </div>

                <div className="calendar-cell-body">
                  {dayTasks.length === 0 ? (
                    <div className="calendar-empty-slot">
                      {draggingTaskId ? "Drop here" : ""}
                    </div>
                  ) : (
                    dayTasks.map((task) => (
                      <TaskPill
                        key={task.id}
                        task={task}
                        onEditTask={onEditTask}
                        onDeleteTask={onDeleteTask}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
