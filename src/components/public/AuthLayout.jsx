import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="nexus-glow flex min-h-screen items-center justify-center px-5 py-12 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1C1F24]/90 p-6 shadow-2xl shadow-black/30">
        <Link to="/" className="mb-8 inline-flex">
          <BrandLogo className="h-12 w-auto" />
        </Link>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
