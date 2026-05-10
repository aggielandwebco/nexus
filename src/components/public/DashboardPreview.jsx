import { CalendarDays, DollarSign, MessageSquare, Star, Users, Wand2 } from "lucide-react";

const stats = [
  ["Customers", "1,284", Users],
  ["Bookings", "86", CalendarDays],
  ["Reviews", "4.8", Star],
  ["Revenue", "$42.6k", DollarSign]
];

const activity = ["New lead from website", "Review request sent", "Booking confirmed", "AI follow-up drafted"];

export default function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-[#1C1F24]/90 p-4 shadow-2xl shadow-black/30">
      <div className="rounded-2xl border border-white/10 bg-[#111315] p-4">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Live Dashboard</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Growth Command Center</h3>
          </div>
          <div className="rounded-full bg-primary/20 px-3 py-1 text-xs text-white">Mock Data</div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <Icon className="h-4 w-4 text-accent" />
              <p className="mt-3 text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Revenue Trend</p>
              <p className="text-xs text-accent">+18%</p>
            </div>
            <div className="mt-5 flex h-28 items-end gap-2">
              {[34, 48, 38, 62, 58, 74, 68, 88, 78, 96].map((height, index) => (
                <div key={index} className="flex-1 rounded-t bg-gradient-to-t from-primary to-accent" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Wand2 className="h-4 w-4 text-accent" />
              Follow-ups
            </div>
            <div className="mt-4 space-y-3">
              {activity.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-[#1C1F24] p-2 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
