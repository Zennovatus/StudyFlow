export default function Header({ stage, setStage }) {
  return (
    <header className="header">
      <h1>StudyFlow Lite</h1>

      <select value={stage} onChange={(e) => setStage(e.target.value)}>
        <option>Year 7-8</option>
        <option>Year 9-10</option>
      </select>
    </header>
  );
}
