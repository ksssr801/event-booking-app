import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: CalendarComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to the calendar
];
