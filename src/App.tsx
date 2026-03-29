import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/add-debt" element={<AddDebt />} />
          <Route path="/record-payment" element={<RecordPayment />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/weekly-review" element={<WeeklyReview />} />
          <Route path="/future" element={<Future />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<AppSettings />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
