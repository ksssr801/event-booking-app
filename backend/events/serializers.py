from rest_framework import serializers
from .models import Category, TimeSlot, Booking

# Simulated hardcoded user ID for now
CURRENT_USER_ID = 1

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'user_id', 'timeslot', 'booked_at']
        read_only_fields = ['user_id', 'booked_at']

class TimeSlotSerializer(serializers.ModelSerializer):
    is_booked = serializers.SerializerMethodField()
    user_booked = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = TimeSlot
        fields = ['id', 'category', 'category_name', 'start_time', 'end_time', 'is_booked', 'user_booked']

    def get_is_booked(self, obj):
        return hasattr(obj, 'booking')

    def get_user_booked(self, obj):
        if hasattr(obj, 'booking'):
            return obj.booking.user_id == CURRENT_USER_ID
        return False
