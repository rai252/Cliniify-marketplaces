from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta

from users.models import User
from core.models import BaseModel
from doctors.models import Doctor
from patients.models import Patient


# Create your models here.
class Appointment(BaseModel):
    class Status(models.TextChoices):
        PENDING = "pending"
        CONFIRMED = "confirmed"
        REJECTED = "rejected"
        RESCHEDULED = "rescheduled"
        CANCELLED = "cancelled"
        COMPLETED = "completed"

    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="appointments_doctors"
    )
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments_patients",
        blank=True,
        null=True,
    )
    establishment = models.ForeignKey(
        "establishments.Establishment",
        on_delete=models.CASCADE,
        related_name="appointments_establishment",
        blank=True,
        null=True,
    )

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    message = models.TextField(blank=True, null=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    is_rescheduled = models.BooleanField(default=False)
    reschedule_reason = models.TextField(blank=True, null=True)

    is_paid = models.BooleanField(default=False)

    class Meta:
        ordering = ["-requested_at"]

    def save(self, *args, **kwargs):
        if self.start_time and self.end_time:
            start_datetime = datetime.combine(datetime.today(), self.start_time)
            end_datetime = datetime.combine(datetime.today(), self.end_time)

            # Calculate duration
            duration_timedelta = end_datetime - start_datetime
            self.duration = duration_timedelta
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.date} - {self.start_time} - {self.end_time} - {self.status} - {self.doctor}"
