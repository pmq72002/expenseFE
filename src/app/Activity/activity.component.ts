import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Category } from '../model/category.model';
import { ExpenseRow } from '../model/expense.model';

interface ActivityGroup {
  date: string;
  rows: ExpenseRow[];
  editing: boolean;
  deletedIds: number[];
}

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  categories: Category[] = [];
  groupedActivities: ActivityGroup[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCategory().subscribe(data => {
      this.categories = data;
      this.loadGrouped();
    });
  }

  loadGrouped() {
    this.api.getActivitiesByDate().subscribe((data: any) => {
      this.groupedActivities = Object.keys(data)
        .sort((a, b) => b.localeCompare(a))
        .map(date => ({
          date,
          editing: false,
          deletedIds: [],
          rows: data[date].map((a: any) => ({
            id: a.id,
            categoryId: a.category.id,
            amount: a.amount,
            description: a.description,
            date: a.createdAt.split('T')[0]
          }))
        }));
    });
  }

  toggleEdit(group: ActivityGroup) {
    if (group.editing) {
      // Hủy → reload lại data
      this.loadGrouped();
    } else {
      group.editing = true;
    }
  }

  addRow(group: ActivityGroup) {
    if (this.categories.length === 0) return;
    group.rows.push({
      categoryId: this.categories[0].id!,
      amount: 0,
      description: '',
      date: group.date
    });
  }

  formatAmount(value: number): string {
    if (!value) return '';
    return value.toLocaleString('vi-VN');
  }

  onAmountFocus(event: Event, row: ExpenseRow) {
    const input = event.target as HTMLInputElement;
    input.value = row.amount ? String(row.amount) : '';
  }

  onAmountBlur(event: Event, row: ExpenseRow) {
    const input = event.target as HTMLInputElement;
    const num = parseInt(input.value.replace(/\D/g, ''), 10) || 0;
    row.amount = num;
    input.value = this.formatAmount(num);
  }

  onAmountInput(event: Event, row: ExpenseRow) {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    row.amount = num;
    if (raw) {
      const pos = input.selectionStart || 0;
      const oldLen = input.value.length;
      input.value = num.toLocaleString('vi-VN');
      const newLen = input.value.length;
      input.setSelectionRange(pos + newLen - oldLen, pos + newLen - oldLen);
    }
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  deleteRow(group: ActivityGroup, i: number) {
    const row = group.rows[i];
    if (row.id) {
      group.deletedIds.push(row.id);
    }
    group.rows.splice(i, 1);
  }

  saveGroup(group: ActivityGroup) {
    const deletes$ = group.deletedIds.length > 0
      ? forkJoin(...group.deletedIds.map(id => this.api.deleteActivity(id)))
      : of(null);

    deletes$.subscribe({
      next: () => {
        const payload = group.rows.map(r => ({
          id: r.id,
          categoryId: r.categoryId,
          amount: r.amount,
          date: group.date,
          description: r.description
        }));

        this.api.saveActivities(payload).subscribe({
          next: () => {
            alert('Lưu thành công ngày ' + group.date);
            this.loadGrouped();
          }
        });
      }
    });
  }
}
