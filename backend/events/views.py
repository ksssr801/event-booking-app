from datetime import timedelta
from django.db import IntegrityError
from django.utils.dateparse import parse_date
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Booking, Category, TimeSlot
from .serializers import CategorySerializer, TimeSlotSerializer

# Temporary simulated user ID for the demo application
CURRENT_USER_ID = 1

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing categories.
    Only allows read-only access (listing and retrieving).
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class TimeSlotViewSet(viewsets.ModelViewSet):
    """
    Main ViewSet for managing event time slots.
    Handles listing by week, booking, and cancellation.
    """
    queryset = TimeSlot.objects.select_related("category", "booking").all()
    serializer_class = TimeSlotSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request, *args, **kwargs):
        """
        Retrieves a list of timeslots, filtered by a required 'week_start' date.
        Optional 'category' name filter can also be applied.
        """
        week_start_str = request.GET.get("week_start")
        category_name = request.GET.get("category")

        if not week_start_str:
            return Response({"error": "week_start is required (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

        week_start = parse_date(week_start_str)
        if not week_start:
            return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate the weekly range boundaries
        end_of_week = week_start + timedelta(days=6)

        queryset = self.queryset.filter(
            start_time__date__gte=week_start,
            start_time__date__lte=end_of_week
        )

        if category_name:
            queryset = queryset.filter(category__name=category_name)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def book(self, request, pk=None):
        """
        Custom action to book a specific timeslot for the current simulation user.
        Uses a database-level IntegrityError check to handle double-bookings safely.
        """
        timeslot = self.get_object()
        try:
            Booking.objects.create(user_id=CURRENT_USER_ID, timeslot=timeslot)
            return Response({"message": "Successfully booked"}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"error": "This slot is already booked"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["delete"])
    def cancel(self, request, pk=None):
        """
        Custom action to cancel an existing booking for the given timeslot.
        Verified against the current simulation user ID.
        """
        try:
            booking = Booking.objects.get(timeslot_id=pk, user_id=CURRENT_USER_ID)
            booking.delete()
            return Response({"message": "Booking successfully cancelled"}, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "No booking found to cancel"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["get"])
    def admin(self, request):
        """
        Admin action to retrieve ALL slots in the database.
        Used for the administrative monitoring dashboard.
        """
        queryset = self.queryset.all().order_by('start_time')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
