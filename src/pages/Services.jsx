import { useMemo, useState } from "react";
import { DollarSign, Plus, Search, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const starterServices = [
  {
    id: "consultation",
    name: "Consultation",
    category: "General",
    duration_minutes: 30,
    price: 0,
    description: "A starter service placeholder. Connect services to Supabase when ready."
  }
];

export default function Services() {
  const [search, setSearch] = useState("");
  const [services] = useState(starterServices);

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return services;
    return services.filter((service) =>
      [service.name, service.category, service.description].some((value) =>
        value?.toLowerCase().includes(term)
      )
    );
  }, [search, services]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="mt-1 text-muted-foreground">
            Manage the services, prices, and appointment types your business offers.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card className="border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search services..."
            className="pl-9"
          />
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
            <p className="mb-5 text-sm text-muted-foreground">{service.description}</p>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2 text-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-semibold">{service.price}</span>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <Wrench className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">Services are ready to connect.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This tab is stable now. The next step is creating a Supabase services table when you want service CRUD to persist like customers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
