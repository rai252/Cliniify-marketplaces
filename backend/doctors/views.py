import pytz
import json

from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError

from appointments.models import Appointment

# from .filters import DoctorFilter
from doctors.filters import DoctorFilter
from .models import Doctor, DoctorEstablishment
from .serializers import (
    DoctorSerializer,
    DoctorUpdateSerializer,
    DoctorCreateSerializer,
)
from users.models import User
from .permission import (
    DoctorPermission,
    OnboardEstablishmentPermission,
)
from establishments.models import Establishment, EstablishmentRequestStaff
from establishments.serializers import EstablishmentRequestStaffSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.select_related("user").order_by("-created_at")
    permission_classes = [DoctorPermission]
    serializer_class = DoctorSerializer
    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
    )
    filterset_class = DoctorFilter
    search_fields = (
        "full_name",
        "email",
        "phone",
    )

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

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return DoctorUpdateSerializer
        if self.action == "create":
            return DoctorCreateSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        if hasattr(user, "doctor"):
            queryset = queryset.filter(user=user)
        queryset = queryset.annotate(average_rating=Avg("doctor_feedbacks__rating"))
        for doctor in queryset:
            average_rating = doctor.doctor_feedbacks.aggregate(Avg("rating"))[
                "rating__avg"
            ]
            if average_rating is not None:
                doctor.average_rating = round(average_rating, 1)
            else:
                doctor.average_rating = 0
        return queryset

    def get_authenticators(self):
        if self.action in ("list", "retrieve", "time_slots"):
            return []
        return super().get_authenticators()

    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.user.is_sale:
                self.queryset = Doctor.objects.filter(onboarded_by=request.user)
            else:
                self.queryset = self.get_queryset()
        else:
            self.queryset = self.get_queryset()

        return super().list(request, *args, **kwargs)

    
    def create(self, request, *args, **kwargs):
        if not self.request.user.is_superuser and not request.user.is_sale:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data["onboarded_by"] = (
            request.user if request.user.is_sale else None
        )
        instance = serializer.save()
        instance.slug = instance.make_slug()
        instance.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        spec_ids = list(instance.specializations.values_list("id", flat=True))
        spec_ids.sort()
        serializer = self.get_serializer(
            instance=instance,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        new_instance = serializer.save()

        new_spec_ids = list(new_instance.specializations.values_list("id", flat=True))
        new_spec_ids.sort()
        if instance.full_name != new_instance.full_name or spec_ids != new_spec_ids:
            new_instance.slug = new_instance.make_slug()
            new_instance.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def format_slot(self, slot):
        hour = slot // 100
        minute = slot % 100
        return f"{hour}:{minute:02d}"
    
    @action(methods=["GET"], detail=True)
    def time_slots(self, request, pk=None):
        try:
            doctor = self.get_object()
            requested_date_str = request.query_params.get("date", None)
            if requested_date_str:
                date = datetime.strptime(requested_date_str, "%Y-%m-%d").date()
            else:
                date = timezone.now().date()
            time_slots = {}
            doctor_establishments = DoctorEstablishment.objects.filter(doctor=doctor)
            if doctor_establishments.count() == 1:
                try:
                    doctor_establishment = doctor_establishments.first()
                    if doctor_establishment.is_owner:
                        establishment_timings = doctor_establishment.timings
                        if establishment_timings:
                            day_timings = establishment_timings.get(date.strftime("%A"), "")
                            if day_timings:
                                time_slots = self.filter_time_slots(
                                    day_timings,
                                    doctor.time_duration,
                                    "00:00",
                                    "23:59",
                                    None,
                                    doctor,
                                    date,
                                )

                        time_slots = [int(slot.replace(":", "")) for slot in time_slots]
                        morning_slots = [slot for slot in time_slots if 600 <= slot < 1200]
                        afternoon_slots = [slot for slot in time_slots if 1200 <= slot < 1500]
                        evening_slots = [slot for slot in time_slots if 1500 <= slot < 2100]

                        time_slots = {
                            "morning": [self.format_slot(slot) for slot in morning_slots],
                            "afternoon": [self.format_slot(slot) for slot in afternoon_slots],
                            "evening": [self.format_slot(slot) for slot in evening_slots],
                        }
                    else:
                        doctor_day_timings = doctor_establishment.timings.get(date.strftime("%A"), "")

                        time_slots = self.filter_time_slots(
                            doctor_day_timings,
                            doctor.time_duration,
                            "00:00",
                            "23:59",
                            None,
                            doctor,
                            date,
                        )
                        time_slots = [int(slot.replace(":", "")) for slot in time_slots]

                        morning_slots = [slot for slot in time_slots if 600 <= slot < 1200]
                        afternoon_slots = [slot for slot in time_slots if 1200 <= slot < 1500]
                        evening_slots = [slot for slot in time_slots if 1500 <= slot < 2100]

                        time_slots = {
                            "morning": [self.format_slot(slot) for slot in morning_slots],
                            "afternoon": [self.format_slot(slot) for slot in afternoon_slots],
                            "evening": [self.format_slot(slot) for slot in evening_slots],
                        }

                except Exception as e:
                    return Response(
                        {"error": "An error occurred while processing establishment timings"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                if not time_slots:
                    time_slots = {
                        "morning": [],
                        "afternoon": [],
                        "evening": [],
                    }

                return Response(time_slots, status=status.HTTP_200_OK)
            else:
                try:
                    doctor_establishment_timings = self.get_doctor_establishment_timings(doctor)
                    for establishment_id, establishment_timings in doctor_establishment_timings.items():
                        try:
                            day_timings = establishment_timings.get(date.strftime("%A"), "")
                            establishment_slots = self.filter_time_slots(
                                day_timings,
                                doctor.time_duration,
                                "00:00",
                                "23:59",
                                None,
                                doctor,
                                date,
                            )

                            establishment_slots = [int(slot.replace(":", "")) for slot in establishment_slots]
                            morning_slots = [slot for slot in establishment_slots if 600 <= slot < 1200]
                            afternoon_slots = [slot for slot in establishment_slots if 1200 <= slot < 1500]
                            evening_slots = [slot for slot in establishment_slots if 1500 <= slot < 2100]

                            time_slots[establishment_id] = {
                                "morning": [self.format_slot(slot) for slot in morning_slots],
                                "afternoon": [self.format_slot(slot) for slot in afternoon_slots],
                                "evening": [self.format_slot(slot) for slot in evening_slots],
                            }

                        except Exception as e:
                            continue

                    if not time_slots:
                        time_slots = {
                            "morning": [],
                            "afternoon": [],
                            "evening": [],
                        }

                    return Response(time_slots, status=status.HTTP_200_OK)

                except Exception as e:
                    return Response(
                        {"error": "An error occurred while retrieving doctor establishment timings"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

        except ValueError as ve:
            return Response(
                {"error": f"Invalid date format: {ve}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return
                
    def get_doctor_establishment_timings(self, doctor):
        doctor_establishments = DoctorEstablishment.objects.filter(doctor=doctor)
        timings = {}
        for doctor_establishment in doctor_establishments:
            establishment = doctor_establishment.establishment
            establishment_timings = doctor_establishment.timings
            timings[establishment.id] = establishment_timings
        return timings

    def filter_time_slots(
        self,
        timings_list,
        time_duration_str,
        time_range_start,
        time_range_end,
        current_time_formatted,
        doctor,
        date,
    ):


        time_duration = self.parse_time_duration(time_duration_str)

        time_slots = []

        booked_appointments = Appointment.objects.filter(
            doctor=doctor,
            date=date,
            start_time__gte=time_range_start,
            end_time__lte=time_range_end,
        ).values_list("start_time", flat=True)

        booked_time_slots = list(set())
        for appointment in booked_appointments:
            start_time = appointment.strftime("%H:%M")
            booked_time_slots.append(start_time)

        for slot in timings_list:
            start_time = datetime.strptime(slot.get("start_time", ""), "%H:%M")
            end_time = datetime.strptime(slot.get("end_time", ""), "%H:%M")

            current_time = max(start_time, datetime.strptime(time_range_start, "%H:%M"))
            end_time = min(end_time, datetime.strptime(time_range_end, "%H:%M"))

            while current_time < end_time:
                time_slots.append(current_time.strftime("%H:%M"))
                current_time += time_duration


        if current_time_formatted is not None:
            time_slots_current_day = []
            for time in time_slots:
                if current_time_formatted < time:
                    if time not in booked_time_slots:
                        time_slots_current_day.append(time)
            return time_slots_current_day

        time_slots_ = []
        for time in time_slots:
            if time not in booked_time_slots:
                time_slots_.append(time)

        return time_slots_
    

    def parse_time_duration(self, time_duration_str):
        try:
            if not time_duration_str:
                return None

            hours, minutes = map(int, time_duration_str.split(":"))
            return timedelta(hours=hours, minutes=minutes)
        except (ValueError, AttributeError) as e:
            return timedelta()

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
                "total_doctor_count": total_users_count,
                "change_type": change_type,
                "increment_or_decrement_users": abs(increment_or_decrement_users),
                "percentage_users": percentage_users,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["GET"])
    def profile_completion(self, request, pk=None):
        doctor = self.get_object()
        total_fields = sum(
            1
            for field in Doctor._meta.fields
            if field.name not in ["id", "created_at", "updated_at", "deleting_reason"]
        )
        filled_fields = doctor.count_filled_fields(
            exclude=["id", "created_at", "updated_at", "deleting_reason", "deleted_at"]
        )
        completion_percentage = min(int((filled_fields / total_fields) * 100), 100)

        return Response(
            {"profile_completion_percentage": completion_percentage},
            status=status.HTTP_200_OK,
        )

    @action(methods=["GET"], detail=False)
    def sale_list_doctor(self, request, *args, **kwargs):
        sale_user_id = request.query_params.get("sale_user_id")

        if request.user.is_authenticated:
            if request.user.is_sale or request.user.is_superuser:
                if sale_user_id:
                    try:
                        sale_user = User.objects.get(id=sale_user_id, is_sale=True)
                        queryset = Doctor.objects.filter(onboarded_by=sale_user)
                    except User.DoesNotExist:
                        return Response(
                            {"detail": "Invalid sale user ID."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    queryset = Doctor.objects.filter(onboarded_by=request.user)

                page = self.paginate_queryset(queryset)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)
            else:
                return Response(
                    {"detail": "You are not authorized to access this resource."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            return Response(
                {"detail": "You are not authorized to access this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

    @action(methods=["GET"], detail=False, url_path="associated-establishment")
    def establishment(self, request):
        doctor = None
        if request.user.is_superuser:
            doctor = Doctor.objects.filter(
                pk=request.query_params.get("doctor_id")
            ).first()

        doctor_establishments = None
        if doctor:
            doctor_establishments = self.queryset.filter(doctor=doctor)

        serializer = self.serializer_class(doctor_establishments, many=True)

        return Response(serializer.data)

    @action(methods=["PATCH"], detail=False, url_path="timings")
    def timings_update(self, request):
        doctor = request.user.doctor
        doctor_establishment = get_object_or_404(DoctorEstablishment, doctor=doctor)

        serializer = self.get_serializer(
            doctor_establishment, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OnboradEstablishmentrequestViewSet(viewsets.GenericViewSet):
    permission_classes = [OnboardEstablishmentPermission]

    def get_doctor(self, request):
        try:
            return Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            raise ValidationError("Doctor not found for the current user.")

    @action(methods=["GET"], detail=False, url_path="search-establishment")
    def search_establishment(self, request, *args, **kwargs):
        try:
            name = request.query_params.get("name", None)
            city = request.query_params.get("city", None)

            if not name and not city:
                return Response(
                    {"error": "Please provide either name or city for search"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Search establishments
            establishments = Establishment.objects.all()
            if name:
                establishments = establishments.filter(name__icontains=name)
            if city:
                establishments = establishments.filter(address__city__icontains=city)

            if not establishments.exists():
                return Response(
                    {"message": "No establishments found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Format establishment suggestions
            suggestions = []
            for establishment in establishments:
                doctor_establishment = DoctorEstablishment.objects.filter(
                    establishment=establishment, is_owner=True
                ).first()
                suggestions.append(
                    {
                        "id": establishment.id,
                        "name": establishment.name,
                        "city": establishment.address.city,
                        "owner": doctor_establishment.doctor.full_name,
                    }
                )

            return Response(
                {"message": "Establishments found", "suggestions": suggestions},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(methods=["POST"], detail=False, url_path="send-request")
    def send_request(self, request, *args, **kwargs):
        try:
            establishment_id = request.data.get("establishment_id")
            if not establishment_id:
                return Response(
                    {"error": "Please provide establishment_id"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                establishment = Establishment.objects.get(id=establishment_id)
            except Establishment.DoesNotExist:
                return Response(
                    {"error": "Establishment not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            doctor = self.get_doctor(request)

            # Check if doctor is already associated as owner
            if DoctorEstablishment.objects.filter(
                doctor=doctor, establishment=establishment, is_owner=True
            ).exists():
                return Response(
                    {
                        "message": "Doctor is already associated as owner with this establishment"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if request is already sent
            if EstablishmentRequestStaff.objects.filter(
                doctor=doctor,
                establishment=establishment,
                is_approved=False,
                is_rejected=False,
            ).exists():
                return Response(
                    {"message": "Request already sent to this establishment owner"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Find the owner of the establishment
            owner = DoctorEstablishment.objects.filter(
                establishment=establishment, is_owner=True
            ).first()

            if not owner:
                return Response(
                    {"message": "No owner found for this establishment"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Create the request
            EstablishmentRequestStaff.objects.create(
                establishment=establishment,
                doctor=doctor,
                is_approved=False,
                is_rejected=False,
            )

            return Response(
                {"message": "Request sent to establishment owner"},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(methods=["GET"], detail=False, url_path="get-request")
    def get_requests(self, request, *args, **kwargs):
        try:
            doctor = self.get_doctor(request)
            doctor_establishmennt = DoctorEstablishment.objects.filter(
                doctor=doctor, is_owner=True
            ).first()
            establishment_requests = EstablishmentRequestStaff.objects.filter(
                establishment=doctor_establishmennt.establishment,
                is_approved=False,
                is_rejected=False,
            )
            serializer = EstablishmentRequestStaffSerializer(
                establishment_requests, many=True
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(methods=["PATCH"], detail=False, url_path="accept-request")
    def accept_request(self, request):
        try:
            doctor = self.get_doctor(request)
            doctor_establishment = DoctorEstablishment.objects.filter(
                doctor=doctor, is_owner=True
            ).first()
            establishment_request_id = request.query_params.get(
                "establishment_request_id"
            )

            if doctor_establishment:
                establishment_request = EstablishmentRequestStaff.objects.get(
                    pk=establishment_request_id,
                    establishment=doctor_establishment.establishment,
                )

                establishment_request.is_approved = True
                establishment_request.approved_at = timezone.now()
                establishment_request.save()

                serializer = EstablishmentRequestStaffSerializer(establishment_request)

                doctor_establishment = DoctorEstablishment.objects.create(
                    doctor=establishment_request.doctor,
                    establishment=establishment_request.establishment,
                )

                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "You are not an owner of any establishment."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        except EstablishmentRequestStaff.DoesNotExist:
            return Response(
                {"error": "Establishment request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(methods=["PATCH"], detail=False, url_path="reject-request")
    def reject_request(self, request):
        try:
            doctor = self.get_doctor(request)
            doctor_establishment = DoctorEstablishment.objects.filter(
                doctor=doctor, is_owner=True
            ).first()
            establishment_request_id = request.query_params.get(
                "establishment_request_id"
            )
            if doctor_establishment:
                establishment_request = EstablishmentRequestStaff.objects.get(
                    pk=establishment_request_id,
                    establishment=doctor_establishment.establishment,
                )
                establishment_request.is_rejected = True
                establishment_request.rejected_at = timezone.now()
                establishment_request.save()
                serializer = EstablishmentRequestStaffSerializer(establishment_request)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "You are not an owner of any establishment."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        except EstablishmentRequestStaff.DoesNotExist:
            return Response(
                {"error": "Establishment request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
