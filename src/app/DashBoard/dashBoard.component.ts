import {Component, OnInit} from '@angular/core';
import { ChartData, ChartOptions, ChartType} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ApiService} from "../services/api.service";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Budget {
  category_id : number;
  month: string;
  max_amount: number;
}

interface Activity {
  category_id : number;
  amount: number;
  created_at: string;
}

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.css'],
  templateUrl: './dashBoard.component.html',
})
export class DashboardComponent implements OnInit{

  pieChartType: ChartType = 'doughnut';
  totalIncome: number = 0;
  pieChartPlugins = [ChartDataLabels];
  categories: Category[] = [];
  budgets: Budget[] = [];
  incomeList: any[] = [];
  currentMonth: string = '';
  activities: Activity[] = [];
  constructor(
    private api: ApiService
  ) {
  }
  ngOnInit() {
    this.getCategory();
    this.getBudget();
    this.getInCome();
    this.getActivity();
  }

  getInCome() {
    this.api.getIncome().subscribe(data => {
      this.incomeList = data;

      const now = new Date();
      const current = this.incomeList.find(i => {
        const d = new Date(i.month);
        return d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear();
      });

      if (current) {
        this.totalIncome = current.total_income;
      } else {
        this.totalIncome = 0; // tránh undefined
      }

      this.currentMonth = `${now.getMonth() + 1}`;
    });
  }

  getCategory() {
    this.api.getCategory().subscribe(data => {
      this.categories = data;

      // update chart luôn
      this.pieChartData.labels = this.categories.map(c => c.name);

      this.pieChartData = { ...this.pieChartData };
    });
  }

  getBudget() {
      this.api.getBudget().subscribe(data => {
        this.budgets = data;

        this.pieChartData.datasets[0].data =
          this.budgets.map(b => b.max_amount);

        this.pieChartData = { ...this.pieChartData };
      })
  }

  getActivity(){
    this.api.getActivity().subscribe(data => {
      this.activities = data;
      this.updateChart();
    })
  }

  getAmount(categoryId: number): number {
    const now = new Date();

    return this.activities
      .filter(a => {
        const d = new Date(a.created_at);
        return a.category_id === categoryId &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, a) => sum + a.amount, 0);
  }

  getMaxAmount(categoryId: number): number {
    const now = new Date();

    const budget = this.budgets.find(b => {
      const d = new Date(b.month);
      return b.category_id === categoryId &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
    });

    return budget ? budget.max_amount : 0;
  }

  getPercent(c: Category): number {
    const amount = this.getAmount(c.id);
    const maxAmount = this.getMaxAmount(c.id);

    if (maxAmount === 0) return 0;

    return Math.min((amount / maxAmount) * 100, 100);
  }

  getTotalSpent(): number {
    return this.activities.reduce((sum, a) => sum + a.amount, 0);
  }

  getTotalPercent(): number {
    const totalSpent = this.getTotalSpent();
    if (this.totalIncome === 0) return 0;

    return Math.min((totalSpent / this.totalIncome) * 100, 100);
  }

  getColor(c: Category): string {
    const percent = this.getPercent(c);
    if (percent < 50) return 'bg-green';
    if (percent < 80) return 'bg-yellow';
    return 'bg-red';
  }

  getTotalColor(): string {
    const percent = this.getTotalPercent();

    if (percent < 50) return 'bg-green';
    if (percent < 80) return 'bg-yellow';
    return 'bg-red';
  }

  getTotalTextColor(): string {
    const percent = this.getTotalPercent();

    if (percent < 50) return 'text-green';
    if (percent < 80) return 'text-yellow';
    return 'text-red';
  }

  getBackgroundColors(count: number): string[] {
    const baseColors = [
      '#22c55e', '#3b82f6', '#facc15',
      '#ef4444', '#a855f7', '#14b8a6',
      '#f97316', '#0ea5e9', '#eab308'
    ];

    return Array.from({ length: count }, (_, i) =>
      baseColors[i % baseColors.length]
    );
  }
  // Dùng cho legend HTML
  getColorBox(c: Category): string {
    const colors = this.getBackgroundColors(this.categories.length);
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
        data: this.categories.map(c => this.getAmount(c.id)),
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
      legend: { display: false },
      datalabels: { display: false },

      tooltip: {
        enabled: true,

        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw;

            const data = context.dataset.data;
            const total = data.reduce((a: number, b: number) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(1);

            return `${label}: ${percent}%`;
          }
        }
      }
    }
  };


  updateChart() {
    const colors = this.getBackgroundColors(this.categories.length);

    this.pieChartData = {
      labels: this.categories.map(c => c.name),
      datasets: [
        {
          data: this.categories.map(c => this.getAmount(c.id)),
          backgroundColor: colors,
          borderWidth: 1,
          borderColor: '#ffffff',
          spacing: 5
        }
      ]
    };
  }
}
