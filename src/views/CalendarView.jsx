import CalendarPanel from "../components/CalendarPanel";

export default function CalendarView({
  tasks,
  month,
  setMonth,
  onEditTask,
  onDeleteTask
}) {
  return (
    <div className="view-stack">
      <CalendarPanel
        tasks={tasks}
        month={month}
        setMonth={setMonth}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}
