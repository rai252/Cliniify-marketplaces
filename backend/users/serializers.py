from datetime import timedelta
from django.utils import timezone

from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.db import transaction


from core.validators import phone_validator
from .models import PhoneVerification
from core.validators import otp_validator
from .utils import verify_code


User = get_user_model()


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(validators=[phone_validator])
    otp = serializers.CharField(validators=[otp_validator])
    login_type = serializers.ChoiceField(choices=("CM", "CM-CRMS", "CM-SALE"))

    def validate_phone(self, value):
        user = User.objects.filter(phone=value).first()
        if not user:
            raise ValidationError("A user with this phone number does not exist.")
        return value

    @transaction.atomic
    def validate(self, attrs):
        phone = attrs.get("phone")
        opt = attrs.get("otp")
        login_type = attrs.get("login_type")

        if not verify_code(phone, opt):
            raise AuthenticationFailed({"detail": "Invalid OTP", "code": "invalid-otp"})

        # if user is inactive, set it to active
        user = User.objects.get(phone=phone)
        if not user.is_active:
            user.is_active = True
            user.save()

        if login_type == "CM":
            if user.is_sale or user.is_superuser:
                raise AuthenticationFailed(
                    {
                        "detail": "You are not allowed to login in this app",
                        "code": "invalid-login",
                    }
                )
        elif login_type == "CM-CRMS":
            if not user.is_superuser:
                raise AuthenticationFailed(
                    {
                        "detail": "You are not allowed to login in this app",
                        "code": "invalid-login",
                    }
                )
        elif login_type == "CM-SALE":
            if not user.is_sale:
                raise AuthenticationFailed(
                    {
                        "detail": "You are not allowed to login in this app",
                        "code": "invalid-login",
                    }
                )

        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "password",
            "is_sale",
            "is_active",
        )

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class UserRegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    phone = serializers.CharField(validators=[phone_validator])
    register_type = serializers.ChoiceField(choices=("doctor", "patient"))

    def validate_phone(self, value):
        exists = User.objects.filter(phone=value, is_active=True).first()
        if exists:
            raise ValidationError("A user with this phone number already exists.")
        return value

    def validate(self, attrs):
        phone = attrs.get("phone")
        inactive_user = User.objects.filter(phone=phone, is_active=False).first()
        if inactive_user:
            inactive_user.send_verification_code()
            raise ValidationError(
                {
                    "unverified_phone": f"You have already registered with {phone}, please verify your phone number."
                }
            )
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.CharField()
    email_verification_code = serializers.CharField(min_length=6, max_length=6)


class PhoneVerificationSerializer(serializers.Serializer):
    phone = serializers.CharField(validators=[phone_validator])
    code = serializers.CharField(min_length=6, max_length=6)

    def validate(self, attrs):
        super().validate(attrs)

        phone = attrs.get("phone")
        code = attrs.get("code")
        try:
            PhoneVerification.objects.get(
                phone=phone,
                code=code,
                created_at__gte=timezone.now() - timedelta(minutes=10),
            )
        except PhoneVerification.DoesNotExist:
            raise ValidationError("Verification code is invalid or expired.")
        return attrs


class VerifyforgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()


class ForgotPasswordChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()
    password = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()


class SendOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(
        validators=[phone_validator, UniqueValidator(queryset=User.objects.all())]
    )

    def validate_phone(self, value):
        user = User.objects.filter(phone=value).first()
        if not user.is_active:
            user.send_verification_code()
            raise ValidationError(
                {
                    "detail": "Phone number is not verified, a verification code has been sent to your phone number.",
                    "code": "unverified-phone",
                }
            )
