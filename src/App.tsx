import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import POS from "./pages/POS";
import VinPicker from "./pages/VinPicker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/vin-picker" element={<VinPicker />} />
            {/* Placeholder routes for other pages */}
            <Route path="/sales" element={<div className="p-8"><h2 className="text-3xl font-bold">Sales Reports</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/suppliers" element={<div className="p-8"><h2 className="text-3xl font-bold">Suppliers</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/customers" element={<div className="p-8"><h2 className="text-3xl font-bold">Customers</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/reports" element={<div className="p-8"><h2 className="text-3xl font-bold">Reports</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/settings" element={<div className="p-8"><h2 className="text-3xl font-bold">Settings</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
