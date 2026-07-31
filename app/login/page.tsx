export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to access your dashboard.</p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
