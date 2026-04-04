# Event Booking System

A full-stack web application that allows users to book event time slots from a weekly calendar. Built with **Django (Backend)** and **Angular (Frontend)**, using **Angular Material** for a good UI.

## Features
- **Weekly Calendar View**: Browse event slots scoping a 7-day week with Next/Previous navigation.
- **Category Filtering**: Filter slots by interest (Yoga, Gym, etc.).
- **User Booking**: One-click sign-up and cancellation for individual slots.
- **Admin Dashboard**: Create new timeslots and monitor existing bookings across the system.
- **User Preferences**: Remembers your category selection for future visits (LocalStorage).
- **Concurrency Control**: Enforces a database-level "One booking per slot" constraint.

---

## Tech Stack
- **Backend**: Python, Django, Django REST Framework, UV.
- **Frontend**: Angular 17+, Angular Material.
- **Documentation**: Swagger/OpenAPI via `drf-spectacular`.

---

## Setup Instructions

### 1. Backend Setup (Django)
1. Navigate to the `backend/` directory.
2. Initialize environment and install dependencies:
   ```bash
   uv sync
   ```
3. Run migrations and seed data:
   ```bash
   uv run python manage.py migrate
   uv run python manage.py shell <<EOF
from events.models import Category
Category.objects.get_or_create(name="Yoga")
Category.objects.get_or_create(name="Gym")
Category.objects.get_or_create(name="Conference")
EOF
   ```
4. Start the server:
   ```bash
   uv run python manage.py runserver
   ```
   **API Docs:** [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)

### 2. Frontend Setup (Angular)
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the dev server:
   ```bash
   pnpm start
   ```
4. Open your browser at: [http://localhost:4200](http://localhost:4200)

---

## Architecture Decisions
- **OneToOneField**: Used for `Booking` to ensure a `TimeSlot` can only be linked to a single user without complex validation logic.
- **Angular Standalone Components**: Modern Angular architecture for better performance and smaller bundle sizes.
- **CORS Proxy**: Configured `proxy.conf.json` to route `/api` calls safely to the backend without complex CORS policy changes.

---

## Code Quality & Best Practices
- **Type Safety**: Fully typed TypeScript interfaces in the frontend to prevent runtime errors and improve developer productivity.
- **Efficient Queries**: Django's `select_related` used to avoid N+1 query problems in the timeslot APIs.
- **Professional Documentation**: Codebases in both frontend and backend are documented using JSDoc and Docstrings for high readability.
- **Centralized Error Handling**: Standardized pattern for catching and processing API errors across the frontend services.