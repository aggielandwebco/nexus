import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import KPICard from '@/components/shared/KPICard';
import { DollarSign, TrendingUp, Star } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns';

const PIE_COLORS = ['#3B82F6', '#EAB308', '#A855F7', '#C8A15A', '#22C55E'];

export default function Analytics() {
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

  // New customers per month (last 12)
  const customerMonthly = [];
  for (let i = 11; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const ms = startOfMonth(monthDate);
    const me = endOfMonth(monthDate);
    const count = customers.filter(c => {
      const d = new Date(c.created_date);
      return isAfter(d, ms) && isBefore(d, me);
    }).length;
    customerMonthly.push({ month: format(monthDate, 'MMM'), count });
  }

  // Appointments per month (last 12)
  const apptMonthly = [];
  for (let i = 11; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const ms = startOfMonth(monthDate);
    const me = endOfMonth(monthDate);
    const count = appointments.filter(a => {
      const d = new Date(a.date);
      return isAfter(d, ms) && isBefore(d, me);
    }).length;
    apptMonthly.push({ month: format(monthDate, 'MMM'), count });
  }

  // Customer status breakdown
  const statusCounts = {};
  customers.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Revenue
  const completedAppts = appointments.filter(a => a.status === 'Completed');
  const revenue = completedAppts.reduce((sum, a) => {
    const svc = services.find(s => s.id === a.service_id);
    return sum + (svc?.price || 0);
  }, 0);

  // Conversion rate
  const totalLeads = customers.length;
  const closedLeads = customers.filter(c => c.status === 'Closed').length;
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

  // Avg rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Total Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} />
        <KPICard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} />
        <KPICard title="Avg Rating" value={avgRating} icon={Star} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">New Customers per Month</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerMonthly}>
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #333', color: '#F5F5F5' }} />
                <Line type="monotone" dataKey="count" stroke="#C8A15A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Appointments per Month</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apptMonthly}>
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #333', color: '#F5F5F5' }} />
                <Bar dataKey="count" fill="#C8A15A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Customer Status Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #333', color: '#F5F5F5' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
