import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  subject: "",
  dueDate: "",
  notes: "",
  priority: "medium",
  estimateHours: 1,
  category: "study",
  recurrence: "none"
};

export default function AddTaskModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  if (!open) return null;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add a new task</h2>
          <button className="ghost-btn" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Biology worksheet"
              required
            />
          </label>

          <label>
            Subject
            <input
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="e.g. Biology"
            />
          </label>

          <label>
            Due date
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </label>

          <label>
            Priority
            <select
              value={form.priority}
              onChange={(e) => updateField("priority", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label>
            Estimated hours
            <input
              type="number"
              min="1"
              max="20"
              value={form.estimateHours}
              onChange={(e) => updateField("estimateHours", Number(e.target.value))}
            />
          </label>

          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              <option value="study">Study</option>
              <option value="assignment">Assignment</option>
              <option value="revision">Revision</option>
              <option value="exam">Exam prep</option>
            </select>
          </label>

          <label>
            Recurrence
            <select
              value={form.recurrence}
              onChange={(e) => updateField("recurrence", e.target.value)}
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>

          <label>
            Notes
            <textarea
              rows="4"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Extra context, checklist, reminders..."
            />
          </label>

          <div className="modal-actions">
            <button className="ghost-btn" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="primary-btn" type="submit">
              Save task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
