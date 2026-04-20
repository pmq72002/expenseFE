import {Component, OnInit} from "@angular/core";
import {ApiService} from "../services/api.service";

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

  constructor(private api: ApiService) {}
  ngOnInit() {
    this.loadInsight();
  }

  loadInsight() {
    this.api.getTopDay().subscribe((res: any) => {
      this.topDay = res;
    });

    this.api.getTopCategory().subscribe((res: any) => {
      this.topCategory = res;
    });

    this.api.getTopDayList().subscribe(res => {
      this.topDayList = res;
    });

    this.api.getTopCategoryList().subscribe(res => {
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
