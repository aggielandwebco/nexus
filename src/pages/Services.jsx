import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Services() {
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const isEdit = !!selected;

  const [form, setForm] = useState({ name: '', category: '', duration_minutes: '', price: '', description: '' });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: () => base44.entities.Service.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, duration_minutes: Number(data.duration_minutes) || 0, price: Number(data.price) || 0 };
      if (isEdit) return base44.entities.Service.update(selected.id, payload);
      return base44.entities.Service.create({ ...payload, business_id: business.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['services']),
  });

  const openAdd = () => {
    setSelected(null);
    setForm({ name: '', category: '', duration_minutes: '', price: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setSelected(s);
    setForm({
      name: s.name || '', category: s.category || '',
      duration_minutes: s.duration_minutes?.toString() || '', price: s.price?.toString() || '',
      description: s.description || ''
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h1 className="text-xl font-semibold text-foreground">Services</h1>
        <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <Card className="p-8 text-center bg-card border-border">
          <p className="text-muted-foreground">No services yet. Add your first service to get started.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="p-3 font-medium">Duration</th>
                  <th className="p-3 font-medium">Price</th>
                  <th className="p-3 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-secondary/50">
                    <td className="p-3 text-foreground font-medium">{s.name}</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{s.category || '—'}</td>
                    <td className="p-3 text-muted-foreground">{s.duration_minutes} min</td>
                    <td className="p-3 text-foreground">${s.price?.toFixed(2) || '0.00'}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(s.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{isEdit ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-muted-foreground">Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="bg-secondary border-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Duration (min)</Label>
                <Input type="number" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} className="bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-muted-foreground">Price ($)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="bg-secondary border-border" />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary border-border" rows={3} />
            </div>
            <Button onClick={() => form.name && saveMutation.mutate(form)} disabled={saveMutation.isPending} className="w-full bg-primary text-primary-foreground">
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
