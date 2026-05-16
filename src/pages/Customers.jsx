import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Archive, ArchiveRestore, Pencil, Plus, Search, X } from "lucide-react";
import { archiveCustomer, createCustomer, getCustomers, restoreCustomer, updateCustomer } from "@/lib/customerService";
import { getBusinessId } from "@/lib/app-params";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const STATUS_OPTIONS = ["New Lead", "Contacted", "Interested", "Scheduled", "Closed"];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  status: "New Lead",
  tagsText: "",
  notes: "",
  follow_up_date: "",
  follow_up_note: ""
};

const statusColors = {
  "New Lead": "bg-blue-500/20 text-blue-300",
  Contacted: "bg-yellow-500/20 text-yellow-300",
  Interested: "bg-purple-500/20 text-purple-300",
  Scheduled: "bg-primary/20 text-primary",
  Closed: "bg-green-500/20 text-green-300"
};

function formatPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function customerToForm(customer) {
  if (!customer) return emptyForm;

  return {
    name: customer.name || "",
    phone: formatPhone(customer.phone || ""),
    email: customer.email || "",
    status: customer.status || "New Lead",
    tagsText: normalizeTags(customer.tags).join(", "),
    notes: customer.notes || "",
    follow_up_date: customer.follow_up_date || "",
    follow_up_note: customer.follow_up_note || ""
  };
}

function formToCustomer(form) {
  return {
    name: form.name,
    phone: formatPhone(form.phone),
    email: form.email,
    status: form.status,
    tags: normalizeTags(form.tagsText),
    notes: form.notes,
    follow_up_date: form.follow_up_date,
    follow_up_note: form.follow_up_note
  };
}

