from rest_framework import serializers
from django.db.models import Avg, Min, Max
from rest_framework.exceptions import ValidationError
from rest_flex_fields import FlexFieldsModelSerializer
from .models import (
    Establishment,
    EstablishmentImage,
    EstablishmentService,
    EstablishmentStaffInvitation,
    EstablishmentAddress,
    EstablishmentRequestStaff,
)
from doctors.models import Doctor, DoctorEstablishment
from feedbacks.serializers import FeedbackSerializer
from specializations.models import Specialization
from specializations.serializers import SpecializationSerializer

class EstablishmentAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstablishmentAddress
        fields = (
            "address_line_1",
            "address_line_2",
            "landmark",
            "city",
            "state",
            "pincode",
            "latitude",
            "longitude",
        )


# Establishment Image Seralizer
class EstablishmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstablishmentImage
        fields = ["id", "image"]


# Establishment Services Seralizer
class EstablishmentServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstablishmentService
        fields = ["id", "name"]


# Doctor Establishment Seralizer
class DoctorEstablishmentSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())

    class Meta:
        model = DoctorEstablishment
        fields = ["doctor", "establishment", "is_owner", "timings"]
        read_only_fields = ["establishment", "is_owner"]

    def validate_doctor(self, doctor):
        establishment = self.context.get("establishment")
        owner_doctors = DoctorEstablishment.objects.filter(
            establishment=establishment, is_owner=True
        ).values_list("doctor", flat=True)

        if doctor.id in owner_doctors:
            raise serializers.ValidationError(
                "You cannot add an owner doctor as a staff doctor."
            )
        return doctor


class EstablishmentSerializer(FlexFieldsModelSerializer):
    establishment_category = serializers.ChoiceField(
        choices=Establishment.EstablishmentCategory.choices
    )
    specializations = SpecializationSerializer(many=True)
    establishment_images = EstablishmentImageSerializer(many=True, read_only=True)
    establishment_services = EstablishmentServiceSerializer(many=True, read_only=True)
    address = EstablishmentAddressSerializer()
    average_establishment_rating = serializers.SerializerMethodField()
    fee_range = serializers.SerializerMethodField()
    feedbacks = serializers.SerializerMethodField()

    class Meta:
        model = Establishment
        fields = [
            "id",
            "name",
            "slug",
            "logo",
            "establishment_category",
            "tagline",
            "summary",
            "website",
            "email",
            "phone",
            "contact_person",
            "address",
            "establishment_images",
            "establishment_services",
            "owner",
            "staffs",
            "onboarded_by",
            "timings",
            "specializations",
            "average_establishment_rating",
            "fee_range",
            "feedbacks",
        ]
        read_only_fields = [
            "slug",
            "onboarded_by",
            "average_establishment_rating",
            "fee_range",
            "feedbacks",
        ]

    def get_average_establishment_rating(self, obj):
        doctor_establishments = DoctorEstablishment.objects.filter(establishment=obj)
        total_rating = 0
        num_doctors = 0
        for doctor_establishment in doctor_establishments:
            average_rating = doctor_establishment.doctor.doctor_feedbacks.aggregate(
                Avg("rating")
            )["rating__avg"]
            if average_rating:
                total_rating += average_rating
                num_doctors += 1
        average_rating_for_establishment = (
            total_rating / num_doctors if num_doctors > 0 else 0
        )
        return round(average_rating_for_establishment, 1)

    def get_fee_range(self, obj):
        fees = DoctorEstablishment.objects.filter(establishment=obj).values_list(
            "doctor__fee", flat=True
        )
        min_fee = fees.aggregate(Min("doctor__fee"))["doctor__fee__min"]
        max_fee = fees.aggregate(Max("doctor__fee"))["doctor__fee__max"]
        if min_fee == max_fee:
            return f"₹{min_fee}"
        return f"₹{min_fee} - ₹{max_fee}"
    
    def get_feedbacks(self, obj):
        doctor_establishments = DoctorEstablishment.objects.filter(establishment=obj)
        feedbacks = []
        for doctor_establishment in doctor_establishments:
            doctor_feedbacks = doctor_establishment.doctor.doctor_feedbacks.all()
            serialized_feedbacks = FeedbackSerializer(doctor_feedbacks, many=True).data
            feedbacks.extend(serialized_feedbacks)
        return feedbacks


