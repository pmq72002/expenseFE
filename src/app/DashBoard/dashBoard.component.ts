import { Component } from '@angular/core';
import {ChartConfiguration, ChartData, ChartOptions, ChartType} from "chart.js";

interface Category {
  name: string;
  spent: number;
  limit: number;
}

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.css'],
  templateUrl: './dashBoard.component.html',
})
export class DashboardComponent {

  pieChartType: ChartType = 'pie';
  totalBudget = 6800000;
  totalRemaining = 3200000;

  categories: Category[] = [
    { name: 'Ăn uống', spent: 800000, limit: 1500000 },
    { name: 'Xăng', spent: 200000, limit: 500000 },
    { name: 'Cầu lông', spent: 300000, limit: 400000 },
    { name: 'Bi-a', spent: 600000, limit: 400000 },
    { name: 'Thuốc lá', spent: 200000, limit: 300000 },
    { name: 'Mua sắm', spent: 100000, limit: 500000 }
  ];

  getPercent(c: Category): number {
    return Math.min((c.spent / c.limit) * 100, 100);
  }

  getTotalPercent(): number {
    return Math.min(
      ((this.totalBudget - this.totalRemaining) / this.totalBudget) * 100,
      100
    );
  }

  getColor(c: Category): string {
    const percent = (c.spent / c.limit) * 100;

    if (percent < 70) return 'bg-green';
    if (percent < 100) return 'bg-yellow';
    return 'bg-red';
  }

  addExpense() {
    alert('Đi tới màn hình thêm chi tiêu');
  }

  pieChartData: ChartData<'pie'> = {
    labels: this.categories.map(c => c.name),
    datasets: [
      {
        data: this.categories.map(c => c.spent),
        backgroundColor: [
          '#22c55e', // ăn uống
          '#3b82f6', // xăng
          '#facc15', // cầu lông
          '#ef4444', // bi-a
          '#a855f7', // thuốc lá
          '#14b8a6'  // mua sắm
        ]
      }
    ]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
}
