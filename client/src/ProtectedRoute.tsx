import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@react-lab-mono/ui";
import { APP_ROUTES } from "./App";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingUser } = useAuth();
  const location = useLocation();
  const [showHeadsUp, setShowHeadsUp] = useState(
    localStorage.getItem("slowStart") === "true"
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isLoadingUser) {
      // If backend is slow AND user has never seen the delay
      if (!showHeadsUp) {
        timer = setTimeout(() => {
          setShowHeadsUp(true);
          localStorage.setItem("slowStart", "true");
        }, 3000);
      }
    } else {
      // Backend is now awake, reset for future sessions
      localStorage.removeItem("slowStart");
      setShowHeadsUp(false);
    }

    return () => clearTimeout(timer);
  }, [isLoadingUser, showHeadsUp]);

  if (isLoadingUser)
    return (
      <div>
        {showHeadsUp && (
          <div className="bg-[#FFEB3B] max-w-150 mx-auto mt-8 mb-10 p-4 text-sm rounded-md">
            <p className="mb-4 font-semibold">Heads up</p>
            <p>
              The app runs on free-tier hosting (Render & Netlify). It may take
              a few seconds to wake up after inactivity, so if it seems stuck,
              try refreshing the page a couple of times, everything works
              normally once active.
            </p>
          </div>
        )}
        <LoadingSpinner size="lg" color="white" />
      </div>
    );

  if (!user)
    return (
      <Navigate to={APP_ROUTES.signin} replace state={{ from: location }} />
    );

  return children;
};
