export default function TaskCard({ task, onUpdate, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
      </div>

      <div className="task-body">
        <p>{task.subject}</p>
        <p>{task.notes}</p>
      </div>

      <div className="task-actions">
        {onUpdate && (
          <select
            value={task.status}
            onChange={(e) =>
              onUpdate(task.id, { status: e.target.value })
            }
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Blocked</option>
            <option>Done</option>
          </select>
        )}

        <button className="btn-secondary" onClick={onEdit}>
          Edit
        </button>

        <button className="btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
