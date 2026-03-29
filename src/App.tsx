import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Debts from "./pages/Debts";
import AddDebt from "./pages/AddDebt";
import RecordPayment from "./pages/RecordPayment";
import PaymentHistory from "./pages/PaymentHistory";
import Strategy from "./pages/Strategy";
import Journey from "./pages/Journey";
import Milestones from "./pages/Milestones";
import WeeklyReview from "./pages/WeeklyReview";
import Future from "./pages/Future";
import Profile from "./pages/Profile";
import AppSettings from "./pages/AppSettings";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/debts" element={<ProtectedRoute><Debts /></ProtectedRoute>} />
            <Route path="/add-debt" element={<ProtectedRoute><AddDebt /></ProtectedRoute>} />
            <Route path="/record-payment" element={<ProtectedRoute><RecordPayment /></ProtectedRoute>} />
            <Route path="/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
            <Route path="/strategy" element={<ProtectedRoute><Strategy /></ProtectedRoute>} />
            <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
            <Route path="/milestones" element={<ProtectedRoute><Milestones /></ProtectedRoute>} />
            <Route path="/weekly-review" element={<ProtectedRoute><WeeklyReview /></ProtectedRoute>} />
            <Route path="/future" element={<ProtectedRoute><Future /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppSettings /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
