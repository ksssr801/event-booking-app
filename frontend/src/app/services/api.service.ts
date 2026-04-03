import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Get categories
  getCategories() {
    return this.http.get(`${this.baseUrl}/categories/`);
  }

  // Get timeslots (with filters)
  getTimeSlots(weekStart: string, category?: string) {
    let url = `${this.baseUrl}/timeslots/?week_start=${weekStart}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get(url);
  }

  // Book slot
  bookSlot(id: number) {
    return this.http.post(`${this.baseUrl}/timeslots/${id}/book/`, {});
  }

  // Cancel booking
  cancelSlot(id: number) {
    return this.http.delete(`${this.baseUrl}/timeslots/${id}/cancel/`);
  }
}