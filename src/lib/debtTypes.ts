export const DEBT_TYPES = [
  "Credit Card",
  "Personal Loan",
  "Student Loan",
  "Car Loan",
  "Mortgage",
  "Medical",
  "Business Loan",
  "Other",
] as const;

export type DebtType = (typeof DEBT_TYPES)[number];
