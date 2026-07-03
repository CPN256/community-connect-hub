import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmergencyPage from "./pages/EmergencyPage";
import HospitalsPage from "./pages/HospitalsPage";
import SchoolsPage from "./pages/SchoolsPage";
import CommunityPage from "./pages/CommunityPage";
// AuthPage removed — sign-in is inline on /profile
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import IncidentReportPage from "./pages/IncidentReportPage";
import ImpactPage from "./pages/ImpactPage";
import EmergencyMapPage from "./pages/EmergencyMapPage";
import PredictPage from "./pages/PredictPage";
import ResearchPage from "./pages/ResearchPage";
import MediaPage from "./pages/MediaPage";
import ForumPage from "./pages/ForumPage";
import LeaderboardPage from "./pages/LeaderboardPage";
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
            <Route path="/auth" element={<Navigate to="/profile" replace />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/" element={<Index />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/report" element={<IncidentReportPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/emergency-map" element={<EmergencyMapPage />} />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/analytics" element={<ProtectedRoute requireAdmin><AnalyticsPage /></ProtectedRoute>} />
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
