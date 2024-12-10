from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import BaseModel
from users.models import User
from doctors.models import Doctor
from patients.models import Patient
from establishments.models import Establishment

class Feedback(BaseModel):
    class Rating(models.IntegerChoices):
        ONE = 1    
        TWO = 2 
        THREE = 3 
        FOUR = 4
        FIVE = 5
        
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="doctor_feedbacks"
    )
    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name="patient_feedbacks"
    )
    rating = models.PositiveSmallIntegerField(choices=Rating.choices)
    comment = models.TextField()
    comment_at = models.DateTimeField(auto_now_add=True)
    reply = models.TextField(null=True, blank=True)
    replied_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-comment_at"]

    def __str__(self):
        return f"{self.id} - Feedback for {self.doctor.full_name} by {self.patient.full_name}"
