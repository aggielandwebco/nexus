import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="nexus-container">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1C1F24] to-[#14171A] p-8 text-center shadow-2xl shadow-black/20 md:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Integris Nexus</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            Ready to grow with a system that actually works?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Book a demo and see how Integris Nexus can organize your customers, automate follow-ups, improve reviews, and help your business run smarter.
          </p>
          <Link to="/contact" className="mt-8 inline-flex rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:brightness-110">
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
