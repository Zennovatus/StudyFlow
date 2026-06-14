import CalendarPanel from "../components/CalendarPanel";

export default function CalendarView({
  tasks,
  month,
  setMonth,
  onEditTask,
  onDeleteTask,
  onUpdate
}) {
  return (
    <div className="view-stack">
      <CalendarPanel
        tasks={tasks}
        month={month}
        setMonth={setMonth}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onTaskDrop={(taskId, newDate) => onUpdate(taskId, { dueDate: newDate })}
      />
    </div>
  );
}
