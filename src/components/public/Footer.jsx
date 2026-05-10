import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const links = [
  ["/", "Home"],
  ["/features", "Features"],
  ["/pricing", "Pricing"],
  ["/industries", "Industries"],
  ["/contact", "Contact"],
  ["/login", "Login"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
  ["/refund", "Refund Policy"]
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0D0F11]">
      <div className="nexus-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <BrandLogo className="h-12 w-auto" />
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Integris Nexus is a CRM and customer growth platform for businesses that need leads, bookings, reviews, analytics, AI follow-ups, and billing in one clean dashboard.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className="text-sm text-muted-foreground transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-muted-foreground">
          © 2026 Integris Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
