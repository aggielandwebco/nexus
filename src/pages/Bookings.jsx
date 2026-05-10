import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Edit, Plus, Search, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCustomers } from "@/lib/customerService";
import { getServices } from "@/lib/serviceService";
import { cancelBooking, createBooking, getBookings, updateBooking } from "@/lib/bookingService";

const STATUSES = ["Scheduled", "Confirmed", "Completed", "Cancelled"];

const emptyForm = {
  customer_id: "",
  service_id: "",
  date: format(new Date(), "yyyy-MM-dd"),
  time: "09:00",
  status: "Scheduled",
  notes: ""
};

function BookingForm({ open, onOpenChange, booking, initialDate, customers, services, onSave, isSaving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (booking) {
      setForm({
        customer_id: booking.customer_id || "",
        service_id: booking.service_id || "",
        date: booking.date || format(new Date(), "yyyy-MM-dd"),
        time: booking.time || "09:00",
        status: booking.status || "Scheduled",
        notes: booking.notes || ""
      });
    } else {
      setForm({
        ...emptyForm,
        date: initialDate || format(new Date(), "yyyy-MM-dd")
      });
    }
  }, [booking, initialDate, open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.customer_id || !form.service_id || !form.date || !form.time) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card">
        <DialogHeader>
          <DialogTitle>{booking ? "Edit Booking" : "New Booking"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Customer *</Label>
            <Select value={form.customer_id} onValueChange={(value) => setForm((prev) => ({ ...prev, customer_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Service *</Label>
            <Select value={form.service_id} onValueChange={(value) => setForm((prev) => ({ ...prev, service_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - ${Number(service.price || 0).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Time *</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Internal booking notes..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isSaving ? "Saving..." : "Save Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Bookings() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [newBookingDate, setNewBookingDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [message, setMessage] = useState("");

  const { data: customers = [], isLoading: loadingCustomers, error: customerError } = useQuery({
    queryKey: ["customers", false],
    queryFn: () => getCustomers({ archived: false })
  });

  const { data: services = [], isLoading: loadingServices, error: serviceError } = useQuery({
    queryKey: ["services", true],
    queryFn: () => getServices({ active: true })
  });

  const { data: bookings = [], isLoading: loadingBookings, error: bookingError } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings
  });

  const saveMutation = useMutation({
    mutationFn: (form) => (editingBooking ? updateBooking(editingBooking.id, form) : createBooking(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setModalOpen(false);
      setEditingBooking(null);
      setMessage("Booking saved.");
    },
    onError: (mutationError) => setMessage(mutationError.message)
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setMessage("Booking cancelled.");
    },
    onError: (mutationError) => setMessage(mutationError.message)
  });

  const getCustomerName = (id) => customers.find((customer) => customer.id === id)?.name || "Unknown customer";
  const getService = (id) => services.find((service) => service.id === id);
  const getServiceName = (id) => getService(id)?.name || "Unknown service";
  const getServicePrice = (id) => Number(getService(id)?.price || 0);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bookings;
    return bookings.filter((booking) =>
      [
        getCustomerName(booking.customer_id),
        getServiceName(booking.service_id),
        booking.status,
        booking.notes
      ].some((value) => value?.toLowerCase().includes(term))
    );
  }, [bookings, customers, services, search]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const nextSeven = addDays(new Date(), 7);
  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = parseISO(booking.date);
    return booking.status !== "Cancelled" && bookingDate >= new Date(todayKey) && bookingDate <= nextSeven;
  });
  const todayBookings = bookings.filter((booking) => booking.date === todayKey && booking.status !== "Cancelled");
  const estimatedRevenue = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + getServicePrice(booking.service_id), 0);

  const openNewBooking = (date) => {
    setEditingBooking(null);
    setNewBookingDate(date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
    setModalOpen(true);
  };

  const openEditBooking = (booking) => {
    setEditingBooking(booking);
    setModalOpen(true);
  };

  const error = customerError || serviceError || bookingError;
  const isLoading = loadingCustomers || loadingServices || loadingBookings;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="mt-1 text-muted-foreground">
            Schedule appointments, track services, and estimate booked revenue.
          </p>
        </div>
        <Button onClick={() => openNewBooking()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>

      {(error || message) && (
        <Card className={`p-4 text-sm ${error || message.includes("policy") || message.includes("does not exist") ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-foreground"}`}>
          {error?.message || message}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : upcomingBookings.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">{todayBookings.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="text-2xl font-bold text-foreground">{loadingCustomers ? "..." : customers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Booked Value</p>
          <p className="mt-2 text-2xl font-bold text-foreground">${estimatedRevenue.toFixed(0)}</p>
        </Card>
      </div>

      <Card className="border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, service, status, or notes..."
            className="pl-9"
          />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button variant="outline" size="icon" onClick={() => setMonth((value) => startOfMonth(addDays(value, -1)))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">{format(month, "MMMM yyyy")}</h2>
            <Button variant="outline" size="icon" onClick={() => setMonth((value) => startOfMonth(addDays(endOfMonth(value), 1)))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayBookings = bookings.filter((booking) => isSameDay(parseISO(booking.date), day));
              const muted = day.getMonth() !== month.getMonth();
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => openNewBooking(day)}
                  className={`min-h-24 rounded-lg border p-2 text-left transition hover:border-primary/60 ${
                    isToday(day) ? "border-primary bg-primary/10" : "border-border bg-background/40"
                  } ${muted ? "opacity-45" : ""}`}
                >
                  <span className="text-sm font-medium text-foreground">{format(day, "d")}</span>
                  <div className="mt-2 space-y-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div key={booking.id} className="truncate rounded bg-primary/15 px-1.5 py-1 text-[11px] text-primary">
                        {booking.time} {getCustomerName(booking.customer_id)}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[11px] text-muted-foreground">+{dayBookings.length - 2} more</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="border-border bg-card p-4">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Booking List</h2>
          <div className="space-y-3">
            {filteredBookings.length === 0 && (
              <div className="py-10 text-center">
                <Badge variant="secondary" className="mb-3">No bookings</Badge>
                <p className="text-sm text-muted-foreground">Click New Booking or a calendar day to create one.</p>
              </div>
            )}
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-border bg-background/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{getCustomerName(booking.customer_id)}</p>
                    <p className="text-sm text-muted-foreground">{getServiceName(booking.service_id)}</p>
                  </div>
                  <Badge variant={booking.status === "Cancelled" ? "destructive" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {format(parseISO(booking.date), "MMM d, yyyy")} at {booking.time}
                  </span>
                  <span className="font-semibold text-foreground">${getServicePrice(booking.service_id).toFixed(2)}</span>
                </div>
                {booking.notes && <p className="mt-2 text-sm text-muted-foreground">{booking.notes}</p>}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditBooking(booking)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  {booking.status !== "Cancelled" && (
                    <Button variant="outline" size="sm" onClick={() => cancelMutation.mutate(booking.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <BookingForm
        open={modalOpen}
        onOpenChange={setModalOpen}
        booking={editingBooking}
        initialDate={newBookingDate}
        customers={customers}
        services={services}
        onSave={(form) => saveMutation.mutate(form)}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}
