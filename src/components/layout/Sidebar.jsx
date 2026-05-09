import { NavLink } from "react-router-dom";
import { useBusiness } from "@/hooks/useBusiness";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/customers", label: "Customers" },
  { to: "/reviews", label: "Reviews" },
  { to: "/bookings", label: "Bookings" },
  { to: "/analytics", label: "Analytics" },
  { to: "/ai-tools", label: "AI Tools" },
  { to: "/services", label: "Services" },
  { to: "/settings", label: "Settings" },
  { to: "/billing", label: "Billing" }
];

export default function Sidebar() {
  const { business } = useBusiness();

  return (
    <aside className="border-b border-zinc-800 bg-zinc-950 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6">
        <p className="text-sm text-zinc-400">CRM</p>
        <h1 className="text-xl font-bold">{business.name}</h1>
      </div>
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition",
                isActive ? "bg-primary text-black" : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
