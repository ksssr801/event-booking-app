import { Component } from '@angular/core';

// ADD THESE
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Import your component (we’ll create next)
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CalendarComponent
  ],
  template: `<app-calendar></app-calendar>`,
  styleUrl: './app.component.scss'
})
export class AppComponent { }