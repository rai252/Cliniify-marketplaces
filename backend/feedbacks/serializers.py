from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers

from patients.serializers import PatientSerializer
from .models import Feedback


class FeedbackSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Feedback
        fields = (
            "id",
            "doctor",
            "patient",
            "rating",
            "comment",
            "comment_at",
            "reply",
            "replied_at",
        )
        expandable_fields = {
            "doctor": "doctors.DoctorSerializer",
            "patient": PatientSerializer,
        }
