import {Component, OnInit} from "@angular/core";
import {ApiService} from "../services/api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit{
  topDay: any;
  topCategory: any;
  topDayList: any[] = [];
  topCategoryList: any[] = [];
  showDayList = false;
  showCategoryList = false;
  selectedMonth: string = '';

  constructor(private api: ApiService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      this.selectedMonth = params['month'];

      this.loadInsight();
    });
  }

  loadInsight() {

    this.api.getTopDay(this.selectedMonth)
      .subscribe((res: any) => {
        this.topDay = res;
      });

    this.api.getTopCategory(this.selectedMonth)
      .subscribe((res: any) => {
        this.topCategory = res;
      });

    this.api.getTopDayList(this.selectedMonth)
      .subscribe(res => {
        this.topDayList = res;
      });

    this.api.getTopCategoryList(this.selectedMonth)
      .subscribe(res => {
        this.topCategoryList = res;
      });
  }

  toggleDayList() {
    this.showDayList = !this.showDayList;
    this.showCategoryList = false;
  }

  toggleCategoryList() {
    this.showCategoryList = !this.showCategoryList;
    this.showDayList = false;
  }
}
