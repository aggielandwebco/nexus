export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1C1F24]/80 p-6 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-black/20">
      {Icon && (
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-accent">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
