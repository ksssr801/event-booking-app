import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../services/api.service';
import { Category, TimeSlot, SlotCreateRequest } from '../models/event.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
    MatFormFieldModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  categories: Category[] = [];
  slots: TimeSlot[] = [];

  newSlot: SlotCreateRequest = {
    category: '',
    start_time: '',
    end_time: ''
  };

  displayedColumns = ['category', 'time', 'status'];

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log('Admin Dashboard Loaded');
    this.loadCategories();
    this.loadAllSlots();
  }

  loadCategories() {
    this.api.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  loadAllSlots() {
    this.api.getAdminSlots().subscribe((res) => {
      this.slots = res;
    });
  }

  createSlot(event: Event) {
    if (event) event.preventDefault();

    if (!this.newSlot.category || !this.newSlot.start_time || !this.newSlot.end_time) {
      this.snackBar.open('Please fill all values', 'Close', { duration: 3000 });
      return;
    }

    this.api.createSlot(this.newSlot).subscribe({
      next: () => {
        this.snackBar.open('Slot Added Successfully!', 'Close', { duration: 3000 });
        this.loadAllSlots();
        this.newSlot = { category: '', start_time: '', end_time: '' };
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error: Could not add slot', 'Close', { duration: 3000 });
      }
    });
  }
}
