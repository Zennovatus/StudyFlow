import CompanionCard from "../components/CompanionCard";

export default function CompanionView({ tasks, mode }) {
  return (
    <div className="view-stack">
      <CompanionCard tasks={tasks} mode={mode} />
    </div>
  );
}
