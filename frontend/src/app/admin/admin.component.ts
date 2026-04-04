import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../services/api.service';

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

  categories: any[] = [];
  slots: any[] = [];

  // Form Model
  newSlot = {
    category: '',
    start_time: '',
    end_time: ''
  };

  displayedColumns = ['category', 'time', 'status'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadAllSlots();
  }

  loadCategories() {
    this.api.getCategories().subscribe((res: any) => this.categories = res);
  }

  loadAllSlots() {
    // We'll use the .admin action we created in the backend
    this.api.getAdminSlots().subscribe((res: any) => this.slots = res);
  }

  createSlot() {
    if (!this.newSlot.category || !this.newSlot.start_time || !this.newSlot.end_time) {
      alert('Please fill all fields');
      return;
    }

    this.api.createSlot(this.newSlot).subscribe(() => {
      this.loadAllSlots();
      this.newSlot = { category: '', start_time: '', end_time: '' }; // Clear
    });
  }
}
