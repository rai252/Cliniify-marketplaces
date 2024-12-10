from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from django.utils.crypto import get_random_string

from .models import User, PhoneVerification
from .utils import send_verification_code
from .serializers import (
    ChangePasswordSerializer,
    EmailVerificationSerializer,
    ForgotPasswordChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    User,
    UserRegisterSerializer,
    UserSerializer,
    VerifyforgotPasswordSerializer,
    PhoneVerificationSerializer,
)
from doctors.models import Doctor

from patients.models import Patient
from core.utils import generate_verification_code
from core.tasks import send_email_task
from .permissions import UserPermissions


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [UserPermissions]

    def initialize_request(self, request, *args, **kwargs):
        self.action = self.action_map.get(request.method.lower())
        return super().initialize_request(request, *args, **kwargs)

    def get_authenticators(self):
        if self.action in (
            "forgot_password",
            "verify_email_for_forgot_password",
            "change_password_for_forgot_password",
            "register",
            "login",
            "register_verify_phone",
            "send_phone_verification_code",
            "send_otp",
        ):
            return []
        return super().get_authenticators()

    def get_serializer_class(self, *args, **kwargs):
        if self.action == "forgot_password":
            return ForgotPasswordSerializer
        if self.action == "verify_email_for_forgot_password":
            return VerifyforgotPasswordSerializer
        if self.action == "change_password_for_forgot_password":
            return ForgotPasswordChangePasswordSerializer
        if self.action == "verify_email":
            return EmailVerificationSerializer
        if self.action == "register":
            return UserRegisterSerializer
        if self.action == "login":
            return LoginSerializer
        if self.action == "change_password":
            return ChangePasswordSerializer
        return super().get_serializer_class(*args, **kwargs)

    @action(methods=["POST"], detail=False, url_path="auth/send-otp")
    def send_otp(self, request):
        phone = request.data.get("phone")
        if not phone:
            raise ValidationError({"phone": ["This field is required."]})
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            raise ValidationError(
                {"detail": "Invalid phone number.", "code": "invalid-phone"}
            )

        user.send_verification_code()
        return Response({"message": "OTP sent successfully."})

    @action(methods=["POST"], detail=False, url_path="auth/login")
    def login(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        data = {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        }
        return Response(data)

    @action(methods=["GET"], detail=False)
    def sale_user_list(self, request):
        queryset = User.objects.filter(is_sale=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=["POST"], detail=False)
    def register(self, request):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        full_name = serializer.validated_data["full_name"]
        phone = serializer.validated_data["phone"]
        register_type = serializer.validated_data["register_type"]

        with transaction.atomic():
            user = User.objects.create_user(phone=serializer.validated_data["phone"])
            Model = Doctor if register_type == "doctor" else Patient
            Model.objects.create(full_name=full_name, phone=phone, user=user)
            user.send_verification_code()
        return Response(
            {
                "message": f"A verification code has been sent to {phone}, please verify your phone number."
            }
        )

    @action(methods=["POST"], detail=False, url_path="register-verify-phone")
    def register_verify_phone(self, request):
        serializer = PhoneVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        phone_verification = PhoneVerification.objects.filter(phone=phone).first()
        user = User.objects.get(phone=phone)

        phone_verification.verified = True
        phone_verification.save()
        user.is_active = True
        user.save()
        return Response(
            {"message": "Phone number verified successfully, you can now login."}
        )

    @action(methods=["POST"], detail=False, url_path="send-phone-verification-code")
    def send_phone_verification_code(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response(
                {"error": "Phone is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid phone number."}, status=status.HTTP_400_BAD_REQUEST
            )

        send_verification_code(phone)
        return Response({"message": f"A verification code has been sent to {phone}."})

    @action(methods=["POST"], detail=False)
    def forgot_password(self, request, pk=None):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid email."}, status=status.HTTP_400_BAD_REQUEST
            )
        otp = generate_verification_code()
        user.forget_password_otp = otp
        user.forget_password_otp_expires = timezone.now() + timedelta(minutes=15)
        user.save()

        subject = "Password Reset Request"
        body = f"Your OTP for password reset is {otp}."

        send_email_task(subject, body, [user.email])
        EmailVerification.objects.create(email=email, code=otp)
        return Response({"message": "OTP sent to your email."})

    @action(methods=["post"], detail=False)
    def change_password_for_forgot_password(self, request):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["password"]

        error = {}
        if code is None:
            error["code"] = "Code is required"
        if email is None:
            error["email"] = "Email is required"
        if new_password is None:
            error["new_password"] = "New password is required"

        if len(error) == 0:
            try:
                user = User.objects.get(email=email)
                email_verification = EmailVerification.objects.get(
                    email=email,
                    code=code,
                    created_at__gte=timezone.now() - timedelta(minutes=10),
                )
                email_verification.verified = True
                email_verification.save()

                user.set_password(new_password)
                user.save()

                return Response(status=status.HTTP_201_CREATED)
            except User.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            except EmailVerification.DoesNotExist:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            data=error,
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=False, methods=["GET"])
    def me(self, request, *args, **kwargs):
        user = request.user
        user_serializer = UserSerializer(user)

        user_type_id = None
        user_full_name = None
        if hasattr(user, "doctor"):
            doctor_instance = Doctor.objects.filter(user=user).first()
            user_type_id = doctor_instance.id if doctor_instance else None
            user_full_name = (
                doctor_instance.full_name
                or f"{get_random_string(4)}{doctor_instance.id}"
            )
            onboarding_steps = (
                doctor_instance.onboarding_steps if doctor_instance else None
            )
        elif hasattr(user, "patient"):
            patient_instance = Patient.objects.filter(user=user).first()
            user_type_id = patient_instance.id if patient_instance else None
            user_full_name = (
                patient_instance.full_name
                or f"{get_random_string(4)}{doctor_instance.id}"
            )

        key = "doctor_id" if (hasattr(user, "doctor")) else "patient_id"
        if hasattr(user, "doctor"):
            return Response(
                {
                    **user_serializer.data,
                    key: user_type_id,
                    "full_name": user_full_name,
                    "onboarding_steps": onboarding_steps,
                }
            )
        else:
            return Response(
                {**user_serializer.data, key: user_type_id, "full_name": user_full_name}
            )

    @action(detail=True, methods=["post"])
    def change_password(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"status": False, "errors": {"Error": "User not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if new_password != confirm_password:
            return Response(
                {
                    "status": False,
                    "errors": {"Error": "Passwords do not match. Please try again."},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password:
            user.set_password(new_password)
            user.save()
            return Response(
                {"status": True, "msg": {"Success": "Password changed successfully."}},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": False, "errors": {"Error": "New password is required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )
