from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, timedelta
from django_filters.rest_framework import DjangoFilterBackend


from .models import Appointment
from .serializers import (
    AppointmentSerializer,
)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().select_related("doctor", "patient")
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('doctor', 'patient',)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "doctor"):
            return Appointment.objects.filter(doctor=user.doctor)
        elif hasattr(user, "patient"):
            return Appointment.objects.filter(patient=user.patient)
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user.patient)

    @action(methods=["GET"], detail=False, url_path="total_count")
    def total_count(self, request):
        current_date = datetime.now()
        one_month_ago = current_date - timedelta(days=30)
        total_users_count = self.queryset.count()
        last_month_users_count = self.queryset.filter(
            created_at__gte=one_month_ago
        ).count()
        increment_or_decrement_users = total_users_count - last_month_users_count
        percentage_users = (
            (increment_or_decrement_users / last_month_users_count) * 100
            if last_month_users_count > 0
            else 0
        )
        change_type = "increment" if increment_or_decrement_users > 0 else "decrement"
        return Response(
            {
                "total_appointment_count": total_users_count,
                "change_type": change_type,
                "increment_or_decrement_users": abs(increment_or_decrement_users),
                "percentage_users": percentage_users,
            },
            status=status.HTTP_200_OK,
        )
    
