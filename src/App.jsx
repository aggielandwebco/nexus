import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "@/lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
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

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }

    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <BusinessProvider>
      <Routes>
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
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BusinessProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
