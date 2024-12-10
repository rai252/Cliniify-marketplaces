from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from users.serializers import UserSerializer
from users.models import User
from .models import Patient, PatientAddress


class PatientAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAddress
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


class PatientSerializer(FlexFieldsModelSerializer):
    age = serializers.IntegerField(read_only=True)

    class Meta:
        model = Patient
        fields = (
            "id",
            "user",
            "full_name",
            "slug",
            "phone",
            "avatar",
            "email",
            "gender",
            "secondary_phone",
            "date_of_birth",
            "age",
            "blood_group",
            "address",
            "deleting_reason",
        )
        expandable_fields = {
            "user": UserSerializer,
            "address": PatientAddressSerializer,
        }


class PatientUpdateSerializer(serializers.ModelSerializer):
    address = PatientAddressSerializer()

    class Meta:
        model = Patient
        fields = (
            "id",
            "full_name",
            "slug",
            "phone",
            "avatar",
            "email",
            "gender",
            "secondary_phone",
            "date_of_birth",
            "age",
            "blood_group",
            "address",
            "deleting_reason",
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation

    def validate(self, attrs):
        email = attrs.get("email")
        phone = attrs.get("phone")
        if self.instance:
            if (
                email
                and User.objects.filter(email=email)
                .exclude(id=self.instance.user.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"email": "This email is already in use."}
                )

            if (
                phone
                and Patient.objects.filter(phone=phone)
                .exclude(id=self.instance.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"phone": "This phone number is already in use."}
                )
        else:
            if email and User.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    {"email": "This email is already in use."}
                )

            if phone and Patient.objects.filter(phone=phone).exists():
                raise serializers.ValidationError(
                    {"phone": "This phone number is already in use."}
                )
        return attrs

    def update(self, instance, validated_data):
        address_data = (
            validated_data.pop("address") if "address" in validated_data else None
        )
        if address_data:
            if instance.address:
                for key, value in address_data.items():
                    setattr(instance.address, key, value)
                instance.address.save()
            else:
                instance.address = PatientAddress.objects.create(**address_data)
                instance.save()
        instance = super().update(instance, validated_data)
        return instance


class PatientCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    address = PatientAddressSerializer(required=False)

    class Meta:
        model = Patient
        fields = [
            "full_name",
            "password",
            "phone",
            "avatar",
            "email",
            "gender",
            "secondary_phone",
            "date_of_birth",
            "age",
            "blood_group",
            "address",
            "deleting_reason",
        ]

    def validate(self, attrs):
        email = attrs.get("email")
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": "This email is already in use."}
            )

        phone = attrs.get("phone")
        if phone and Patient.objects.filter(phone=phone).exists():
            raise serializers.ValidationError(
                {"phone": "This phone number is already in use."}
            )

        return attrs

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        address_data = (
            validated_data.pop("address") if "address" in validated_data else None
        )
        user = User.objects.create_user(
            email=email,
            password=password,
            is_active=True,
        )
        if address_data:
            address = PatientAddress.objects.create(**address_data)
            validated_data["address"] = address
        patient = Patient.objects.create(user=user, email=email, **validated_data)

        return patient
