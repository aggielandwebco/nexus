import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  subMonths
} from "date-fns";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, DollarSign, Star, TrendingUp, UserPlus, Users, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import KPICard from "@/components/shared/KPICard";
import { getBookings } from "@/lib/bookingService";
import { getCustomers } from "@/lib/customerService";
import { getServices } from "@/lib/serviceService";

const STATUS_OPTIONS = ["New Lead", "Contacted", "Interested", "Scheduled", "Closed"];

function money(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function Dashboard() {
  const {
    data: customers = [],
    isLoading: loadingCustomers,
    error: customerError
  } = useQuery({
    queryKey: ["customers", false],
    queryFn: () => getCustomers({ archived: false })
  });

  const {
    data: services = [],
    isLoading: loadingServices,
    error: serviceError
  } = useQuery({
    queryKey: ["services", true],
    queryFn: () => getServices({ active: true })
  });

  const {
    data: bookings = [],
    isLoading: loadingBookings,
    error: bookingError
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings
  });

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const next7Days = addDays(now, 7);
  const isLoading = loadingCustomers || loadingServices || loadingBookings;
  const error = customerError || serviceError || bookingError;

  const getService = (id) => services.find((service) => service.id === id);
  const getServicePrice = (id) => Number(getService(id)?.price || 0);
  const getCustomerName = (id) => customers.find((customer) => customer.id === id)?.name || "Unknown customer";
  const getServiceName = (id) => getService(id)?.name || "Unknown service";

  const newLeadsThisMonth = customers.filter((customer) => {
    const created = new Date(customer.created_at || customer.created_date);
    return isAfter(created, thisMonthStart) && customer.status === "New Lead";
  }).length;

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = parseISO(booking.date);
    return booking.status !== "Cancelled" && isAfter(bookingDate, now) && isBefore(bookingDate, next7Days);
  });

  const completedBookings = bookings.filter((booking) => booking.status === "Completed");
  const activeBookings = bookings.filter((booking) => booking.status !== "Cancelled");
  const bookedRevenue = activeBookings.reduce((sum, booking) => sum + getServicePrice(booking.service_id), 0);
  const completedRevenue = completedBookings.reduce((sum, booking) => sum + getServicePrice(booking.service_id), 0);
  const catalogValue = services.reduce((sum, service) => sum + Number(service.price || 0), 0);
  const avgServicePrice = services.length ? catalogValue / services.length : 0;
  const closedCustomers = customers.filter((customer) => customer.status === "Closed").length;
  const conversionRate = customers.length ? Math.round((closedCustomers / customers.length) * 100) : 0;

  const growthData = useMemo(() => {
    const rows = [];
    for (let i = 5; i >= 0; i -= 1) {
      const monthDate = subMonths(now, i);
      const monthEnd = endOfMonth(monthDate);
      rows.push({
        month: format(monthDate, "MMM"),
        customers: customers.filter((customer) => new Date(customer.created_at || customer.created_date) <= monthEnd).length
      });
    }
    return rows;
  }, [customers]);

  const bookingsRevenueData = useMemo(() => {
    const rows = [];
    for (let i = 5; i >= 0; i -= 1) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthBookings = activeBookings.filter((booking) => {
        const bookingDate = parseISO(booking.date);
        return bookingDate >= monthStart && bookingDate <= monthEnd;
      });
      rows.push({
        month: format(monthDate, "MMM"),
        bookings: monthBookings.length,
        revenue: monthBookings.reduce((sum, booking) => sum + getServicePrice(booking.service_id), 0)
      });
    }
    return rows;
  }, [activeBookings, services]);

  const servicePriceData = services
    .slice()
    .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    .slice(0, 6)
    .map((service) => ({
      name: service.name,
      price: Number(service.price || 0)
    }));

  const pipelineData = STATUS_OPTIONS.map((status) => ({
    status,
    customers: customers.filter((customer) => customer.status === status).length
  }));

  const upcomingList = upcomingBookings
    .slice()
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Live business overview powered by your customers, services, and bookings.
        </p>
      </div>

      {isLoading && (
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/40 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error.message}</p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KPICard title="Total Customers" value={customers.length} icon={Users} />
        <KPICard title="New Leads" value={newLeadsThisMonth} icon={UserPlus} subtitle="This month" />
        <KPICard title="Upcoming Bookings" value={upcomingBookings.length} icon={CalendarDays} subtitle="Next 7 days" />
        <KPICard title="Booked Value" value={money(bookedRevenue)} icon={DollarSign} subtitle="Active bookings" />
        <KPICard title="Completed Revenue" value={money(completedRevenue)} icon={TrendingUp} subtitle="Completed bookings" />
        <KPICard title="Services" value={services.length} icon={Wrench} subtitle={`${money(avgServicePrice)} avg price`} />
        <KPICard title="Catalog Value" value={money(catalogValue)} icon={DollarSign} subtitle="Sum of service prices" />
        <KPICard title="Lead Conversion" value={`${conversionRate}%`} icon={Star} subtitle={`${closedCustomers} closed customers`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border bg-card p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Customer Growth</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1C1F24", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }} />
                <Line type="monotone" dataKey="customers" stroke="#4A6C8C" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border bg-card p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Monthly Booked Revenue</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsRevenueData}>
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1C1F24", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }} />
                <Bar dataKey="revenue" fill="#C6A56B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border bg-card p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Highest Priced Services</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicePriceData} layout="vertical">
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                <YAxis type="category" dataKey="name" width={110} stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1C1F24", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }} />
                <Bar dataKey="price" fill="#4A6C8C" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border bg-card p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Customer Pipeline</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <XAxis dataKey="status" stroke="#9CA3AF" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1C1F24", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }} />
                <Bar dataKey="customers" fill="#C6A56B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Upcoming Bookings</h3>
        <div className="space-y-3">
          {upcomingList.length === 0 && <p className="text-sm text-muted-foreground">No upcoming bookings.</p>}
          {upcomingList.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{getCustomerName(booking.customer_id)}</p>
                <p className="text-xs text-muted-foreground">{getServiceName(booking.service_id)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{format(parseISO(booking.date), "MMM d")} at {booking.time}</p>
                <p className="text-xs text-muted-foreground">{money(getServicePrice(booking.service_id))}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
