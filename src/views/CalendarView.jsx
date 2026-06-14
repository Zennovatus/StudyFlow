import CalendarPanel from "../components/CalendarPanel";

export default function CalendarView({ tasks, month, setMonth }) {
  return (
    <div className="view-stack">
      <CalendarPanel tasks={tasks} month={month} setMonth={setMonth} />
    </div>
  );
}
