import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Star,
  Users,
  Wrench,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/customers", label: "Customers", icon: Users },
  { path: "/reviews", label: "Reviews", icon: Star },
  { path: "/bookings", label: "Bookings", icon: CalendarDays },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/ai-tools", label: "AI Tools", icon: Sparkles },
  { path: "/services", label: "Services", icon: Wrench },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/billing", label: "Billing", icon: CreditCard }
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && <span className="font-bold text-primary">Aggieland CRM</span>}
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground md:inline-flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              isActive(path)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => base44.auth?.logout?.()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
      <aside
        className={`hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all md:flex ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
