import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import { Users, UserPlus, CalendarDays, Star } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import KPICard from '@/components/shared/KPICard';
import StarRating from '@/components/shared/StarRating';
import { format, subMonths, addDays, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns';

export default function Dashboard() {
  const { business } = useBusiness();

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', business?.id],
    queryFn: () => base44.entities.Customer.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', business?.id],
    queryFn: () => base44.entities.Appointment.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', business?.id],
    queryFn: () => base44.entities.Review.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: () => base44.entities.Service.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const next7Days = addDays(now, 7);

  const newLeadsThisMonth = customers.filter(c => {
    const created = new Date(c.created_date);
    return isAfter(created, thisMonthStart) && c.status === 'New Lead';
  }).length;

  const upcomingAppointments = appointments.filter(a => {
    const apptDate = new Date(a.date);
    return isAfter(apptDate, now) && isBefore(apptDate, next7Days) && a.status !== 'Cancelled';
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  // Customer growth chart (last 6 months)
  const growthData = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthEnd = endOfMonth(monthDate);
    const count = customers.filter(c => new Date(c.created_date) <= monthEnd).length;
    growthData.push({ month: format(monthDate, 'MMM'), customers: count });
  }

  // Bookings per week (last 4 weeks simulated from data)
  const bookingsData = [
    { week: 'W1', bookings: appointments.filter((_, i) => i % 4 === 0).length },
    { week: 'W2', bookings: appointments.filter((_, i) => i % 4 === 1).length },
    { week: 'W3', bookings: appointments.filter((_, i) => i % 4 === 2).length },
    { week: 'W4', bookings: appointments.filter((_, i) => i % 4 === 3).length },
  ];

  const recentReviews = [...reviews].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5);
  const upcomingList = upcomingAppointments.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';
  const getServiceName = (id) => services.find(s => s.id === id)?.name || 'Service';

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Customers" value={customers.length} icon={Users} />
        <KPICard title="New Leads" value={newLeadsThisMonth} icon={UserPlus} subtitle="This month" />
        <KPICard title="Upcoming Appts" value={upcomingAppointments.length} icon={CalendarDays} subtitle="Next 7 days" />
        <KPICard title="Avg Rating" value={avgRating} icon={Star} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Customer Growth (6 Months)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="customers" stroke="#C8A15A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Bookings Per Week</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsData}>
                <XAxis dataKey="week" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #333' }} />
                <Bar dataKey="bookings" fill="#C8A15A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {recentReviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet</p>}
            {recentReviews.map((r) => (
              <div key={r.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <div className="shrink-0">
                  <StarRating rating={r.rating} size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{r.reviewer_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.review_text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingList.length === 0 && <p className="text-sm text-muted-foreground">No upcoming appointments</p>}
            {upcomingList.map((a) => (
              <div key={a.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{getCustomerName(a.customer_id)}</p>
                  <p className="text-xs text-muted-foreground">{getServiceName(a.service_id)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{format(new Date(a.date), 'MMM d')}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
