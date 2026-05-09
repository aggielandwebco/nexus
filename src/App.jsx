import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "@/lib/PageNotFound";
import { BusinessProvider } from "@/hooks/useBusiness";
import AppLayout from "@/components/layout/AppLayout";

import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import Reviews from "@/pages/Reviews";
import Bookings from "@/pages/Bookings";
import Analytics from "@/pages/Analytics";
import AITools from "@/pages/AITools";
import Services from "@/pages/Services";
import SettingsPage from "@/pages/SettingsPage";
import Billing from "@/pages/Billing";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Developer from "@/pages/Developer";

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <BusinessProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/services" element={<Services />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/developer" element={<Developer />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </BusinessProvider>

      <Toaster />
    </QueryClientProvider>
  );
}
