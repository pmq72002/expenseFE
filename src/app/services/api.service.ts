import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }
  getIncome() {
    return this.http.get<any[]>(`${this.baseUrl}/income`);
  }
  getCategory() {
    return this.http.get<any[]>(`${this.baseUrl}/category`);
  }
  getBudget() {
    return this.http.get<any[]>(`${this.baseUrl}/budget`);
  }
  getActivity() {
    return this.http.get<any[]>(`${this.baseUrl}/activity`);
  }

  saveActivities(payload: { categoryId: number; amount: number; date: string }[]) {
    return this.http.post<any[]>(`${this.baseUrl}/activity`, payload);
  }

  getActivities() {
    return this.http.get<any[]>(`${this.baseUrl}/activities`);
  }

  getActivitiesByDate() {
    return this.http.get<any[]>(`${this.baseUrl}/group-by-date`);
  }

  deleteActivity(id: number) {
    return this.http.delete(`${this.baseUrl}/activity/${id}`);
  }

  getTopDay(month: string) {
    return this.http.get<any>(
      `${this.baseUrl}/top-day?month=${month}`
    );
  }

  getTopCategory(month: string) {
    return this.http.get<any>(
      `${this.baseUrl}/top-category?month=${month}`
    );
  }

  getTopDayList(month: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/top-day-list?month=${month}`
    );
  }

  getTopCategoryList(month: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/top-category-list?month=${month}`
    );
  }
}
