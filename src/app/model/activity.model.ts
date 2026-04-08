import {Category} from "./category.model";

export interface Activity {
  id: number;
  amount: number;
  created_at: string;
  category: Category;
}
