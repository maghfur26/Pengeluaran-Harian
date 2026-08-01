export const CATEGORIES = [
  'Makanan',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  description: string;
  amount: number;
  category: Category;
  date: string;
  notes?: string;
}

export interface MonthlyExpense {
  year: number;
  month: number;
  monthName: string;
  total: number;
  count: number;
}

export interface DailyExpense {
  day: number;
  total: number;
  count: number;
}

export interface CategorySummary {
  _id: Category;
  total: number;
  count: number;
}

export interface ExpenseFilter {
  category?: Category;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse extends ApiResponse<{ token: string; user: User }> {}
