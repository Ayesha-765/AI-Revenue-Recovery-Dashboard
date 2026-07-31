export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Dashboard</h3>
          <p className="text-sm text-slate-600">Manage your operations efficiently</p>
        </div>
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Logout
        </button>
      </div>
    </header>
  );
}
