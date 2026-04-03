from django.contrib import admin

from .models import Booking, Category, TimeSlot

admin.site.register(Category)
admin.site.register(TimeSlot)
admin.site.register(Booking)
