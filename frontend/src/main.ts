import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// ADD THIS
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()   // 👈 THIS FIXES YOUR ERROR
  ]
}).catch(err => console.error(err));