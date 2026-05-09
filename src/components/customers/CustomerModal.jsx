import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = ["New Lead", "Contacted", "Interested", "Scheduled", "Closed"];

export default function CustomerModal({ open, onClose, customer, businessId }) {
  const queryClient = useQueryClient();
  const isEdit = !!customer;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    status: "New Lead",
    notes: "",
    follow_up_date: "",
    follow_up_note: "",
    tags: []
  });
  const [newInteraction, setNewInteraction] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        status: customer.status || "New Lead",
        notes: customer.notes || "",
        follow_up_date: customer.follow_up_date || "",
        follow_up_note: customer.follow_up_note || "",
        tags: customer.tags || []
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        status: "New Lead",
        notes: "",
        follow_up_date: "",
        follow_up_note: "",
        tags: []
      });
    }
    setNewInteraction("");
  }, [customer, open]);

  const { data: interactions = [] } = useQuery({
    queryKey: ["interactions", customer?.id],
    queryFn: () => base44.entities.Interaction.filter({ customer_id: customer.id }),
    enabled: !!customer?.id
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["customer-appointments", customer?.id],
    queryFn: () => base44.entities.Appointment.filter({ customer_id: customer.id }),
    enabled: !!customer?.id
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services", businessId],
    queryFn: () => base44.entities.Service.filter({ business_id: businessId }),
    enabled: !!businessId && !!customer?.id
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        return base44.entities.Customer.update(customer.id, data);
      }

      return base44.entities.Customer.create({ ...data, business_id: businessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onClose();
    }
  });

  const addInteractionMutation = useMutation({
    mutationFn: (note) =>
      base44.entities.Interaction.create({
        customer_id: customer.id,
        business_id: businessId,
        note
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions", customer?.id] });
      setNewInteraction("");
    }
  });

  const handleSave = () => {
    if (!form.name.trim()) return;
    saveMutation.mutate(form);
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !form.tags.includes(trimmedTag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }));
  };

  const getServiceName = (id) => services.find((service) => service.id === id)?.name || "Service";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="bg-secondary">
            <TabsTrigger value="details">Details</TabsTrigger>
            {isEdit && <TabsTrigger value="interactions">Log</TabsTrigger>}
            {isEdit && <TabsTrigger value="appointments">Appts</TabsTrigger>}
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div>
              <Label className="text-muted-foreground">Name *</Label>
              <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="bg-secondary border-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} className="bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <Input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} className="bg-secondary border-border" />
              </div>
            </div>

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

            <div>
              <Label className="text-muted-foreground">Tags</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} x
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  placeholder="Add tag"
                  className="bg-secondary border-border"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Notes</Label>
              <Textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} className="bg-secondary border-border" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Follow-up Date</Label>
                <Input type="date" value={form.follow_up_date} onChange={(event) => setForm((prev) => ({ ...prev, follow_up_date: event.target.value }))} className="bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-muted-foreground">Follow-up Note</Label>
                <Input value={form.follow_up_note} onChange={(event) => setForm((prev) => ({ ...prev, follow_up_note: event.target.value }))} className="bg-secondary border-border" />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full">
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </TabsContent>

          {isEdit && (
            <TabsContent value="interactions" className="mt-4 space-y-4">
              <div>
                <Textarea
                  value={newInteraction}
                  onChange={(event) => setNewInteraction(event.target.value)}
                  placeholder="Add interaction note..."
                  className="bg-secondary border-border"
                  rows={2}
                />
                <Button
                  onClick={() => newInteraction.trim() && addInteractionMutation.mutate(newInteraction.trim())}
                  disabled={addInteractionMutation.isPending || !newInteraction.trim()}
                  className="mt-2"
                >
                  Add Note
                </Button>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {interactions.length === 0 && <p className="text-sm text-muted-foreground">No interactions logged</p>}
                {[...interactions]
                  .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
                  .map((interaction) => (
                    <div key={interaction.id} className="rounded bg-secondary p-2 text-sm">
                      <p className="text-foreground">{interaction.note}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {interaction.created_date ? format(new Date(interaction.created_date), "MMM d, yyyy h:mm a") : "No date"}
                      </p>
                    </div>
                  ))}
              </div>
            </TabsContent>
          )}

          {isEdit && (
            <TabsContent value="appointments" className="mt-4 space-y-2">
              {appointments.length === 0 && <p className="text-sm text-muted-foreground">No linked appointments</p>}
              {appointments.map((appointmentItem) => (
                <div key={appointmentItem.id} className="flex justify-between rounded bg-secondary p-2 text-sm">
                  <span className="text-foreground">{getServiceName(appointmentItem.service_id)}</span>
                  <span className="text-muted-foreground">
                    {appointmentItem.date ? format(new Date(appointmentItem.date), "MMM d") : "No date"} @ {appointmentItem.time}
                  </span>
                </div>
              ))}
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
