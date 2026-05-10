import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const links = [
  ["/app", "Dashboard"],
  ["/app/customers", "Customers"],
  ["/app/reviews", "Reviews"],
  ["/app/bookings", "Bookings"],
  ["/app/analytics", "Analytics"],
  ["/app/ai-tools", "AI Tools"],
  ["/app/services", "Services"],
  ["/app/settings", "Settings"],
  ["/app/billing", "Billing"],
  ["/app/developer", "Developer"]
];

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const location = useLocation();

  const content = (
    <>
      <div className="mb-8 flex items-center justify-between gap-3">
        <Link to="/app" className="text-2xl font-bold text-primary" onClick={() => setMobileOpen(false)}>
          Integris Nexus
        </Link>
        <button type="button" onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-muted-foreground md:hidden" aria-label="Close sidebar">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-2">
        {links.map(([path, label]) => {
          const active = path === "/app" ? location.pathname === "/app" : location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)} className={`block rounded-md px-3 py-2.5 text-sm transition ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              {label}
            </Link>
          );
        })}
      </nav>

      <Link to="/" className="mt-8 block rounded-md border border-border px-3 py-2 text-center text-sm text-muted-foreground transition hover:text-foreground" onClick={() => setMobileOpen(false)}>
        Public Site
      </Link>
    </>
  );

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card p-5 transition-transform md:sticky md:top-0 md:z-auto md:h-screen md:w-64 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {content}
      </aside>
    </>
  );
}
