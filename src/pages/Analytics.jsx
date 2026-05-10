import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CalendarDays, Star, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import KPICard from "@/components/shared/KPICard";
import { getCustomers } from "@/lib/customerService";

const STATUS_OPTIONS = ["New Lead", "Contacted", "Interested", "Scheduled", "Closed"];

export default function Analytics() {
  const {
    data: customers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["customers", false],
    queryFn: () => getCustomers({ archived: false })
  });

  const statusData = useMemo(
    () =>
      STATUS_OPTIONS.map((status) => ({
        name: status,
        customers: customers.filter((customer) => customer.status === status).length
      })),
    [customers]
  );

  const closedCustomers = customers.filter((customer) => customer.status === "Closed").length;
  const conversionRate = customers.length ? Math.round((closedCustomers / customers.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Track customer activity, lead status, and business growth signals.
        </p>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Active Customers" value={customers.length} icon={Users} subtitle="Stored in Supabase" />
        <KPICard title="Closed Customers" value={closedCustomers} icon={TrendingUp} subtitle={`${conversionRate}% conversion`} />
        <KPICard title="Bookings" value="0" icon={CalendarDays} subtitle="Booking data connects next" />
        <KPICard title="Reviews" value="0" icon={Star} subtitle="Review data connects next" />
      </div>

      <Card className="border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">Customer Pipeline</h2>
          <p className="text-sm text-muted-foreground">Active customers grouped by status.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                cursor={{ fill: "rgba(74,108,140,0.12)" }}
                contentStyle={{
                  background: "#1C1F24",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  color: "#F3F4F6"
                }}
              />
              <Bar dataKey="customers" fill="#4A6C8C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
