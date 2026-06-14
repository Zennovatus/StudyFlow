export default function TaskCard({ task, onUpdate }) {
  return (
    <article className={`task-card ${task.completed ? "is-complete" : ""}`}>
      <div className="task-card-top">
        <div>
          <h3>{task.title}</h3>
          <p className="task-meta">
            {task.subject} • {task.category} • {task.estimateHours}h
          </p>
        </div>
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <p className="task-notes">{task.notes || "No notes added."}</p>

      <div className="task-card-bottom">
        <div className="task-status">
          <span>{task.dueDate ? `Due ${task.dueDate}` : "No due date"}</span>
          <span>{task.status}</span>
        </div>

        {onUpdate && (
          <div className="task-actions">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  onUpdate(task.id, { completed: e.target.checked })
                }
              />
              Done
            </label>

            <select
              value={task.priority}
              onChange={(e) => onUpdate(task.id, { priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        )}
      </div>
    </article>
  );
}