class EstablishmentSearchSerializer(serializers.ModelSerializer):
    associated_doctors = serializers.SerializerMethodField()
    address = EstablishmentAddressSerializer()
    fee_range = serializers.SerializerMethodField()
    average_doctors_rating = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    doctor_count = serializers.SerializerMethodField()
    specializations = SpecializationSerializer(many=True)
    

    class Meta:
        model = Establishment
        fields = [
            "id",
            "type",
            "name",
            "slug",
            "logo",
            "establishment_category",
            "specializations",
            "tagline",
            "summary",
            "website",
            "email",
            "phone",
            "contact_person",
            "fee_range",
            "address",
            "timings",
            "associated_doctors",
            "average_doctors_rating",
            "doctor_count",
        ]

    def get_associated_doctors(self, obj):
        doctor_establishments = DoctorEstablishment.objects.filter(establishment=obj)
        associated_doctors = []
        from doctors.serializers import DoctorAddressSerializer
        for doctor_establishment in doctor_establishments:
            average_rating = doctor_establishment.doctor.doctor_feedbacks.aggregate(
                Avg("rating")
            )["rating__avg"]

            doctor_data = {
                "id": doctor_establishment.doctor.id,
                "full_name": doctor_establishment.doctor.full_name,
                "slug": doctor_establishment.doctor.slug,
                "bio": doctor_establishment.doctor.bio,
                "gender": doctor_establishment.doctor.gender,
                "email": doctor_establishment.doctor.user.email,
                "phone": doctor_establishment.doctor.phone,
                "avatar": (
                    self.context["request"].build_absolute_uri(
                        doctor_establishment.doctor.avatar.url
                    )
                    if doctor_establishment.doctor.avatar
                    else None
                ),
                "specializations": [
                    specialization.name
                    for specialization in doctor_establishment.doctor.specializations.all()
                ],
                "address": DoctorAddressSerializer(
                    doctor_establishment.doctor.address
                ).data,
                "experience_years": doctor_establishment.doctor.experience_years,
                "fee": doctor_establishment.doctor.fee,
                "is_verified": doctor_establishment.doctor.is_verified,
                "average_rating": round(average_rating, 1) if average_rating else 0,
                "is_owner": doctor_establishment.is_owner,
            }
            associated_doctors.append(doctor_data)
        return associated_doctors

    def get_fee_range(self, obj):
        fees = DoctorEstablishment.objects.filter(establishment=obj).values_list(
            "doctor__fee", flat=True
        )
        min_fee = fees.aggregate(Min("doctor__fee"))["doctor__fee__min"]
        max_fee = fees.aggregate(Max("doctor__fee"))["doctor__fee__max"]
        if min_fee == max_fee:
            return f"₹{min_fee}"
        return f"₹{min_fee} - ₹{max_fee}"

    def get_average_doctors_rating(self, obj):
        doctor_establishments = DoctorEstablishment.objects.filter(establishment=obj)
        total_rating = 0
        num_doctors = 0
        for doctor_establishment in doctor_establishments:
            average_rating = doctor_establishment.doctor.doctor_feedbacks.aggregate(
                Avg("rating")
            )["rating__avg"]
            if average_rating:
                total_rating += average_rating
                num_doctors += 1
        average_rating_for_establishment = (
            total_rating / num_doctors if num_doctors > 0 else 0
        )
        return round(average_rating_for_establishment, 1)

    def get_type(self, obj):
        return "establishment"

    def get_doctor_count(self, obj):
        return DoctorEstablishment.objects.filter(establishment=obj).count()


class EstablishmentCreateUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    specializations = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.all(), many=True
    )
    establishment_images = serializers.ListField(
        child=serializers.ImageField(), required=False, write_only=True
    )
    establishment_services = serializers.ListField(
        child=serializers.CharField(), required=False, write_only=True
    )
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), required=True, write_only=True
    )
    staffs = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), many=True, required=False, write_only=True
    )
    deleted_images = serializers.PrimaryKeyRelatedField(
        queryset=EstablishmentImage.objects.all(), many=True, required=False
    )
    address = EstablishmentAddressSerializer()

    class Meta:
        model = Establishment
        fields = [
            "id",
            "name",
            "slug",
            "logo",
            "establishment_category",
            "tagline",
            "summary",
            "website",
            "email",
            "phone",
            "contact_person",
            "address",
            "establishment_images",
            "establishment_services",
            "owner",
            "staffs",
            "deleted_images",
            "onboarded_by",
            "timings",
            "specializations",
        ]
        read_only_fields = ["slug", "onboarded_by"]

    def validate_owner(self, value):
        queyset = DoctorEstablishment.objects.filter(doctor=value, is_owner=True)
        if self.instance:
            queyset = queyset.exclude(establishment=self.instance)
        if queyset.exists():
            raise ValidationError(
                "This doctor is already the owner of another establishment."
            )
        return value


# Invitations Seralizers
class EstablishmentStaffInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstablishmentStaffInvitation
        fields = (
            "id",
            "doctor",
            "establishment",
            "accepted",
            "token",
            "accepted_at",
            "invited_at",
        )
        read_only_fields = ("invited_at",)


# Requested to add the doctor in Establishment
class EstablishmentRequestStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstablishmentRequestStaff
        fields = (
            "id",
            "doctor",
            "establishment",
            "is_approved",
            "approved_at",
            "requested_at",
            "is_rejected",
            "rejected_at",
        )
        read_only_fields = ("requested_at",)

