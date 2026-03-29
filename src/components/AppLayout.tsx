import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, Plus, History, Target, Map, Trophy, CalendarCheck,
  Sparkles, User, Settings, Crown, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Debts", icon: CreditCard, path: "/debts" },
  { label: "Add Debt", icon: Plus, path: "/add-debt" },
  { label: "Payment History", icon: History, path: "/payment-history" },
  { label: "Strategy", icon: Target, path: "/strategy" },
  { label: "Journey", icon: Map, path: "/journey" },
  { label: "Milestones", icon: Trophy, path: "/milestones" },
  { label: "Weekly Review", icon: CalendarCheck, path: "/weekly-review" },
  { label: "Future Screen", icon: Sparkles, path: "/future" },
];

const bottomItems = [
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Subscription", icon: Crown, path: "/subscription" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-sidebar-foreground">Debt Free</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4 space-y-1 border-t border-sidebar-border pt-4">
        {bottomItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <NavContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-sidebar">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-sidebar-foreground">
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 lg:px-6 gap-4 bg-card">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {navItems.concat(bottomItems).filter(i => i.path === location.pathname).map(i => (
              <span key={i.path} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">{i.label}</span>
              </span>
            ))}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
