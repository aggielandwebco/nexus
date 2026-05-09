import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"];

export default function AppointmentModal({ open, onClose, appointment, businessId, customers = [], services = [] }) {
  const queryClient = useQueryClient();
  const isEdit = !!appointment;

  const [form, setForm] = useState({
    customer_id: "",
    service_id: "",
    date: "",
    time: "",
    status: "Pending",
    notes: ""
  });

  useEffect(() => {
    if (appointment) {
      setForm({
        customer_id: appointment.customer_id || "",
        service_id: appointment.service_id || "",
        date: appointment.date || "",
        time: appointment.time || "",
        status: appointment.status || "Pending",
        notes: appointment.notes || ""
      });
    } else {
      setForm({
        customer_id: "",
        service_id: "",
        date: "",
        time: "",
        status: "Pending",
        notes: ""
      });
    }
  }, [appointment, open]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        return base44.entities.Appointment.update(appointment.id, data);
      }

      return base44.entities.Appointment.create({ ...data, business_id: businessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Appointment.delete(appointment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    }
  });

  const handleSave = () => {
    if (!form.customer_id || !form.service_id || !form.date || !form.time) return;
    saveMutation.mutate(form);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Appointment" : "New Appointment"}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div>
            <Label className="text-muted-foreground">Customer *</Label>
            <Select value={form.customer_id} onValueChange={(value) => setForm((prev) => ({ ...prev, customer_id: value }))}>
              <SelectTrigger className="bg-secondary border-border">
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

          <div>
            <Label className="text-muted-foreground">Service *</Label>
            <Select value={form.service_id} onValueChange={(value) => setForm((prev) => ({ ...prev, service_id: value }))}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - ${service.price || 0}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-muted-foreground">Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Time *</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {isEdit && (
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-muted-foreground">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="bg-secondary border-border"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1">
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
            {isEdit && (
              <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
