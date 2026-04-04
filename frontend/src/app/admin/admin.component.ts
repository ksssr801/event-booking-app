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

  // Used for the creation form
  newSlot: SlotCreateRequest = {
    category: '',
    start_time: '',
    end_time: ''
  };

  displayedColumns = ['category', 'time', 'status'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('Admin page loaded');
    this.loadCategories();
    this.loadAllSlots();
  }

  // Fetch all available category options
  loadCategories() {
    this.api.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  // Load every slot for monitoring
  loadAllSlots() {
    this.api.getAdminSlots().subscribe((res) => {
      this.slots = res;
      console.log('All slots for admin:', res);
    });
  }

  // Perform slot creation
  createSlot() {
    if (!this.newSlot.category || !this.newSlot.start_time || !this.newSlot.end_time) {
      alert('Please fill all values');
      return;
    }

    console.log('Sending slot data:', this.newSlot);

    this.api.createSlot(this.newSlot).subscribe({
      next: () => {
        alert('Slot Added!');
        this.loadAllSlots();
        this.newSlot = { category: '', start_time: '', end_time: '' };
      },
      error: (err) => {
        console.error('Error adding slot:', err);
        alert('Error adding slot');
      }
    });
  }
}
