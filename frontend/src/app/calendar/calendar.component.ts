import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ApiService } from '../services/api.service';
import { Category, TimeSlot } from '../models/event.models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  // Event and Category data
  slots: TimeSlot[] = [];
  categories: Category[] = [];

  // Weekly filters
  selectedCategory: string = '';
  weekStart: string = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.setCurrentWeek();
    this.loadCategories();
    // Load preference from local storage
    this.selectedCategory = localStorage.getItem('user_pref_cat') || '';
    this.loadSlots();
  }

  // Monday of the week (YYYY-MM-DD)
  setCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    this.weekStart = monday.toISOString().split('T')[0];
    console.log('Week starts at:', this.weekStart);
  }

  // Browse to Next Week
  nextWeek() {
    const date = new Date(this.weekStart);
    date.setDate(date.getDate() + 7);
    this.weekStart = date.toISOString().split('T')[0];
    this.loadSlots();
  }

  // Browse to Previous Week
  prevWeek() {
    const date = new Date(this.weekStart);
    date.setDate(date.getDate() - 7);
    this.weekStart = date.toISOString().split('T')[0];
    this.loadSlots();
  }

  // Fetch available categories
  loadCategories() {
    this.api.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  // Fetch available slots
  loadSlots() {
    localStorage.setItem('user_pref_cat', this.selectedCategory);
    this.api.getTimeSlots(this.weekStart, this.selectedCategory).subscribe((res) => {
      this.slots = res;
      console.log('Available slots:', res);
    });
  }

  // Sign up for slot
  book(slot: TimeSlot) {
    this.api.bookSlot(slot.id).subscribe({
      next: () => {
        alert('Successfully Booked!');
        this.loadSlots();
      },
      error: (err) => {
        console.error('Booking failed:', err);
        alert('Booking failed');
      }
    });
  }

  // Unsubscribe from slot
  cancel(slot: TimeSlot) {
    this.api.cancelSlot(slot.id).subscribe({
      next: () => {
        alert('Booking Cancelled!');
        this.loadSlots();
      },
      error: (err) => {
        console.error('Cancel failed:', err);
        alert('Cancel failed');
      }
    });
  }
}