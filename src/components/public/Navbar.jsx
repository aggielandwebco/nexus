import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const links = [
  ["/", "Home"],
  ["/features", "Features"],
  ["/pricing", "Pricing"],
  ["/industries", "Industries"],
  ["/contact", "Contact"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm transition ${isActive ? "text-white" : "text-muted-foreground hover:text-white"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111315]/85 backdrop-blur-xl">
      <div className="nexus-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandLogo className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm text-muted-foreground transition hover:text-white">
            Login
          </Link>
          <Link to="/contact" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110">
            Book a Demo
          </Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white md:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#111315] md:hidden">
          <div className="nexus-container flex flex-col gap-2 py-4">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className={linkClass}>
                {label}
              </NavLink>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-md border border-white/10 px-4 py-2 text-center text-sm text-white">
                Login
              </Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="rounded-md bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground">
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
