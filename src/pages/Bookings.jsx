import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, Plus, Search, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCustomers } from "@/lib/customerService";

const sampleBookings = [];

export default function Bookings() {
  const [search, setSearch] = useState("");
  const {
    data: customers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["customers", false],
    queryFn: () => getCustomers({ archived: false })
  });

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sampleBookings;
    return sampleBookings.filter((booking) =>
      [booking.customer, booking.service, booking.status].some((value) =>
        value?.toLowerCase().includes(term)
      )
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="mt-1 text-muted-foreground">
            Schedule appointments and organize upcoming work.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
          </div>
        </Card>
        <Card className="border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
          </div>
        </Card>
        <Card className="border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Customers Ready</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : customers.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings..."
            className="pl-9"
          />
        </div>
      </Card>

      <Card className="border-border bg-card p-8 text-center">
        {filteredBookings.length === 0 && (
          <>
            <Badge variant="secondary" className="mb-4">Supabase-ready</Badge>
            <h2 className="text-lg font-semibold text-foreground">No bookings yet.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              The page is stable and ready for the bookings table. Customer records are already connected,
              and booking persistence can be wired into Supabase next.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