function CustomerForm({ open, customer, onClose, onSave, isSaving }) {
  const [form, setForm] = useState(() => customerToForm(customer));

  useMemo(() => {
    if (open) setForm(customerToForm(customer));
  }, [customer, open]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSave(formToCustomer(form));
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#1C1F24] text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <Label>Name *</Label>
            <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="mt-1 bg-[#111315]" required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(event) => updateField("phone", formatPhone(event.target.value))}
                className="mt-1 bg-[#111315]"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-1 bg-[#111315]" />
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => updateField("status", value)}>
              <SelectTrigger className="mt-1 bg-[#111315]">
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
            <Label>Tags</Label>
            <Input value={form.tagsText} onChange={(event) => updateField("tagsText", event.target.value)} placeholder="lead, vip, follow up" className="mt-1 bg-[#111315]" />
            <p className="mt-1 text-xs text-muted-foreground">Separate tags with commas.</p>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} className="mt-1 bg-[#111315]" rows={3} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Follow-up Date</Label>
              <Input type="date" value={form.follow_up_date} onChange={(event) => updateField("follow_up_date", event.target.value)} className="mt-1 bg-[#111315]" />
            </div>
            <div>
              <Label>Follow-up Note</Label>
              <Input value={form.follow_up_note} onChange={(event) => updateField("follow_up_note", event.target.value)} className="mt-1 bg-[#111315]" />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !form.name.trim()} className="bg-accent text-accent-foreground hover:brightness-110">
              {isSaving ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Customers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const customersQuery = useQuery({
    queryKey: ["customers", showArchived],
    queryFn: () => getCustomers({ archived: showArchived })
  });

  const refreshCustomers = () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
  };

  const saveMutation = useMutation({
    mutationFn: (customerData) => {
      const withBusiness = { ...customerData, business_id: getBusinessId() };
      return selectedCustomer ? updateCustomer(selectedCustomer.id, withBusiness) : createCustomer(withBusiness);
    },
    onSuccess: () => {
      setNotice(selectedCustomer ? "Customer updated." : "Customer added.");
      setActionError("");
      setModalOpen(false);
      setSelectedCustomer(null);
      refreshCustomers();
    },
    onError: (error) => {
      setActionError(error.message || "Could not save customer.");
    }
  });

  const archiveMutation = useMutation({
    mutationFn: archiveCustomer,
    onSuccess: () => {
      setNotice("Customer archived.");
      setActionError("");
      refreshCustomers();
    },
    onError: (error) => setActionError(error.message || "Could not archive customer.")
  });

  const restoreMutation = useMutation({
    mutationFn: restoreCustomer,
    onSuccess: () => {
      setNotice("Customer restored.");
      setActionError("");
      refreshCustomers();
    },
    onError: (error) => setActionError(error.message || "Could not restore customer.")
  });

  const customers = customersQuery.data || [];

  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase();
    const haystack = [customer.name, customer.email, customer.phone, customer.status, ...(customer.tags || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
    setActionError("");
  };

  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
    setActionError("");
  };

  const handleArchive = (customer) => {
    if (window.confirm(`Archive ${customer.name}? You can restore this customer later.`)) {
      archiveMutation.mutate(customer.id);
    }
  };

  const handleRestore = (customer) => {
    restoreMutation.mutate(customer.id);
  };

  const isBusy = saveMutation.isPending || archiveMutation.isPending || restoreMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage active leads, customers, follow-ups, and archived records from Supabase.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => setShowArchived((value) => !value)} className="border-white/10">
            {showArchived ? "View Active" : "View Archived"}
          </Button>
          <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:brightness-110">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {(notice || actionError || customersQuery.error) && (
        <div className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-sm ${actionError || customersQuery.error ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-accent/40 bg-accent/10 text-accent"}`}>
          <span>{actionError || customersQuery.error?.message || notice}</span>
          <button type="button" onClick={() => { setNotice(""); setActionError(""); }} className="text-current">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Card className="border-white/10 bg-[#1C1F24] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone, status, or tags..." className="pl-9 bg-[#111315]" />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#111315]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {customersQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-accent" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <Card className="border-white/10 bg-[#1C1F24] p-10 text-center">
          <p className="font-medium text-foreground">{showArchived ? "No archived customers found." : "No active customers found."}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {showArchived ? "Archived customers will appear here after you archive them." : "Add a customer to start building your CRM."}
          </p>
        </Card>
      ) : (
        <>
          <Card className="hidden overflow-hidden border-white/10 bg-[#1C1F24] md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-left text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Follow-up</th>
                    <th className="p-4 font-medium">Created</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="transition hover:bg-white/[0.03]">
                      <td className="p-4">
                        <button type="button" onClick={() => openEdit(customer)} className="text-left">
                          <span className="font-medium text-foreground">{customer.name}</span>
                          <span className="block text-xs text-muted-foreground">{customer.email || "No email"}</span>
                        </button>
                        {!!customer.tags?.length && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {customer.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-white/5 text-muted-foreground">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">{customer.phone ? formatPhone(customer.phone) : "-"}</td>
                      <td className="p-4">
                        <Badge className={statusColors[customer.status] || "bg-muted text-muted-foreground"}>{customer.status || "New Lead"}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {customer.follow_up_date ? format(new Date(`${customer.follow_up_date}T00:00:00`), "MMM d, yyyy") : "-"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {customer.created_at ? format(new Date(customer.created_at), "MMM d, yyyy") : "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(customer)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          {showArchived ? (
                            <Button variant="outline" size="sm" onClick={() => handleRestore(customer)} disabled={isBusy}>
                              <ArchiveRestore className="mr-2 h-4 w-4" />
                              Restore
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleArchive(customer)} disabled={isBusy}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid gap-4 md:hidden">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-white/10 bg-[#1C1F24] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.email || "No email"}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone ? formatPhone(customer.phone) : "No phone"}</p>
                  </div>
                  <Badge className={statusColors[customer.status] || "bg-muted text-muted-foreground"}>{customer.status || "New Lead"}</Badge>
                </div>

                {!!customer.tags?.length && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {customer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/5 text-muted-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <p>Follow-up: {customer.follow_up_date ? format(new Date(`${customer.follow_up_date}T00:00:00`), "MMM d, yyyy") : "-"}</p>
                  {customer.follow_up_note && <p>Note: {customer.follow_up_note}</p>}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => openEdit(customer)}>
                    Edit
                  </Button>
                  {showArchived ? (
                    <Button variant="outline" onClick={() => handleRestore(customer)} disabled={isBusy}>
                      Restore
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => handleArchive(customer)} disabled={isBusy}>
                      Archive
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <CustomerForm
        open={modalOpen}
        customer={selectedCustomer}
        onClose={() => {
          setModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSave={(customerData) => saveMutation.mutate(customerData)}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}