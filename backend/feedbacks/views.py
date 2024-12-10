from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Avg
from rest_framework import exceptions
from django.utils import timezone
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Feedback
from .serializers import FeedbackSerializer
from .permissions import CanAddFeedbackOnlyWithAppointment


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.select_related("doctor", "patient").all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('doctor', 'patient',)

    def initialize_request(self, request, *args, **kwargs):
        self.action = self.action_map.get(request.method.lower())
        return super().initialize_request(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "doctor"):
            return Feedback.objects.filter(doctor=user.doctor.id)
        # elif hasattr(user, 'patient'):
        #     return Feedback.objects.filter(patient=user.patient.id)
        return super().get_queryset()

    def get_permissions(self):
        if self.action in ("list", "retrieve", "ratings"):
            return []
        if self.action == "ratings":
            return []
        elif self.action == "create":
            return [CanAddFeedbackOnlyWithAppointment()]
        return super().get_permissions()

    def get_authenticators(self):
        if self.action in ("list", "retrieve", "ratings"):
            return []
        return super().get_authenticators()

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(patient=user.patient)

    def perform_update(self, serializer):
        reply = serializer.validated_data.get("reply", None)
        if reply:
            serializer.save(replied_at=timezone.now())
        else:
            serializer.save()

    @action(detail=True, methods=["GET"])
    def ratings(self, request, pk=None):
        doctor_ratings = Feedback.objects.filter(doctor=pk).values_list(
            "rating", flat=True
        )
        average_rating = Feedback.objects.filter(doctor=pk).aggregate(
            avg_rating=Avg("rating")
        )["avg_rating"]

        return Response(
            {
                "doctor_id": pk,
                "ratings": list(doctor_ratings),
                "average_rating": average_rating,
            }
        )
