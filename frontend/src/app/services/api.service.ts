import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, TimeSlot, SlotCreateRequest } from '../models/event.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Get categories from backend
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`);
  }

  // Get timeslots (with filtering)
  getTimeSlots(weekStart: string, category?: string): Observable<TimeSlot[]> {
    let url = `${this.baseUrl}/timeslots/?week_start=${weekStart}`;
    if (category) {
      url += `&category=${category}`;
    }
    return this.http.get<TimeSlot[]>(url);
  }

  // Booking functions
  bookSlot(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/timeslots/${id}/book/`, {});
  }

  cancelSlot(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/timeslots/${id}/cancel/`);
  }

  // Admin dashboard methods
  getAdminSlots(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.baseUrl}/timeslots/admin/`);
  }

  createSlot(data: SlotCreateRequest): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(`${this.baseUrl}/timeslots/`, data);
  }
}