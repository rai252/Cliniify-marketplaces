import json

from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer
from django.utils import timezone
from django.db import transaction
from django.db.models import Avg

from .models import Doctor, DoctorAddress, DoctorEstablishment, DoctorImages
from users.serializers import UserSerializer
from users.models import User
from specializations.serializers import SpecializationSerializer
from specializations.models import Specialization
from establishments.serializers import EstablishmentAddressSerializer
from establishments.models import Establishment


class DoctorAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAddress
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

class DoctorImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorImages
        fields = ("id", "image")

class DoctorUpdateSerializer(serializers.ModelSerializer):
    specializations = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.all(), many=True
    )
    address = DoctorAddressSerializer()
    images = serializers.ListField(
        child=serializers.ImageField(), required=False, write_only=True
    )
    relations = serializers.ListField(
        child=serializers.JSONField(), required=False, write_only=True
    )
    deleted_images = serializers.PrimaryKeyRelatedField(
        queryset=DoctorImages.objects.all(), many=True, required=False
    )
    user__is_active=serializers.BooleanField(required=False)

    class Meta:
        model = Doctor
        fields = (
            "id",
            "full_name",
            "slug",
            "phone",
            "alternative_number",
            "clinic_no",
            "email",
            "avatar",
            "gender",
            "specializations",
            "bio",
            "reg_no",
            "reg_council",
            "reg_year",
            "degree",
            "institute_name",
            "completion_year",
            "experience_years",
            "own_establishment",
            "identity_proof",
            "medical_reg_proof",
            "establishment_proof",
            "address",
            "fee",
            "timings",
            "time_duration",
            "onboarding_steps",
            "auto_confirm",
            "is_verified",
            "deleting_reason",
            "onboarded_by",
            "website",
            "images",
            "deleted_images",
            "relations",
            "user__is_active",
        )

    def validate(self, attrs):
        instance = self.instance
        reg_no = attrs.get("reg_no")
        reg_year = attrs.get("reg_year")
        exp_year = attrs.get("experience_years") or instance.experience_years
        completion_year = attrs.get("completion_year") or instance.completion_year

        if (
            reg_no
            and Doctor.objects.filter(reg_no=reg_no).exclude(id=instance.id).exists()
        ):
            raise serializers.ValidationError(
                {"reg_no": "This registration number is already in exist."}
            )

        if reg_year and completion_year and reg_year < completion_year:
            raise serializers.ValidationError(
                {"reg_year": "Registration year cannot be less than completion year."}
            )

        if (
            exp_year
            and completion_year
            and exp_year > (timezone.now().year - completion_year)
        ):
            raise serializers.ValidationError(
                {
                    "experience_years": "The value provided for experience years does not seem accurate, as your level of experience appears to surpass the degree completion year."
                }
            )

        email = attrs.get("email")
        phone = attrs.get("phone")
        if instance:
            if (
                email
                and User.objects.filter(email=email)
                .exclude(id=instance.user.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"email": "This email is already in use."}
                )
            if (
                phone
                and Doctor.objects.filter(phone=phone).exclude(id=instance.id).exists()
            ):
                raise serializers.ValidationError(
                    {"phone": "This phone number is already in use."}
                )
        else:
            if email and User.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    {"email": "This email is already in use."}
                )

            if phone and Doctor.objects.filter(phone=phone).exists():
                raise serializers.ValidationError(
                    {"phone": "This phone number is already in use."}
                )
        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        specializations = validated_data.pop("specializations", [])
        address_data = (
            validated_data.pop("address") if "address" in validated_data else None
        )
        doctor_images = validated_data.pop("images", [])
        relations_data = validated_data.pop("relations", [])
        deleted_images = validated_data.pop("deleted_images", [])

        instance = super().update(instance, validated_data)
        if address_data:
            if instance.address:
                for key, value in address_data.items():
                    setattr(instance.address, key, value)
                instance.address.save()
            else:
                instance.address = DoctorAddress.objects.create(**address_data)
                instance.save()
        for img in deleted_images:
            img.delete()
        for image in doctor_images:
            DoctorImages.objects.create(doctor=instance, image=image)
        if specializations:
            instance.specializations.set(specializations)
        existing_relations = DoctorEstablishment.objects.filter(doctor=instance)
        existing_relation_ids = [rel.establishment.id for rel in existing_relations]

        for relation in relations_data: 
            try:
                relation_data = json.loads(relation)
                for rel in relation_data:
                    establishment_id = int(rel["establishment"])
                    timings = rel["timings"]

                    if establishment_id in existing_relation_ids:
                        doctor_establishment = existing_relations.get(establishment__id=establishment_id)
                        doctor_establishment.timings = timings
                        doctor_establishment.save()
                    else:
                        establishment = Establishment.objects.get(id=establishment_id)
                        DoctorEstablishment.objects.create(
                            doctor=instance,
                            establishment=establishment,
                            timings=timings,
                        )


            except KeyError as e:
                print(f"KeyError: Missing key in relation: {relation}. Error: {e}")
            except ValueError as e:
                print(f"ValueError: Invalid value for establishment_id: {relation.get('establishment')}. Error: {e}")
            except Establishment.DoesNotExist as e:
                print(f"Establishment.DoesNotExist: No establishment found with id: {relation.get('establishment')}. Error: {e}")
            except Exception as e:
                print(f"Exception: {e}")

        user_is_active = validated_data.pop('user__is_active', None)
        if user_is_active is not None:
            instance.user.is_active = user_is_active
            instance.user.save()

        return instance

