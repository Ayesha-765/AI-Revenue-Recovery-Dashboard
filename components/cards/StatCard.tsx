type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}
