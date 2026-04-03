from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, TimeSlotViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"timeslots", TimeSlotViewSet, basename="timeslot")

urlpatterns = [
    path("", include(router.urls)),
]
