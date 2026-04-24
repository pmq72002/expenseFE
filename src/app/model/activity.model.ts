import {Category} from "./category.model";

export interface Activity {
  id: number;
  amount: number;
  createdAt: string;
  category: Category;
  type: 'EXPENSE' | 'INCOME';
}
