# Event Booking System - Assessment Report

## Project Overview
This is a full-stack event booking application developed as part of a technical assessment. The objective was to build a functional system for managing event time slots with a clear separation between User and Admin roles.

## Key Features
- **Weekly Calendar View**: A dynamic 7-day view with easy "Next/Prev" week navigation.
- **Admin Dashboard**: A dedicated space to create new slots and monitor current sign-ups.
- **Category Persistence**: Uses `localStorage` to remember a user's category preference across sessions.
- **Stable Notifications**: Implemented `MatSnackBar` for a smooth, flicker-free user experience.

---

## Technical Stack
- **Backend**: Django & Django REST Framework (RESTful API).
- **Frontend**: Angular 17+, Angular Material (UI/UX).
- **Security**: Configured for cross-browser stability (Brave/Chrome) via CORS proxying.

---

## Challenges & Solutions

### 1. Browser-Specific Logic (The Brave Challenge)
**Issue**: Privacy-hardened browsers like Brave frequently blocked standard session cookies and triggered page refreshes during `alert()` calls.
**Solution**: Switched from standard alerts to **Angular Material SnackBars** and implemented **`event.preventDefault()`** on all buttons. This stabilized the UI and ensured notifications stayed visible.

### 2. Concurrency & Data Integrity
**Issue**: Ensuring that a single time slot can only be booked by one person.
**Solution**: Used a `OneToOneField` in the Django `Booking` model. This enforces a strict database-level constraint, ensuring that double-booking is impossible even at the API level.

### 3. Navigation & State
**Issue**: Direct URL entry (e.g., `/admin`) would reset the app to the default view.
**Solution**: Implemented **Angular Routing**. This allows for stable URL-based navigation and ensures the app state is preserved when moving between the calendar and admin views.

---

## Setup & Execution

### Backend (Django)
1. Navigate to `backend/`, run `uv sync` to install dependencies.
2. Run `uv run python manage.py migrate`.
3. Seed categories with `uv run python manage.py shell` (Yoga, Gym, etc.).
4. Start with `uv run python manage.py runserver`.

### Frontend (Angular)
1. Navigate to `frontend/`, run `pnpm install`.
2. Start the development server with `pnpm start`.
3. Access at `http://localhost:4200`.