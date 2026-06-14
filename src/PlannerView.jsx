import TaskCard from "../components/TaskCard";

export default function PlannerView({
  tasks,
  onUpdate,
  onRebalance,
  search,
  setSearch
}) {
  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <h2>Planner</h2>
          <div className="inline-actions">
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, subjects, notes..."
            />
            <button className="primary-btn" onClick={onRebalance} type="button">
              Rebalance
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">No tasks match your search.</p>
        ) : (
          <div className="view-stack">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={onUpdate} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
