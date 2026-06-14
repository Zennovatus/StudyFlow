export default function CompanionCard({ tasks, mode }) {
  const openTasks = tasks.filter((t) => !t.completed);
  const overdue = openTasks.filter((t) => t.daysLeft !== null && t.daysLeft < 0);
  const dueSoon = openTasks.filter((t) => t.daysLeft !== null && t.daysLeft <= 3);
  const heavySubjects = [...openTasks]
    .reduce((acc, task) => {
      acc[task.subject] = (acc[task.subject] || 0) + task.estimateHours;
      return acc;
    }, {});

  const topSubject =
    Object.entries(heavySubjects).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

  const suggestions = [
    overdue.length
      ? `You have ${overdue.length} overdue task${overdue.length > 1 ? "s" : ""}. Start with the highest-priority overdue item.`
      : "No overdue tasks — nice work.",
    dueSoon.length
      ? `${dueSoon.length} task${dueSoon.length > 1 ? "s are" : " is"} due soon. Block time this week for focused completion.`
      : "Nothing urgent in the next three days.",
    `Your heaviest current subject is ${topSubject}. Consider splitting that work into smaller sessions.`,
    mode === "student"
      ? "Student mode: aim for one deep-work block and one short review block each day."
      : `Mode is ${mode}. Adjust the companion guidance copy if you want mode-specific coaching.`
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Study Companion</h2>
        <span className="subtle-label">Mode: {mode}</span>
      </div>

      <div className="companion-list">
        {suggestions.map((item, index) => (
          <div key={index} className="companion-item">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
