import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "@/lib/PageNotFound";
import { BusinessProvider } from "@/hooks/useBusiness";
import AppLayout from "@/components/layout/AppLayout";

import Home from "@/pages/Home";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Industries from "@/pages/Industries";
import Contact from "@/pages/Contact";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Refund from "@/pages/Refund";

import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import Reviews from "@/pages/Reviews";
import Bookings from "@/pages/Bookings";
import Analytics from "@/pages/Analytics";
import AITools from "@/pages/AITools";
import Services from "@/pages/Services";
import SettingsPage from "@/pages/SettingsPage";
import Billing from "@/pages/Billing";
import Developer from "@/pages/Developer";

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <BusinessProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />

            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="ai-tools" element={<AITools />} />
              <Route path="services" element={<Services />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="billing" element={<Billing />} />
              <Route path="developer" element={<Developer />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </BusinessProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
