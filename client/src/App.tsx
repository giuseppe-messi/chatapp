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

const queryClient = new QueryClient();

const Home = lazy(() => import("./pages/Home/Home"));
const SignIn = lazy(() => import("./pages/SignIn/SignIn"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const ErrorPageFallback = ({ onClearError }: FallbackProps) => (
  <ErrorPage onClearError={onClearError} />
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={ErrorPageFallback}>
        <Router>
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Routes>
              <Route element={<Layout />}>
                <Route element={<Home />} index />
                <Route element={<SignIn />} path="signin" />
                <Route element={<NotFound />} path="*" />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
