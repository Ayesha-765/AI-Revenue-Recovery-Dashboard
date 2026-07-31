import StatCard from "../cards/StatCard";
import ProblemsList from "../problems/ProblemsList";

export default function OverviewPanel() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Orders" value="128" description="Processed this week" />
        <StatCard title="Customers" value="84" description="Active accounts" />
        <StatCard title="Problems" value="12" description="Need attention" />
      </div>
      <ProblemsList />
    </section>
  );
}
