import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Edit, Plus, RotateCcw, Search, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createService,
  deactivateService,
  getServices,
  restoreService,
  updateService
} from "@/lib/serviceService";

const emptyForm = {
  name: "",
  category: "General",
  duration_minutes: 30,
  price: 0,
  description: ""
};

function ServiceForm({ open, onOpenChange, service, onSave, isSaving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || "",
        category: service.category || "General",
        duration_minutes: service.duration_minutes || 30,
        price: service.price || 0,
        description: service.description || ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [service, open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service name *</Label>
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Haircut, oil change, consultation..."
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Label / category</Label>
              <Input
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                placeholder="General"
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Duration in minutes</Label>
            <Input
              type="number"
              min="5"
              step="5"
              value={form.duration_minutes}
              onChange={(event) => setForm((prev) => ({ ...prev, duration_minutes: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Describe what is included..."
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isSaving} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isSaving ? "Saving..." : "Save Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Services() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [message, setMessage] = useState("");

  const {
    data: services = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["services", !showInactive],
    queryFn: () => getServices({ active: !showInactive })
  });

  const saveMutation = useMutation({
    mutationFn: (form) => (editingService ? updateService(editingService.id, form) : createService(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setModalOpen(false);
      setEditingService(null);
      setMessage("Service saved.");
    },
    onError: (mutationError) => setMessage(mutationError.message)
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setMessage("Service hidden.");
    },
    onError: (mutationError) => setMessage(mutationError.message)
  });

  const restoreMutation = useMutation({
    mutationFn: restoreService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setMessage("Service restored.");
    },
    onError: (mutationError) => setMessage(mutationError.message)
  });

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return services;
    return services.filter((service) =>
      [service.name, service.category, service.description].some((value) =>
        value?.toLowerCase().includes(term)
      )
    );
  }, [search, services]);

  const totalValue = services.reduce((sum, service) => sum + Number(service.price || 0), 0);
  const avgPrice = services.length ? totalValue / services.length : 0;

  const openNewService = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const openEditService = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="mt-1 text-muted-foreground">
            Create service labels, prices, durations, and descriptions.
          </p>
        </div>
        <Button onClick={openNewService} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {(error || message) && (
        <Card className={`p-4 text-sm ${error || message.includes("policy") || message.includes("does not exist") ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-foreground"}`}>
          {error?.message || message}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Services</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{isLoading ? "..." : services.length}</p>
        </Card>
        <Card className="border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Average Price</p>
          <p className="mt-2 text-2xl font-bold text-foreground">${avgPrice.toFixed(0)}</p>
        </Card>
        <Card className="border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Catalog Value</p>
          <p className="mt-2 text-2xl font-bold text-foreground">${totalValue.toFixed(0)}</p>
        </Card>
      </div>

      <Card className="border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={() => setShowInactive((value) => !value)}>
            {showInactive ? "View Active" : "View Hidden"}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="border-border bg-card p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{service.name}</h2>
                <p className="text-sm text-muted-foreground">{service.category}</p>
              </div>
              <Badge variant="secondary">{service.duration_minutes} min</Badge>
            </div>
            <p className="mb-5 min-h-10 text-sm text-muted-foreground">
              {service.description || "No description yet."}
            </p>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2 text-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-semibold">{Number(service.price || 0).toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                {showInactive ? (
                  <Button variant="outline" size="sm" onClick={() => restoreMutation.mutate(service.id)}>
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => openEditService(service)}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deactivateMutation.mutate(service.id)}>
                      Hide
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!isLoading && filteredServices.length === 0 && (
        <Card className="border-border bg-card p-8 text-center">
          <Wrench className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h2 className="font-semibold text-foreground">No services found.</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add a service to start pricing bookings and dashboard revenue.</p>
        </Card>
      )}

      <ServiceForm
        open={modalOpen}
        onOpenChange={setModalOpen}
        service={editingService}
        onSave={(form) => saveMutation.mutate(form)}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}
