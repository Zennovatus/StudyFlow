import TaskCard from "../components/TaskCard";
import RemindersPanel from "../components/RemindersPanel";
import WeeklyBalance from "../components/WeeklyBalance";

export default function DashboardView({
  tasks,
  stage,
  onRebalance,
  onUpdate,
  onEditTask,
  onDeleteTask
}) {
  const topTasks = [...tasks]
    .sort((a, b) => b.urgencyScore - a.urgencyScore)
    .slice(0, 4);

  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{stage} dashboard</h2>
            <p className="muted-text">
              Your highest-priority work and workload summary.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={onRebalance}
            type="button"
          >
            Rebalance tasks
          </button>
        </div>

        {topTasks.length === 0 ? (
          <p className="empty-state">No tasks to show.</p>
        ) : (
          <div className="task-grid">
            {topTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
          </div>
        )}
      </section>

      <div className="two-col">
        <WeeklyBalance tasks={tasks} />
        <RemindersPanel tasks={tasks} />
      </div>
    </div>
  );
}
`
