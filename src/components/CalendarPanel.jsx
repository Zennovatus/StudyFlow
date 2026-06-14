function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export default function CalendarPanel({
  tasks,
  month,
  setMonth,
  onEditTask,
  onDeleteTask,
  onTaskDrop
}) {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);

  const days = [];
  const startWeekday = firstDay.getDay();

  // fill leading blanks
  for (let i = 0; i < startWeekday; i += 1) {
    days.push(null);
  }

  // fill month days
  for (let d = 1; d <= lastDay.getDate(); d += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), d));
  }

  function goPrevious() {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  }

  function goNext() {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  }

  function handleDragStart(e, task) {
    e.dataTransfer.setData("taskId", task.id);
  }

  function handleDrop(e, date) {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId || !onTaskDrop) return;

    onTaskDrop(taskId, date.toISOString());
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>
          {month.toLocaleString(undefined, {
            month: "long",
            year: "numeric"
          })}
        </h2>

        <div className="inline-actions">
          <button className="ghost-btn" onClick={goPrevious} type="button">
            ← Prev
          </button>
          <button className="ghost-btn" onClick={goNext} type="button">
            Next →
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="calendar-grid weekday-row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {days.map((date, index) => {
          if (!date) {
            return (
              <div key={`empty-${index}`} className="calendar-cell empty" />
            );
          }

          const items = tasks.filter((task) => {
            if (!task.dueDate) return false;
            return sameDay(new Date(task.dueDate), date);
          });

          return (
            <div
              key={formatKey(date)}
              className="calendar-cell"
              onDrop={(e) => handleDrop(e, date)}
              onDragOver={handleDragOver}
            >
              <div className="calendar-date">
                {date.getDate()}
                {items.length > 0 && (
                  <span className="calendar-count">{items.length}</span>
                )}
              </div>

              <div className="calendar-items">
                {items.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={`calendar-pill priority-${task.priority}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    title={task.title}
                  >
                    <span className="pill-title">{task.title}</span>

                    <div className="pill-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask?.(task);
                        }}
                      >
                        ✎
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask?.(task);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {items.length > 3 && (
                  <div className="calendar-more">
                    +{items.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
