import OverviewPanel from "../../components/dashboard/OverviewPanel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-600">A quick snapshot of your business operations.</p>
      </div>
      <OverviewPanel />
    </div>
  );
}
