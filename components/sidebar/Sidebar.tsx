import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/problems", label: "Problems" },
];

export default function Sidebar() {
  return (
    <aside className="h-full w-64 border-r border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Admin Panel</h2>
      <nav className="mt-8 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
