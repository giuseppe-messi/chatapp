import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ErrorBoundary,
  LoadingSpinner,
  type FallbackProps
} from "@react-lab-mono/ui";
import { lazy, Suspense } from "react";
import { Layout } from "./Layout";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

const queryClient = new QueryClient();

const Home = lazy(() => import("./pages/Home/Home"));
const SignIn = lazy(() => import("./pages/SignIn/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const ErrorPageFallback = ({ onClearError }: FallbackProps) => (
  <ErrorPage onClearError={onClearError} />
);

export const APP_ROUTES = {
  home: "/",
  signin: "signin",
  signup: "signup"
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={ErrorPageFallback}>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                    index
                    path={APP_ROUTES.home}
                  />
                  <Route element={<SignIn />} path={APP_ROUTES.signin} />
                  <Route element={<SignUp />} path={APP_ROUTES.signup} />
                  <Route element={<NotFound />} path="*" />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
