export default function WeeklyBalance({ tasks }) {
  const upcoming = tasks.filter(
    (task) => !task.completed && task.daysLeft !== null && task.daysLeft >= 0 && task.daysLeft <= 7
  );

  const estimatedHours = upcoming.reduce((sum, task) => sum + Number(task.estimateHours || 0), 0);

  let status = "Balanced";
  if (estimatedHours >= 10) status = "Heavy week";
  else if (estimatedHours >= 6) status = "Moderate load";
  else status = "Light load";

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Weekly balance</h2>
      </div>

      <div className="balance-grid">
        <div className="metric-card">
          <span className="metric-label">Upcoming hours</span>
          <strong className="metric-value">{estimatedHours}h</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Status</span>
          <strong className="metric-value">{status}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Tasks this week</span>
          <strong className="metric-value">{upcoming.length}</strong>
        </div>
      </div>
    </section>
  );
}
