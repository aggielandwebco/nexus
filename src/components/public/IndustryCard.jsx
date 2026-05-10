export default function IndustryCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1C1F24]/80 p-6 transition hover:border-primary/60 hover:bg-[#20242A]">
      {Icon && <Icon className="h-6 w-6 text-accent" />}
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>}
    </div>
  );
}
