import { useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "./lib/storage";
import { STARTER_TASKS } from "./data/starterTasks";
import { enrichTask, rebalanceTasks, createTask } from "./lib/planner";
import Header from "./components/Header";
import Metrics from "./components/Metrics";
import AddTaskModal from "./components/AddTaskModal";
import DashboardView from "./views/DashboardView";
import PlannerView from "./views/PlannerView";
import CalendarView from "./views/CalendarView";
import CompanionView from "./views/CompanionView";

export default function App() {
  const [stage, setStage] = useState("Senior School");
  const [mode, setMode] = useState("student");
  const [view, setView] = useState("dashboard");
  const [tasks, setTasks] = useState(STARTER_TASKS);
  const [showAdd, setShowAdd] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = loadState();
    if (saved?.tasks?.length) setTasks(saved.tasks);
    if (saved?.stage) setStage(saved.stage);
  }, []);

  useEffect(() => {
    saveState({ stage, tasks });
  }, [stage, tasks]);

  const enriched = useMemo(() => tasks.map(enrichTask), [tasks]);
  const visibleTasks = useMemo(
    () => enriched.filter((task) => [task.title, task.subject, task.notes].join(" ").toLowerCase().includes(search.toLowerCase())),
    [enriched, search]
  );

  function handleAddTask(payload) {
    const task = createTask({ ...payload, stage });
    setTasks((prev) => [task, ...prev]);
    setShowAdd(false);
    setView("planner");
  }

  function handleUpdateTask(taskId, changes) {
    setTasks((prev) => prev.map((task) => task.id === taskId ? createTask({ ...task, ...changes, id: task.id, stage: task.stage }) : task));
  }

  function handleRebalance() {
    setTasks((prev) => rebalanceTasks(prev, stage));
  }

  return (
    <div className="app-shell">
      <Header
        stage={stage}
        setStage={setStage}
        mode={mode}
        setMode={setMode}
        view={view}
        setView={setView}
        setShowAdd={setShowAdd}
      />

      <main className="app-content">
        <Metrics tasks={enriched} stage={stage} />

        {view === "dashboard" && <DashboardView tasks={visibleTasks} stage={stage} onRebalance={handleRebalance} onUpdate={handleUpdateTask} />}
        {view === "planner" && <PlannerView tasks={visibleTasks} onUpdate={handleUpdateTask} onRebalance={handleRebalance} search={search} setSearch={setSearch} />}
        {view === "calendar" && <CalendarView tasks={visibleTasks} month={calendarMonth} setMonth={setCalendarMonth} />}
        {view === "companion" && <CompanionView tasks={visibleTasks} mode={mode} />}
      </main>

      <AddTaskModal open={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAddTask} />
    </div>
  );
}
