export default function Metrics({ tasks, stage }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.daysLeft !== null && t.daysLeft < 0).length;
  const dueSoon = tasks.filter((t) => !t.completed && t.daysLeft !== null && t.daysLeft <= 3).length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Stage</span>
        <strong className="metric-value">{stage}</strong>
      </div>
      <div className="metric-card">
        <span className="metric-label">Total tasks</span>
        <strong className="metric-value">{total}</strong>
      </div>
      <div className="metric-card">
        <span className="metric-label">Completed</span>
        <strong className="metric-value">{completed}</strong>
      </div>
      <div className="metric-card">
        <span className="metric-label">Due soon</span>
        <strong className="metric-value">{dueSoon}</strong>
      </div>
      <div className="metric-card">
        <span className="metric-label">Overdue</span>
        <strong className="metric-value">{overdue}</strong>
      </div>
      <div className="metric-card">
        <span className="metric-label">Completion</span>
        <strong className="metric-value">{completionRate}%</strong>
      </div>
    </section>
  );
}
