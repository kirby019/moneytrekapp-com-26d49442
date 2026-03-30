// Static demo data for the demo mode — no database access
export const DEMO_DEBTS = [
  {
    id: "demo-1",
    user_id: "demo",
    debt_name: "Chase Credit Card",
    original_amount: 8500,
    current_balance: 5100,
    interest_rate: 22.99,
    minimum_payment: 200,
    debt_type: "Credit Card",
    currency: "USD",
    status: "active",
    due_date: "2026-04-15",
    paid_off_date: null,
    created_at: "2025-11-01T00:00:00Z",
  },
  {
    id: "demo-2",
    user_id: "demo",
    debt_name: "Student Loan",
    original_amount: 25000,
    current_balance: 18750,
    interest_rate: 5.5,
    minimum_payment: 350,
    debt_type: "Student Loan",
    currency: "USD",
    status: "active",
    due_date: "2026-04-01",
    paid_off_date: null,
    created_at: "2025-09-15T00:00:00Z",
  },
  {
    id: "demo-3",
    user_id: "demo",
    debt_name: "Car Loan",
    original_amount: 15000,
    current_balance: 9000,
    interest_rate: 6.9,
    minimum_payment: 280,
    debt_type: "Auto Loan",
    currency: "USD",
    status: "active",
    due_date: "2026-04-10",
    paid_off_date: null,
    created_at: "2025-08-01T00:00:00Z",
  },
];

export const DEMO_PAYMENTS = [
  { id: "dp-1", user_id: "demo", debt_id: "demo-1", amount: 500, payment_date: "2026-01-15", notes: "Extra payment", is_extra_payment: true, created_at: "2026-01-15T00:00:00Z" },
  { id: "dp-2", user_id: "demo", debt_id: "demo-1", amount: 200, payment_date: "2026-02-15", notes: null, is_extra_payment: false, created_at: "2026-02-15T00:00:00Z" },
  { id: "dp-3", user_id: "demo", debt_id: "demo-1", amount: 300, payment_date: "2026-03-15", notes: "Paid extra this month", is_extra_payment: true, created_at: "2026-03-15T00:00:00Z" },
  { id: "dp-4", user_id: "demo", debt_id: "demo-2", amount: 350, payment_date: "2026-01-01", notes: null, is_extra_payment: false, created_at: "2026-01-01T00:00:00Z" },
  { id: "dp-5", user_id: "demo", debt_id: "demo-2", amount: 500, payment_date: "2026-02-01", notes: "Bonus payment", is_extra_payment: true, created_at: "2026-02-01T00:00:00Z" },
  { id: "dp-6", user_id: "demo", debt_id: "demo-2", amount: 350, payment_date: "2026-03-01", notes: null, is_extra_payment: false, created_at: "2026-03-01T00:00:00Z" },
  { id: "dp-7", user_id: "demo", debt_id: "demo-3", amount: 500, payment_date: "2026-01-10", notes: "Extra", is_extra_payment: true, created_at: "2026-01-10T00:00:00Z" },
  { id: "dp-8", user_id: "demo", debt_id: "demo-3", amount: 280, payment_date: "2026-02-10", notes: null, is_extra_payment: false, created_at: "2026-02-10T00:00:00Z" },
  { id: "dp-9", user_id: "demo", debt_id: "demo-3", amount: 280, payment_date: "2026-03-10", notes: null, is_extra_payment: false, created_at: "2026-03-10T00:00:00Z" },
];

export const DEMO_MILESTONES = [
  { id: "dm-1", user_id: "demo", milestone_percent: 10, achieved_date: "2025-12-15", created_at: "2025-12-15T00:00:00Z" },
  { id: "dm-2", user_id: "demo", milestone_percent: 25, achieved_date: "2026-02-20", created_at: "2026-02-20T00:00:00Z" },
];

export const DEMO_STREAK = { id: "ds-1", user_id: "demo", current_streak: 5, last_activity_date: "2026-03-28", created_at: "2026-03-28T00:00:00Z" };

export const DEMO_PROFILE = { id: "demo", email: "demo@moneytrek.app", full_name: "Demo User", default_currency: "USD", created_at: "2025-08-01T00:00:00Z" };

// Computed demo stats
export function getDemoStats() {
  const debts = DEMO_DEBTS;
  const totalOriginal = debts.reduce((s, d) => s + d.original_amount, 0); // 48500
  const totalBalance = debts.reduce((s, d) => s + d.current_balance, 0); // 32850
  const totalPaid = totalOriginal - totalBalance; // 15650
  const overallProgress = Math.round((totalPaid / totalOriginal) * 100); // ~32%
  const totalMinPayment = debts.reduce((s, d) => s + d.minimum_payment, 0); // 830
  const activeDebts = debts.filter(d => d.status !== "paid");
  const paidOffCount = debts.filter(d => d.status === "paid").length;

  return {
    totalOriginal,
    totalBalance,
    totalPaid,
    overallProgress,
    totalMinPayment,
    activeCount: activeDebts.length,
    paidOffCount,
    journeyProgress: 32,
    currentStreak: DEMO_STREAK.current_streak,
    debtFreeDate: new Date("2028-06-15"),
    currency: "USD",
  };
}
