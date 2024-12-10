from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from django.db import transaction
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta

from .models import Patient
from .serializers import (
    PatientSerializer,
    PatientUpdateSerializer,
    PatientCreateSerializer,
)
from .permissions import PatientPermissions


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.select_related("user").all()
    serializer_class = PatientSerializer
    permission_classes = [PatientPermissions]
    filter_backends = (filters.SearchFilter,)
    search_fields = ("full_name", "email", "phone")

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get(self.lookup_field)
        if not str(lookup_value).isnumeric():
            obj = get_object_or_404(queryset, slug=lookup_value)
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()

    def initialize_request(self, request, *args, **kwargs):
        self.action = self.action_map.get(request.method.lower())
        return super().initialize_request(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "doctor"):
            return super().get_queryset().filter(user=user)
        return super().get_queryset()

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ("update", "partial_update"):
            return PatientUpdateSerializer
        if self.action == "create":
            return PatientCreateSerializer
        return super().get_serializer_class(*args, **kwargs)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        patient = self.get_object()
        serializer = self.get_serializer(
            instance=patient, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        email = serializer.validated_data.get("email")
        user = patient.user
        user.email = email or user.email
        user.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if self.request.user.is_superuser:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"detail": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        deleting_reason = request.query_params.get("deleting_reason")
        self.perform_destroy(instance, deleting_reason)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance, deleting_reason):
        user = instance.user
        instance.deleting_reason = deleting_reason
        instance.save()

        instance.delete()

        if user:
            user.delete()

    @action(methods=["GET"], detail=False, url_path="total_count")
    def total_count(self, request):
        current_date = datetime.now()
        one_month_ago = current_date - timedelta(days=30)
        total_patients_count = self.queryset.count()
        last_month_patients_count = self.queryset.filter(
            created_at__gte=one_month_ago, created_at__lt=current_date
        ).count()
        change_from_last_month = total_patients_count - last_month_patients_count
        change_type = "increment" if change_from_last_month > 0 else "decrement"
        percentage_change = (
            (change_from_last_month / last_month_patients_count) * 100
            if last_month_patients_count > 0
            else 0
        )
        return Response(
            {
                "total_patients_count": total_patients_count,
                "change_type": change_type,
                "change_from_last_month": abs(change_from_last_month),
                "percentage_change": percentage_change,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["GET"])
    def profile_completion(self, request, pk=None):
        patient = self.get_object()
        total_fields = sum(
            1
            for field in Patient._meta.fields
            if field.name not in ["id", "created_at", "updated_at", "deleting_reason"]
        )
        filled_fields = patient.count_filled_fields(exclude=["deleting_reason"])
        completion_percentage = min(int((filled_fields / total_fields) * 100), 100)

        return Response(
            {"profile_completion_percentage": completion_percentage},
            status=status.HTTP_200_OK,
        )