class DoctorSerializer(FlexFieldsModelSerializer):
    specializations = SpecializationSerializer(many=True)
    average_rating = serializers.DecimalField(
        max_digits=5, decimal_places=2, read_only=True
    )
    images = serializers.SerializerMethodField()
    associated_establishment = serializers.SerializerMethodField()
    relations = serializers.SerializerMethodField()
    # user__is_active=serializers.BooleanField()

    class Meta:
        model = Doctor
        fields = (
            "id",
            "user",
            "full_name",
            "slug",
            "phone",
            "alternative_number",
            "clinic_no",
            "avatar",
            "gender",
            "email",
            "specializations",
            "bio",
            "reg_no",
            "reg_council",
            "reg_year",
            "degree",
            "institute_name",
            "completion_year",
            "experience_years",
            "own_establishment",
            "identity_proof",
            "medical_reg_proof",
            "establishment_proof",
            "address",
            "fee",
            "timings",
            "time_duration",
            "onboarding_steps",
            "auto_confirm",
            "is_verified",
            "average_rating",
            "deleting_reason",
            "onboarded_by",
            "owned_establishment",
            "website",
            "images",
            "associated_establishment",
            "relations",
        )
        expandable_fields = {"user": UserSerializer, "address": DoctorAddressSerializer}
    
    def get_images(self, obj):
        request = self.context.get('request')
        images = DoctorImages.objects.filter(doctor=obj)
        return DoctorImagesSerializer(images, many=True, context={'request': request}).data
    
    def get_associated_establishment(self, obj):
        doctor_establishments = DoctorEstablishment.objects.filter(doctor=obj)
        associated_establishment = []
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

        for doctor_establishment in doctor_establishments:
            establishment_data = {
                "id": doctor_establishment.establishment.id,
                "name": doctor_establishment.establishment.name,
                "slug": doctor_establishment.establishment.slug,
                "email": doctor_establishment.establishment.email,
                "phone": doctor_establishment.establishment.phone,
                "summary": doctor_establishment.establishment.summary,
                "tagline": doctor_establishment.establishment.tagline,
                "website": doctor_establishment.establishment.website,
                "logo": (
                    self.context["request"].build_absolute_uri(
                        doctor_establishment.establishment.logo.url
                    )
                    if doctor_establishment.establishment.logo
                    else None
                ),
                "specializations": [
                    specialization.name
                    for specialization in doctor_establishment.establishment.specializations.all()
                ],
                "address": EstablishmentAddressSerializer(
                    doctor_establishment.establishment.address
                ).data,
                "average_rating": round(average_rating_for_establishment, 1) if average_rating_for_establishment else 0,
                "is_owner": doctor_establishment.is_owner,
                "timings": doctor_establishment.establishment.timings,
            }
            associated_establishment.append(establishment_data)
        return associated_establishment
        
    def get_relations(self, obj):
        doctor_establishments = DoctorEstablishment.objects.filter(doctor=obj)
        relations = []
        for doctor_establishment in doctor_establishments:
            relation_data = {
                "doctor_id": doctor_establishment.doctor.id,
                "establishment_id": doctor_establishment.establishment.id,
                "timings":doctor_establishment.establishment.timings if doctor_establishment.timings is None and doctor_establishment.is_owner else doctor_establishment.timings,
            }
            relations.append(relation_data)
        return relations

