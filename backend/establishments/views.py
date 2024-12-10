import jwt

from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import action
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend


from .models import (
    Establishment,
    EstablishmentImage,
    EstablishmentService,
    EstablishmentStaffInvitation,
    EstablishmentAddress,
)
from .serializers import (
    EstablishmentCreateUpdateSerializer,
    EstablishmentSerializer,
    EstablishmentStaffInvitationSerializer,
)
from .permissions import EstablishmentPermission
from users.models import User
from doctors.models import DoctorEstablishment, Doctor
from doctors.serializers import DoctorSerializer
from .invite import _send_establishment_staff_invitation
from specializations.models import Specialization


class EstablishmentViewSet(viewsets.ModelViewSet):
    queryset = Establishment.objects.order_by("-created_at")
    serializer_class = EstablishmentSerializer
    permission_classes = [EstablishmentPermission]
    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
    )
    search_fields = (
        "name",
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

    def get_authenticators(self):
        if self.action in ("list", "retrieve"):
            return []
        return super().get_authenticators()

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return EstablishmentCreateUpdateSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.user.is_sale:
                self.queryset = Establishment.objects.filter(onboarded_by=request.user)
            else:
                self.queryset = self.get_queryset()
        else:
            self.queryset = self.get_queryset()

        return super().list(request, *args, **kwargs)

    @action(methods=["GET"], detail=False)
    def sale_list_establishment(self, request, *args, **kwargs):
        sale_user_id = request.query_params.get("sale_user_id")

        if request.user.is_authenticated:
            if request.user.is_sale or request.user.is_superuser:
                if sale_user_id:
                    try:
                        sale_user = User.objects.get(id=sale_user_id, is_sale=True)
                        queryset = Establishment.objects.filter(onboarded_by=sale_user)
                    except User.DoesNotExist:
                        return Response(
                            {"detail": "Invalid sale user ID."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    queryset = Establishment.objects.filter(onboarded_by=request.user)

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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = EstablishmentCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if request.user.is_sale:
            serializer.validated_data["onboarded_by"] = request.user
        else:
            serializer.validated_data["onboarded_by"] = None

        establishment_images = serializer.validated_data.pop("establishment_images", [])
        establishment_services = serializer.validated_data.pop(
            "establishment_services", []
        )
        owner = serializer.validated_data.pop("owner", None)
        staffs = serializer.validated_data.pop("staffs", [])
        specialities = serializer.validated_data.pop("specializations", [])

        if serializer.validated_data.get("deleted_images", None):
            del serializer.validated_data["deleted_images"]
        address_data = serializer.validated_data.pop("address")
        serializer.validated_data.pop("deleted_images")

        address = EstablishmentAddress.objects.create(**address_data)
        establishment = Establishment.objects.create(
            **serializer.validated_data, address=address
        )

        for specialization in specialities:
            specialization_d = Specialization.objects.get(id=specialization.id)
            establishment.specializations.add(specialization_d)

        for image in establishment_images:
            EstablishmentImage.objects.create(establishment=establishment, image=image)

        for service in establishment_services:
            EstablishmentService.objects.create(
                establishment=establishment, name=service
            )

        # Add owner directly to DoctorEstablishment
        if owner is not None:
            DoctorEstablishment.objects.create(
                doctor=owner, establishment=establishment, is_owner=True
            )

        # Create invitations for staff doctors
        for staff_doctor in staffs:
            token = jwt.encode(
                {
                    "doctor_id": staff_doctor.id,
                    "timestamp": timezone.now().timestamp(),
                },
                settings.SECRET_KEY,
                algorithm="HS256",
            )
            EstablishmentStaffInvitation.objects.create(
                doctor=staff_doctor, establishment=establishment, token=token
            )
            _send_establishment_staff_invitation(
                staff_doctor,
                token,
                establishment,
            )
        data = EstablishmentSerializer(
            establishment, context={"request": self.request}
        ).data
        return Response(data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = EstablishmentCreateUpdateSerializer(
            instance, request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        establishment_images = serializer.validated_data.pop("establishment_images", [])
        deleted_images = serializer.validated_data.pop("deleted_images", [])
        establishment_services = serializer.validated_data.pop(
            "establishment_services", []
        )
        owner = serializer.validated_data.pop("owner", None)
        staffs = serializer.validated_data.pop("staffs", [])
        specializations = serializer.validated_data.pop("specializations", [])

        address_data = (
            serializer.validated_data.pop("address")
            if "address" in serializer.validated_data
            else None
        )

        if specializations:
            instance.specializations.set(specializations)

        serializer.save()

        if address_data:
            if instance.address:
                for key, value in address_data.items():
                    setattr(instance.address, key, value)
                instance.address.save()
            else:
                instance.address = EstablishmentAddress.objects.create(**address_data)
                instance.save()

        for img in deleted_images:
            img.delete()
        for image in establishment_images:
            EstablishmentImage.objects.create(establishment=instance, image=image)

        if establishment_services:
            instance.establishment_services.all().delete()
            for service in establishment_services:
                EstablishmentService.objects.create(
                    establishment=instance, name=service
                )

        if owner:
            doc_estab = DoctorEstablishment.objects.filter(
                doctor=owner, establishment=instance
            ).first()
            if doc_estab:
                if not doc_estab.is_owner:
                    DoctorEstablishment.objects.filter(
                        establishment=instance, is_owner=True
                    ).delete()
                    doc_estab.is_owner = True
                    doc_estab.save()
            else:
                DoctorEstablishment.objects.filter(
                    establishment=instance, is_owner=True
                ).delete()
                DoctorEstablishment.objects.create(
                    establishment=instance, doctor=owner, is_owner=True
                )

        if staffs:
            DoctorEstablishment.objects.filter(
                establishment=instance, is_owner=False
            ).exclude(doctor__in=staffs).delete()
            for doctor in staffs:
                exists = DoctorEstablishment.objects.filter(
                    doctor=doctor, establishment=instance
                ).exists()
                if exists:
                    continue

                token = jwt.encode(
                    {"doctor_id": doctor.id, "timestamp": timezone.now().timestamp()},
                    settings.SECRET_KEY,
                    algorithm="HS256",
                )
                EstablishmentStaffInvitation.objects.create(
                    doctor=doctor, establishment=instance, token=token
                )
                _send_establishment_staff_invitation(doctor, token, instance)

        data = EstablishmentSerializer(instance, context={"request": self.request}).data
        return Response(data)

    def perform_destroy(self, instance):
        doctor_establisment = DoctorEstablishment.objects.filter(establishment=instance)
        doctor_establisment.delete()

        return super().perform_destroy(instance)

    @action(methods=["GET"], detail=False)
    def available_staff_doctors(self, request, *kwargs):
        establishment_id = request.query_params.get("establishment_id", None)
        if establishment_id:
            establishment = Establishment.objects.get(id=establishment_id)
            existing_doctors = DoctorEstablishment.objects.filter(
                establishment=establishment, is_owner=False
            ).values_list("doctor__id", flat=True)
            existing_doctor_objs = Doctor.objects.filter(
                id__in=existing_doctors, is_verified=True
            )
            owner_id = establishment.owner
            available_doctor_objs = (
                Doctor.objects.filter(is_verified=True)
                .exclude(
                    id__in=existing_doctors,
                )
                .exclude(id=owner_id)
            )
            existing_serializer = DoctorSerializer(
                existing_doctor_objs, many=True, context={"request": request}
            )
            available_serializer = DoctorSerializer(
                available_doctor_objs, many=True, context={"request": request}
            )
            response_data = {
                "existing_doctors": existing_serializer.data,
                "available_doctors": available_serializer.data,
            }
        else:
            all_doctor_objs = Doctor.objects.filter(is_verified=True)
            serializer = DoctorSerializer(
                all_doctor_objs, many=True, context={"request": request}
            )
            response_data = {"all_doctors": serializer.data}

        return Response(response_data)

    @action(methods=["GET"], detail=False)
    def available_owner_doctors(self, request, *args, **kwargs):
        establishment_id = request.query_params.get("establishment_id", None)
        if establishment_id:
            establishment = Establishment.objects.get(id=establishment_id)
            existing_owners = DoctorEstablishment.objects.filter(
                establishment=establishment, is_owner=True
            ).values_list("doctor__id", flat=True)
            existing_owner_objs = Doctor.objects.filter(
                id__in=existing_owners, is_verified=True
            )
            available_doctor_objs = Doctor.objects.filter(is_verified=True).exclude(
                id__in=existing_owners
            )
            existing_serializer = DoctorSerializer(
                existing_owner_objs, many=True, context={"request": request}
            )
            available_serializer = DoctorSerializer(
                available_doctor_objs, many=True, context={"request": request}
            )
            response_data = {
                "existing_doctors": existing_serializer.data,
                "available_doctors": available_serializer.data,
            }
        else:
            existing_owner = DoctorEstablishment.objects.filter(
                is_owner=True
            ).values_list("doctor__id", flat=True)
            existing_owner_objs = Doctor.objects.filter(
                id__in=existing_owner, is_verified=True
            )
            available_doctor_objs = Doctor.objects.filter(is_verified=True).exclude(
                id__in=existing_owner
            )
            existing_serializer = DoctorSerializer(
                existing_owner_objs, many=True, context={"request": request}
            )
            available_serializer = DoctorSerializer(
                available_doctor_objs, many=True, context={"request": request}
            )
            response_data = {
                "existing_doctors": existing_serializer.data,
                "available_doctors": available_serializer.data,
            }

        return Response(response_data)


class EstablishmentStaffInvitationViewSet(viewsets.GenericViewSet):
    queryset = EstablishmentStaffInvitation.objects.all()
    serializer_class = EstablishmentStaffInvitationSerializer

    def initialize_request(self, request, *args, **kwargs):
        self.action = self.action_map.get(request.method.lower())
        return super().initialize_request(request, *args, **kwargs)

    def get_authenticators(self):
        if self.action == "invitation":
            return []
        return super().get_authenticators()

    @action(methods=["GET"], detail=False)
    def invitation(self, request, *args, **kwargs):
        token = request.query_params.get("token")
        if not token:
            return Response(
                {"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            invitation = EstablishmentStaffInvitation.objects.get(token=token)
        except EstablishmentStaffInvitation.DoesNotExist:
            return Response(
                {"error": "Invalid token."}, status=status.HTTP_404_NOT_FOUND
            )

        invitation_age = timezone.now() - invitation.created_at
        invitation_expired = invitation_age > timedelta(minutes=2)

        if invitation_expired:
            html_content = render_to_string(
                "establishments/invitation/expired_invitation.html",
                {
                    "invitation": invitation,
                },
            )
            return HttpResponse(html_content)

        doctor_establishment = DoctorEstablishment.objects.filter(
            doctor=invitation.doctor, establishment=invitation.establishment
        ).first()

        if doctor_establishment:
            error_message = "The doctor is already associated with this establishment."
            return Response(
                {"error": error_message}, status=status.HTTP_400_BAD_REQUEST
            )

        invitation.accepted = True
        invitation.accepted_at = timezone.now()
        invitation.save()

        doctor_establishment = DoctorEstablishment.objects.create(
            doctor=invitation.doctor, establishment=invitation.establishment
        )

        html_content = render_to_string(
            "establishments/invitation/successful_invitation.html",
            {
                "invitation": invitation,
                "doctor_establishment": doctor_establishment,
            },
        )

        return HttpResponse(html_content)
