import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';

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
    RouterModule,
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatToolbarModule
  ],
  template: `
    <mat-toolbar color="accent" style="height: 50px; font-size: 16px;">
      <span>Navigation:</span>
      <button type="button" mat-button routerLink="/" routerLinkActive="active">User Calendar</button>
      <button type="button" mat-button routerLink="/admin" routerLinkActive="active">Admin Dashboard</button>
    </mat-toolbar>

    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent { }