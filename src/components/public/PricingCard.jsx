import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingCard({ name, price, description, features, highlighted = false }) {
  return (
    <div className={`rounded-2xl border p-6 transition hover:-translate-y-1 ${highlighted ? "border-accent/60 bg-[#20242A] shadow-2xl shadow-accent/10" : "border-white/10 bg-[#1C1F24]/80"}`}>
      {highlighted && <div className="mb-4 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">Most Popular</div>}
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <div className="mt-4 flex items-end gap-1">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="pb-1 text-muted-foreground">/mo</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/contact" className={`mt-7 inline-flex w-full justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition ${highlighted ? "bg-accent text-accent-foreground hover:brightness-110" : "border border-white/10 text-white hover:bg-white/5"}`}>
        Book a Demo
      </Link>
    </div>
  );
}
