import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
