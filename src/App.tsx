import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import AIAnalysis from "./pages/AIAnalysis";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import { APP_CONFIG } from "@/config/appConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard with default testcase */}
          <Route path="/" element={<Navigate to={`/dashboard/${APP_CONFIG.defaultTestcaseId}`} replace />} />
          
          {/* Main layout with sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard/:testcaseId" element={<Dashboard />} />
            <Route path="/logs/:testcaseId" element={<Logs />} />
            <Route path="/ai-analysis/:testcaseId" element={<AIAnalysis />} />
            <Route path="/about/:testcaseId" element={<AboutUs />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
