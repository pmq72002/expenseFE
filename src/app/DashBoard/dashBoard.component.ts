import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

  pieChartType: ChartType = 'doughnut';
  totalBudget = 6800000;
  totalRemaining = 3200000;
  pieChartPlugins = [ChartDataLabels];

  categories: Category[] = [
    { name: 'Ăn uống', spent: 800000, limit: 1500000 },
    { name: 'Xăng', spent: 200000, limit: 500000 },
    { name: 'Cầu lông', spent: 300000, limit: 400000 },
    { name: 'Bi-a', spent: 600000, limit: 400000 },
    { name: 'Thuốc lá', spent: 200000, limit: 300000 },
    { name: 'Mua sắm', spent: 100000, limit: 500000 },
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
    if (percent < 50) return 'bg-green';
    if (percent < 80) return 'bg-yellow';
    return 'bg-red';
  }

  // Dùng cho legend HTML
  getColorBox(c: Category): string {
    const colors = [
      '#22c55e', '#3b82f6', '#facc15', '#ef4444', '#a855f7', '#14b8a6'
    ];
    const index = this.categories.indexOf(c);
    return colors[index];
  }

  addExpense() {
    alert('Đi tới màn hình thêm chi tiêu');
  }

  pieChartData: ChartData<'doughnut'> = {
    labels: this.categories.map(c => c.name),
    datasets: [
      {
        data: this.categories.map(c => c.spent),
        backgroundColor: [
          '#22c55e', '#3b82f6', '#facc15', '#ef4444', '#a855f7', '#14b8a6'
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
        spacing: 5
      }
    ]
  };

  pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false, // cho canvas to lên
    cutout: '65%',
    plugins: {
      legend: { display: false }, // tắt legend chart, dùng HTML
      datalabels: { display: false } // tắt label trồi ra ngoài
    }
  };
}
