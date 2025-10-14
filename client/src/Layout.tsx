import { Outlet } from "react-router-dom";
import { Toaster } from "@react-lab-mono/ui";
import { Footer } from "./components/Footer/Footer";

export const Layout = () => (
  <>
    <main className="flex flex-col flex-1 bg-gray-900">
      <Outlet />
    </main>
    <Footer />
    <Toaster />
  </>
);
