import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { business, refreshBusiness } = useBusiness();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', website: '', ai_tone: 'Professional'
  });

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || '',
        phone: business.phone || '',
        email: business.email || '',
        address: business.address || '',
        website: business.website || '',
        ai_tone: business.ai_tone || 'Professional'
      });
    }
  }, [business]);

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.Business.update(business.id, data),
    onSuccess: () => {
      refreshBusiness();
      toast.success('Settings saved');
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Settings</h1>

      <Card className="p-5 bg-card border-border max-w-2xl">
        <h2 className="text-lg font-medium text-foreground mb-4">Business Profile</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Business Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary border-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary border-border" />
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Address</Label>
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-muted-foreground">Website URL</Label>
            <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://" className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-muted-foreground">AI Response Tone</Label>
            <Select value={form.ai_tone} onValueChange={v => setForm(f => ({ ...f, ai_tone: v }))}>
              <SelectTrigger className="bg-secondary border-border w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => form.name && saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground">
            {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
