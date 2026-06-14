export default function RemindersPanel({ tasks }) {
  const reminders = tasks
    .filter((task) => !task.completed && task.daysLeft !== null && task.daysLeft <= 7)
    .sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999))
    .slice(0, 5);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Upcoming reminders</h2>
      </div>

      {reminders.length === 0 ? (
        <p className="empty-state">No reminders in the next 7 days.</p>
      ) : (
        <div className="stack">
          {reminders.map((task) => (
            <div key={task.id} className="reminder-row">
              <div>
                <strong>{task.title}</strong>
                <div className="muted-text">{task.subject}</div>
              </div>
              <span className="subtle-label">
                {task.daysLeft < 0
                  ? "Overdue"
                  : task.daysLeft === 0
                  ? "Today"
                  : `${task.daysLeft}d`}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
