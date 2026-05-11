import {Component, OnInit} from '@angular/core';
import { ChartData, ChartOptions, ChartType} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ApiService} from "../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Category} from "../model/category.model";
import {Budget} from "../model/budget.model";
import {Activity} from "../model/activity.model";


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
  selectedMonth: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit() {
    const now = new Date();

    this.route.queryParams.subscribe(params => {

      if (params['month']) {

        this.selectedMonth = params['month'];

      } else {

        const now = new Date();

        this.selectedMonth =
          `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      }

      this.getCategory();
      this.getBudget();
      this.getInCome();
      this.getActivity();
    });
  }

  getInCome() {
    this.api.getIncome().subscribe(data => {

      this.incomeList = data;

      const { start, end } = this.getDateRange();

      const current = this.incomeList
        .filter(i => {
          const d = new Date(i.month);
          return d >= start && d < end;
        })
        .sort((a, b) =>
          new Date(b.month).getTime() -
          new Date(a.month).getTime()
        )[0];

      this.totalIncome = current
        ? current.total_income
        : 0;

      this.currentMonth =
        `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
    });
  }

  getDateRange() {

    const [year, month] = this.selectedMonth.split('-').map(Number);

    const start = new Date(year, month - 1, 10);
    const end = new Date(year, month, 10);

    return { start, end };
  }

  getCategory() {
    this.api.getCategory().subscribe(data => {
      this.categories = data.sort((a,b) => a.id - b.id);

      // update chart luôn
      this.pieChartData.labels = this.categories.map(c => c.name);

      this.pieChartData = { ...this.pieChartData };
    });
  }

  getBudget() {
    this.api.getBudget().subscribe(data => {
      this.budgets = data.sort((a,b) => a.category_id - b.category_id);

      this.updateChart(); // ✅ dùng category map thay vì budget map
    });
  }

  getActivity(){
    this.api.getActivity().subscribe(data => {
      this.activities = data;
      this.updateChart();
    })
  }

  getAmount(categoryId: number): number {
    const { start, end } = this.getDateRange();

    return this.activities
      .filter(a => {
        const d = new Date(a.createdAt);
        return a.category?.id === categoryId &&
          d >= start && d < end;
      })
      .reduce((sum, a) => {
        if (a.type === 'EXPENSE') return sum + a.amount;
        if (a.type === 'INCOME') return sum - a.amount;
        return sum;
      }, 0);
  }

  getMaxAmount(categoryId: number): number {
    const { start, end } = this.getDateRange();

    if (categoryId === 8) {
      const otherMax = this.budgets
        .filter(b => {
          const d = new Date(b.month);
          return b.category_id !== 8 && d >= start && d < end;
        })
        .reduce((sum, b) => sum + b.max_amount, 0);
      return Math.max(this.totalIncome - otherMax, 0);
    }

    const budget = this.budgets.find(b => {
      const d = new Date(b.month);
      return b.category_id === categoryId && d >= start && d < end;
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
    const { start, end } = this.getDateRange();

    return this.activities
      .filter(a => {
        const d = new Date(a.createdAt);
        return a.type === 'EXPENSE' && d >= start && d < end;
      })
      .reduce((sum, a) => sum + a.amount, 0);
  }

  getTotalIncomeReal(): number {
    const { start, end } = this.getDateRange();

    return this.activities
      .filter(a => {
        const d = new Date(a.createdAt);
        return a.type === 'INCOME' && d >= start && d < end;
      })
      .reduce((sum, a) => sum + a.amount, 0);
  }

  getBalance(): number {
    return this.totalIncome + this.getTotalIncomeReal() - this.getTotalSpent();
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

  addExpense() {
    this.router.navigate(['/budget']);
  }

  goToActivity() {
    this.router.navigate(['/activity'], { queryParams: { month: this.selectedMonth } });
  }

  goToStatistic() {
    this.router.navigate(
      ['/statistic'],
      { queryParams: { month: this.selectedMonth } }
    );
  }

  onMonthChange() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { month: this.selectedMonth },
        queryParamsHandling: 'merge'
      }
    );
    this.getInCome();
    this.updateChart();
    this.activities = [...this.activities];
  }

}
