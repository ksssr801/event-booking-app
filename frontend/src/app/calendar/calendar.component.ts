import { Component, OnInit } from '@angular/core';

// REQUIRED IMPORTS
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// MATERIAL IMPORTS
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

// We will create this next
import { ApiService } from '../services/api.service';

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

  // Data from backend
  slots: any[] = [];
  categories: any[] = [];

  // UI state
  selectedCategory: string = '';
  weekStart: string = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.setCurrentWeek();
    this.loadCategories();
    // Load from preference
    this.selectedCategory = localStorage.getItem('user_pref_cat') || '';
    this.loadSlots();
  }

  // Set current week's Monday (start of the week)
  setCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    this.weekStart = monday.toISOString().split('T')[0];
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

  // Fetch categories
  loadCategories() {
    this.api.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  // Fetch timeslots
  loadSlots() {
    // Save preference
    localStorage.setItem('user_pref_cat', this.selectedCategory);

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