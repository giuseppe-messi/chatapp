import type { ReactNode } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@react-lab-mono/ui";
import { APP_ROUTES } from "./App";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingUser } = useAuth() ?? {};
  const location = useLocation();

  if (isLoadingUser) return <LoadingSpinner size="lg" color="white" />;

  if (!user)
    return (
      <Navigate to={APP_ROUTES.signin} replace state={{ from: location }} />
    );

  return children;
};
