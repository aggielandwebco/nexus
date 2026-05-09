import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useBusiness } from "@/hooks/useBusiness";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { business, loading } = useBusiness();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center border-b border-border px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3 text-muted-foreground md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{business?.name || "My Business"}</h1>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
