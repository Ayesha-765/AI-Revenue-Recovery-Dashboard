import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section className="space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-white">
                Bid Management
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Build, monitor, and win bids with a smarter dashboard.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Launch your bidding operations with an intuitive dashboard for managing auctions, tracking offers, and reviewing vendor performance.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Open Dashboard
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Sign In
              </Link>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/70">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Your bidding control center</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Manage all active bids, review incoming proposals, and keep your winning strategy on track.
                </p>
              </div>

              <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Active Auctions</p>
                    <p className="text-xs text-slate-500">22 live listings</p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">22</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Pending Offers</p>
                    <p className="text-xs text-slate-500">14 proposals waiting</p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">14</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Won Contracts</p>
                    <p className="text-xs text-slate-500">8 this quarter</p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">8</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
