import { Link, useLocation } from "react-router-dom";

const links = [
  ["/", "Dashboard"],
  ["/customers", "Customers"],
  ["/reviews", "Reviews"],
  ["/bookings", "Bookings"],
  ["/analytics", "Analytics"],
  ["/ai-tools", "AI Tools"],
  ["/services", "Services"],
  ["/settings", "Settings"],
  ["/billing", "Billing"],
  ["/developer", "Developer"]
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card p-5">
      <h1 className="mb-8 text-2xl font-bold text-primary">AW Nexus</h1>

      <nav className="space-y-2">
        {links.map(([path, label]) => (
          <Link
            key={path}
            to={path}
            className={`block rounded-md px-3 py-2 transition ${
              location.pathname === path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
