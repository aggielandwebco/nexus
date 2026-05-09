import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CustomerModal from '@/components/customers/CustomerModal';
import { format } from 'date-fns';

const STATUS_OPTIONS = ['New Lead', 'Contacted', 'Interested', 'Scheduled', 'Closed'];

const statusColors = {
  'New Lead': 'bg-blue-500/20 text-blue-400',
  'Contacted': 'bg-yellow-500/20 text-yellow-400',
  'Interested': 'bg-purple-500/20 text-purple-400',
  'Scheduled': 'bg-primary/20 text-primary',
  'Closed': 'bg-green-500/20 text-green-400',
};

export default function Customers() {
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', business?.id],
    queryFn: () => base44.entities.Customer.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Customer.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['customers']),
  });

  const filtered = customers.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const openAdd = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h1 className="text-xl font-semibold text-foreground">Customers</h1>
        <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-card border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center bg-card border-border">
          <p className="text-muted-foreground">No customers found</p>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium hidden sm:table-cell">Phone</th>
                  <th className="p-3 font-medium hidden md:table-cell">Email</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium hidden lg:table-cell">Created</th>
                  <th className="p-3 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/50 cursor-pointer" onClick={() => openEdit(c)}>
                    <td className="p-3 text-foreground font-medium">{c.name}</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{c.phone || '—'}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{c.email || '—'}</td>
                    <td className="p-3">
                      <Badge className={statusColors[c.status] || 'bg-muted text-muted-foreground'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">
                      {format(new Date(c.created_date), 'MMM d, yyyy')}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(c)}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(c.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={selectedCustomer}
        businessId={business?.id}
      />
    </div>
  );
}
