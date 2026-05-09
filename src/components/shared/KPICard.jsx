import { Card } from "@/components/ui/card";

export default function KPICard({ title, value, icon: Icon, subtitle }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="absolute right-4 top-4 rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </Card>
  );
}
