from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.core.mail import send_mail
from django.contrib import auth
from safedelete.managers import SafeDeleteManager
from django.utils.crypto import get_random_string

from core.models import BaseModel
from core.validators import phone_validator
from users.utils import send_verification_code


class CustomUserManager(SafeDeleteManager, BaseUserManager):
    def _create_user(self, phone, password, **extra_fields):
        if not phone:
            raise ValueError("The given phone number must be set")

        # Mask phone number of soft deleted user
        # TODO: This is a hack, we need to find a better way to do this
        deleted_user = User.deleted_objects.filter(phone=phone).first()
        if deleted_user:
            deleted_user.phone = get_random_string(
                length=10, allowed_chars="0123456789"
            )
            deleted_user.save(update_fields=["phone"])

        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        # If password is not provided, generate a random password
        if not password:
            password = get_random_string(length=12)
        return self._create_user(phone, password, **extra_fields)

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self._create_user(phone, password, is_active=True, **extra_fields)

    def with_perm(
        self, perm, is_active=True, include_superusers=True, backend=None, obj=None
    ):
        if backend is None:
            backends = auth._get_backends(return_tuples=True)
            if len(backends) == 1:
                backend, _ = backends[0]
            else:
                raise ValueError(
                    "You have multiple authentication backends configured and "
                    "therefore must provide the `backend` argument."
                )
        elif not isinstance(backend, str):
            raise TypeError(
                "backend must be a dotted import path string (got %r)." % backend
            )
        else:
            backend = auth.load_backend(backend)
        if hasattr(backend, "with_perm"):
            return backend.with_perm(
                perm,
                is_active=is_active,
                include_superusers=include_superusers,
                obj=obj,
            )
        return self.none()


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    phone = models.CharField(
        max_length=10, validators=[phone_validator], unique=True, db_index=True
    )
    email = models.EmailField(unique=True, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_sale = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "phone"

    class Meta:
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def send_verification_code(self):
        send_verification_code(self.phone)

    def send_otp(self):
        pass


class PhoneVerification(models.Model):
    phone = models.CharField(max_length=10)
    code = models.CharField(max_length=6)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.phone} - {self.verified}"
