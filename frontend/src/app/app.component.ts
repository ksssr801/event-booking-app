import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// UI components
import { CalendarComponent } from './calendar/calendar.component';
import { AdminComponent } from './admin/admin.component';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CalendarComponent,
    AdminComponent,
    MatButtonModule,
    MatToolbarModule
  ],
  template: `
    <mat-toolbar color="accent" style="height: 50px; font-size: 16px;">
      <span>Navigation:</span>
      <button mat-button (click)="view = 'calendar'">User Calendar</button>
      <button mat-button (click)="view = 'admin'">Admin Dashboard</button>
    </mat-toolbar>

    <div *ngIf="view === 'calendar'">
      <app-calendar></app-calendar>
    </div>
    <div *ngIf="view === 'admin'">
      <app-admin></app-admin>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  view: 'calendar' | 'admin' = 'calendar';
}