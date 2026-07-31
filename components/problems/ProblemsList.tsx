const problems = [
  { id: 1, title: "Login issue", status: "Open" },
  { id: 2, title: "Invoice delay", status: "In progress" },
  { id: 3, title: "Delivery mismatch", status: "Resolved" },
];

export default function ProblemsList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Recent Problems</h3>
      <ul className="mt-4 space-y-3">
        {problems.map((problem) => (
          <li key={problem.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-700">{problem.title}</span>
            <span className="text-sm font-medium text-slate-500">{problem.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
