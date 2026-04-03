from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class TimeSlot(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="timeslots"
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name}: {self.start_time} - {self.end_time}"

    class Meta:
        ordering = ["start_time"]
        constraints = [
            models.UniqueConstraint(
                fields=["category", "start_time", "end_time"], name="unique_timeslot"
            )
        ]


class Booking(models.Model):
    # Simulated user_id, hardcoded for now as per instructions
    user_id = models.IntegerField()
    timeslot = models.OneToOneField(
        TimeSlot, on_delete=models.CASCADE, related_name="booking"
    )
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User {self.user_id} booked {self.timeslot}"
