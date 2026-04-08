import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {Router} from "@angular/router";
import {ExpenseRow} from "../model/expense.model";
import {Category} from "../model/category.model";


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit{
  categories: Category[] = [];
  showForm = false; // 👈 bật/tắt form
  rows: ExpenseRow[] = [];
  selectedDate: string = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getCategory();
    this.getToday()
    this.getActivities();
  }

  getToday() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  getCategory() {
    this.api.getCategory().subscribe(data => {
      this.categories = data;
    });
  }

  openForm() {
    this.showForm = true;

    if (this.rows.length === 0) {
      this.addRow();
    }
  }

  addRow() {
    if (this.categories.length === 0) return;

    this.rows.push({
      categoryId: this.categories[0].id!,
      amount: 0,
      description: '',
      date: this.selectedDate
    });
  }

  deleteRow(i: number) {
    this.rows.splice(i, 1);
  }

  save() {
    const payload = this.rows.map(r => ({
      id: r.id,
      categoryId: r.categoryId,
      amount: r.amount,
      date: this.selectedDate,
      description: r.description
    }));

    this.api.saveActivities(payload).subscribe({
      next: () => {
        alert('Lưu thành công');
        this.getActivities();
      }
    });
  }
  getActivities() {
    this.api.getActivities().subscribe(data => {

      const today = this.selectedDate;

      this.rows = data
        .map(a => ({
          id: a.id,
          categoryId: a.category.id,
          amount: a.amount,
          description: a.description,
          date: a.created_at.split('T')[0]
        }))
        .filter(r => r.date === today); // 👈 lọc theo ngày

      this.showForm = true;
    });
  }

  onDateChange() {
    this.getActivities();
  }
}
