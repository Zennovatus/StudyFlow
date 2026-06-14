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

export default function CalendarPanel({ tasks, month, setMonth }) {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);

  const days = [];
  const startWeekday = firstDay.getDay();

  for (let i = 0; i < startWeekday; i += 1) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), d));
  }

  function goPrevious() {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  }

  function goNext() {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
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

      <div className="calendar-grid weekday-row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="calendar-cell empty" />;

          const items = tasks.filter((task) => {
            if (!task.dueDate) return false;
            return sameDay(new Date(task.dueDate), date);
          });

          return (
            <div key={date.toISOString()} className="calendar-cell">
              <div className="calendar-date">{date.getDate()}</div>
              <div className="calendar-items">
                {items.map((task) => (
                  <div
                    key={task.id}
                    className={`calendar-pill priority-${task.priority}`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
