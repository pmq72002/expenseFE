export interface ExpenseRow  {
  id?: number; // 👈 để update
  categoryId: number;
  amount: number;
  description: string;
  date: string;
  type: 'EXPENSE' | 'INCOME';
}
