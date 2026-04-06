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
}
