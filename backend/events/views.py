from datetime import timedelta

from django.db import IntegrityError
from django.utils.dateparse import parse_date
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Booking, Category, TimeSlot
from .serializers import CategorySerializer, TimeSlotSerializer

CURRENT_USER_ID = 1


# Category ViewSet
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    authentication_classes = []


# TimeSlot ViewSet
class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.select_related("category", "booking").all()
    serializer_class = TimeSlotSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    # LIST with time filter
    def list(self, request, *args, **kwargs):
        week_start_str = request.GET.get("week_start")
        category = request.GET.get("category")

        if not week_start_str:
            return Response({"error": "week_start is required"}, status=400)

        week_start = parse_date(week_start_str)
        if not week_start:
            return Response({"error": "Invalid date"}, status=400)

        start_of_week = week_start
        end_of_week = start_of_week + timedelta(days=6)

        queryset = self.queryset.filter(
            start_time__date__gte=start_of_week, start_time__date__lte=end_of_week
        )

        if category:
            queryset = queryset.filter(category__name=category)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # BOOK SLOT
    @action(detail=True, methods=["post"])
    def book(self, request, pk=None):
        timeslot = self.get_object()

        try:
            Booking.objects.create(user_id=CURRENT_USER_ID, timeslot=timeslot)
            return Response({"message": "Booked"}, status=201)
        except IntegrityError:
            return Response({"error": "Already booked"}, status=400)

    # CANCEL BOOKING
    @action(detail=True, methods=["delete"])
    def cancel(self, request, pk=None):
        try:
            booking = Booking.objects.get(timeslot_id=pk, user_id=CURRENT_USER_ID)
            booking.delete()
            return Response({"message": "Cancelled"})
        except Booking.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

    # ADMIN LIST
    @action(detail=False, methods=["get"])
    def admin(self, request):
        queryset = self.queryset.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
