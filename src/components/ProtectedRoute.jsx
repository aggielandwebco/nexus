import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";

const DefaultFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement = null }) {
  const {
    isAuthenticated = true,
    isLoadingAuth,
    authChecked = true,
    authError,
    checkUserAuth = () => {}
  } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) return fallback;

  if (authError) {
    if (authError.type === "user_not_registered") return <UserNotRegisteredError />;
    return unauthenticatedElement;
  }

  if (!isAuthenticated) return unauthenticatedElement;

  return <Outlet />;
}
