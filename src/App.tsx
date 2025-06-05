import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Renamed to avoid conflict if both are used
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import DashboardPage from "./pages/DashboardPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";
import JointAccountApplicationPage from "./pages/JointAccountApplicationPage";
import PaymentPage from "./pages/PaymentPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists in src/pages/

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster /> {/* For shadcn/ui Toast */}
      <Sonner richColors position="top-right" /> {/* For Sonner notifications */}
      <BrowserRouter>
        <Routes>
          {/* Assuming DashboardPage is the main page after login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/account-details/:accountId" element={<AccountDetailsPage />} />
          <Route path="/account-details" element={<AccountDetailsPage />} /> {/* Fallback if no ID, or redirect */}
          <Route path="/joint-account-application" element={<JointAccountApplicationPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/profile-settings" element={<ProfileSettingsPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;