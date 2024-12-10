from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from datetime import date
from django.core.validators import RegexValidator
from django.utils.text import slugify
from django.utils.crypto import get_random_string

from core.models import BaseModel
from users.models import User
from core.validators import phone_validator


class PatientAddress(BaseModel):
    address_line_1 = models.CharField(max_length=255)  # House No., Area and Street
    address_line_2 = models.CharField(max_length=255)  # Locality
    landmark = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    pincode = models.CharField(max_length=6)
    latitude = models.DecimalField(
        max_digits=12, decimal_places=8, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=12, decimal_places=8, null=True, blank=True
    )

    def __str__(self) -> str:
        return (
            f"{self.address_line_1}, {self.address_line_2}, {self.city}, {self.state}"
        )


class Patient(BaseModel):
    class BloodGroup(models.TextChoices):
        O_POSITIVE = "O+", _("O+")
        O_NEGATIVE = "O-", _("O-")
        A_POSITIVE = "A+", _("A+")
        A_NEGATIVE = "A-", _("A-")
        B_POSITIVE = "B+", _("B+")
        B_NEGATIVE = "B-", _("B-")
        AB_POSITIVE = "AB+", _("AB+")
        AB_NEGATIVE = "AB-", _("AB-")
        A1_POSITIVE = "A1+", _("A1+")
        A1_NEGATIVE = "A1-", _("A1-")
        A1B_POSITIVE = "A1B+", _("A1B+")
        A1B_NEGATIVE = "A1B-", _("A1B-")

    class GenderChoices(models.TextChoices):
        MALE = "M"
        FEMALE = "F"
        OTHERS = "O"

    user = models.OneToOneField(
        User,
        on_delete=models.PROTECT,
    )
    full_name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True, null=True, blank=True)
    avatar = models.ImageField(upload_to="images/avatar", null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=10, validators=[phone_validator])
    gender = models.CharField(choices=GenderChoices.choices, max_length=50)
    secondary_phone = models.CharField(
        max_length=15, null=True, blank=True, validators=[phone_validator]
    )
    date_of_birth = models.DateField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    blood_group = models.CharField(
        max_length=4, choices=BloodGroup.choices, null=True, blank=True
    )
    address = models.OneToOneField(
        PatientAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    deleting_reason = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Patients"
        ordering = ("-created_at",)

    def save(self, *args, **kwargs):
        self.slug = self._make_slug()
        super().save(*args, **kwargs)

    def _make_slug(self):
        if self.pk:
            old_instance = Patient.objects.get(pk=self.pk)
            if old_instance.full_name == self.full_name:
                return self.slug

        slug = slugify(self.full_name)
        while Patient.all_objects.filter(slug=slug).exclude(pk=self.pk):
            slug = f"{slug}-{get_random_string(4)}"
        return slug

    def __str__(self):
        return f"{self.full_name}"

    def clean(self):
        if self.date_of_birth is None and self.age is None:
            raise ValidationError("Either date of birth or age is required")

    def count_filled_fields(self, exclude=None):
        if exclude is None:
            exclude = []
        filled_fields = sum(
            1
            for field_name, field_value in self.__dict__.items()
            if field_name not in exclude
            and field_value is not None
            and field_value != ""
        )
        return filled_fields
