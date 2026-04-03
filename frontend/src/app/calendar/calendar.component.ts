import { Component, OnInit } from '@angular/core';

// REQUIRED IMPORTS
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// We will create this next
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {

  // Data from backend
  slots: any[] = [];
  categories: any[] = [];

  // UI state
  selectedCategory: string = '';
  weekStart: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.setCurrentWeek();
    this.loadCategories();
    this.loadSlots();
  }

  // Set current week's Monday
  setCurrentWeek() {
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay()));
    this.weekStart = monday.toISOString().split('T')[0];
  }

  // Fetch categories
  loadCategories() {
    this.api.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  // Fetch timeslots
  loadSlots() {
    this.api.getTimeSlots(this.weekStart, this.selectedCategory)
      .subscribe((res: any) => {
        this.slots = res;
      });
  }

  // Book slot
  book(slot: any) {
    this.api.bookSlot(slot.id).subscribe(() => {
      this.loadSlots(); // refresh
    });
  }

  // Cancel booking
  cancel(slot: any) {
    this.api.cancelSlot(slot.id).subscribe(() => {
      this.loadSlots(); // refresh
    });
  }
}