class DoctorCreateSerializer(serializers.ModelSerializer):
    specializations = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.all(),
        many=True,
        required=False,
        allow_null=True,
    )
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    address = DoctorAddressSerializer(required=False)
    images = serializers.ListField(
        child=serializers.ImageField(), required=False, write_only=True
    )
    relations = serializers.ListField(
        child=serializers.DictField(), required=False, write_only=True
    )

    class Meta:
        model = Doctor
        fields = [
            "id",
            "full_name",
            "phone",
            "alternative_number",
            "clinic_no",
            "avatar",
            "gender",
            "email",
            "password",
            "specializations",
            "bio",
            "reg_no",
            "reg_council",
            "reg_year",
            "degree",
            "institute_name",
            "completion_year",
            "experience_years",
            "own_establishment",
            "identity_proof",
            "medical_reg_proof",
            "establishment_proof",
            "address",
            "fee",
            "timings",
            "time_duration",
            "auto_confirm",
            "is_verified",
            "deleting_reason",
            "onboarded_by",
            "website",
            "images",
            "relations"
        ]
        read_only_fields = ["user", "id"]

    def validate(self, attrs):
        reg_no = attrs.get("reg_no")
        reg_year = attrs.get("reg_year")
        exp_year = attrs.get("experience_years") or 0
        completion_year = attrs.get("completion_year") or 0

        if reg_no and Doctor.objects.filter(reg_no=reg_no).exists():
            raise serializers.ValidationError(
                {"reg_no": "This registration number is already in use."}
            )

        if reg_year and completion_year and reg_year < completion_year:
            raise serializers.ValidationError(
                {"reg_year": "Registration year cannot be less than completion year."}
            )

        email = attrs.get("email")
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": "This email is already in use."}
            )
        phone = attrs.get("phone")
        if phone and Doctor.objects.filter(phone=phone).exists():
            raise serializers.ValidationError(
                {"phone": "This phone number is already in use."}
            )

        if (
            exp_year
            and completion_year
            and exp_year > (timezone.now().year - completion_year)
        ):
            raise serializers.ValidationError(
                {
                    "experience_years": "The value provided for experience years does not seem accurate, as your level of experience appears to surpass the degree completion year."
                }
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        specializations_data = validated_data.pop("specializations", [])
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        doctor_images = validated_data.pop("images", [])
        relations_data = validated_data.pop("relations", [])  # Added this line

        address_data = (
            validated_data.pop("address") if "address" in validated_data else None
        )
        user = User.objects.create_user(email=email, password=password, is_active=True)
        if address_data:
            address = DoctorAddress.objects.create(**address_data)
            validated_data["address"] = address
        doctor = Doctor.objects.create(user=user, email=email, **validated_data)

        if doctor_images:
            for image in doctor_images:
                DoctorImages.objects.create(doctor=doctor, image=image)

        for specialization in specializations_data:
            specialization_ = Specialization.objects.get(id=specialization.id)
            doctor.specializations.add(specialization_)

        for relation in relations_data:
            establishment = Establishment.objects.get(id=relation["establishment_id"])
            DoctorEstablishment.objects.create(
                doctor=doctor,
                establishment=establishment,
                timings=relation["timings"],
            )
        return doctor

class DoctorEstablishmentSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = DoctorEstablishment
        fields = (
            "id",
            "doctor",
            "establishment",
            "is_owner",
            "timings",
        )
        read_only_fields = ["id", "doctor", "establishment", "is_owner"]
        expandable_fields = {
            "doctor": DoctorSerializer,
            "establishment": "establishments.EstablishmentSerializer",
        }

    def update(self, instance, validated_data):
        instance.timings = validated_data.get("timings", instance.timings)
        instance.save()
        return instance


