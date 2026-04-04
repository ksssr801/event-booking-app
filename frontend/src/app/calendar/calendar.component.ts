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
import { MatSnackBar } from '@angular/material/snack-bar';

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

  slots: TimeSlot[] = [];
  categories: Category[] = [];

  selectedCategory: string = '';
  weekStart: string = '';

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.setCurrentWeek();
    this.loadCategories();
    this.selectedCategory = localStorage.getItem('user_pref_cat') || '';
    this.loadSlots();
  }

  setCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    this.weekStart = monday.toISOString().split('T')[0];
  }

  nextWeek() {
    const date = new Date(this.weekStart);
    date.setDate(date.getDate() + 7);
    this.weekStart = date.toISOString().split('T')[0];
    this.loadSlots();
  }

  prevWeek() {
    const date = new Date(this.weekStart);
    date.setDate(date.getDate() - 7);
    this.weekStart = date.toISOString().split('T')[0];
    this.loadSlots();
  }

  loadCategories() {
    this.api.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  loadSlots() {
    localStorage.setItem('user_pref_cat', this.selectedCategory);
    this.api.getTimeSlots(this.weekStart, this.selectedCategory).subscribe((res) => {
      this.slots = res;
    });
  }

  book(event: Event, slot: TimeSlot) {
    if (event) event.preventDefault();

    this.api.bookSlot(slot.id).subscribe({
      next: () => {
        this.snackBar.open('Successfully Booked!', 'Close', { duration: 3000 });
        this.loadSlots();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error: Booking failed', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(event: Event, slot: TimeSlot) {
    if (event) event.preventDefault();

    this.api.cancelSlot(slot.id).subscribe({
      next: () => {
        this.snackBar.open('Booking Cancelled!', 'Close', { duration: 3000 });
        this.loadSlots();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error: Unsubscribe failed', 'Close', { duration: 3000 });
      }
    });
  }
}