import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import AppointmentModal from '@/components/bookings/AppointmentModal';

const statusColors = {
  'Pending': 'bg-yellow-500/20 text-yellow-400',
  'Confirmed': 'bg-primary/20 text-primary',
  'Completed': 'bg-green-500/20 text-green-400',
  'Cancelled': 'bg-red-500/20 text-red-400',
};

export default function Bookings() {
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', business?.id],
    queryFn: () => base44.entities.Appointment.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', business?.id],
    queryFn: () => base44.entities.Customer.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: () => base44.entities.Service.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';
  const getServiceName = (id) => services.find(s => s.id === id)?.name || 'Service';

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start with empty days
  const startDayOfWeek = monthStart.getDay();
  const paddedDays = [...Array(startDayOfWeek).fill(null), ...days];

  const getAppointmentsForDay = (date) => {
    if (!date) return [];
    return appointments.filter(a => isSameDay(new Date(a.date), date));
  };

  const upcomingAppointments = appointments
    .filter(a => new Date(a.date) >= new Date() && a.status !== 'Cancelled')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const openAdd = () => {
    setSelectedAppointment(null);
    setModalOpen(true);
  };

  const openEdit = (appt) => {
    setSelectedAppointment(appt);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h1 className="text-xl font-semibold text-foreground">Bookings</h1>
        <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> New Appointment
        </Button>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList className="bg-secondary">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-lg font-medium text-foreground">{format(currentMonth, 'MMMM yyyy')}</h3>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-px">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-xs text-muted-foreground text-center py-2 font-medium">{d}</div>
              ))}
              {paddedDays.map((day, idx) => {
                const dayAppts = getAppointmentsForDay(day);
                const isToday = day && isSameDay(day, new Date());
                return (
                  <div
                    key={idx}
                    className={`min-h-[80px] p-1 border border-border ${
                      day && isSameMonth(day, currentMonth) ? 'bg-card' : 'bg-secondary/30'
                    } ${isToday ? 'ring-1 ring-primary' : ''}`}
                  >
                    {day && (
                      <>
                        <div className={`text-xs mb-1 ${isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayAppts.slice(0, 2).map(a => (
                            <div
                              key={a.id}
                              onClick={() => openEdit(a)}
                              className="text-xs p-1 rounded bg-primary/20 text-primary truncate cursor-pointer hover:bg-primary/30"
                            >
                              {a.time} {getServiceName(a.service_id)}
                            </div>
                          ))}
                          {dayAppts.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{dayAppts.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <Card className="p-8 text-center bg-card border-border">
              <p className="text-muted-foreground">No upcoming appointments</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.map(a => (
                <Card
                  key={a.id}
                  className="p-4 bg-card border-border cursor-pointer hover:bg-secondary/50"
                  onClick={() => openEdit(a)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{getCustomerName(a.customer_id)}</p>
                      <p className="text-sm text-muted-foreground">{getServiceName(a.service_id)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{format(new Date(a.date), 'MMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">{a.time}</p>
                    </div>
                    <Badge className={statusColors[a.status]}>{a.status}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AppointmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={selectedAppointment}
        businessId={business?.id}
        customers={customers}
        services={services}
      />
    </div>
  );
}
