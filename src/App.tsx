import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmergencyPage from "./pages/EmergencyPage";
import HospitalsPage from "./pages/HospitalsPage";
import SchoolsPage from "./pages/SchoolsPage";
import CommunityPage from "./pages/CommunityPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import IncidentReportPage from "./pages/IncidentReportPage";
import ChatBot from "./components/ChatBot";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminFloatingButton from "./components/AdminFloatingButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Index />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
          <AdminFloatingButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
