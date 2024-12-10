import re
import random
import string

from django.db import models
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from django.core.validators import RegexValidator
from django.utils.crypto import get_random_string


from core.models import BaseModel
from users.models import User
from specializations.models import Specialization
from core.validators import phone_validator


def contains_dr(string):
    return bool(re.search(r"\b(dr|Dr|DR|dr\.|Dr\.|DR\.)\b", string, re.IGNORECASE))


def validate_pdf_doc(value):
    ext = value.name.split(".")[-1].lower()
    if ext not in ["pdf", "doc"]:
        raise ValidationError(
            "Unsupported file extension. Allowed extensions are PDF and DOC."
        )


def generate_random_string(length=6):
    letters = string.ascii_lowercase
    return "".join(random.choice(letters) for _ in range(length))


def get_default_onboarding():
    return {
        "per_con": "False",
        "edu_spec": "False",
        "reg_doc": "False",
        "fee_time": "False",
    }


class DoctorAddress(BaseModel):
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


class Doctor(BaseModel):
    class TimeSlot(models.TextChoices):
        TEN_MINUTES = "00:10", "10 minutes"
        FIFTEEN_MINUTES = "00:15", "15 minutes"
        TWENTY_MINUTES = "00:20", "20 minutes"
        THIRTY_MINUTES = "00:30", "30 minutes"
        FORTY_FIVE_MINUTES = "00:45", "45 minutes"
        ONE_HOUR = "01:00", "1 hour"

    class GenderChoices(models.TextChoices):
        MALE = "M"
        FEMALE = "F"
        OTHERS = "O"

    full_name = models.CharField(max_length=255)
    user = models.OneToOneField(
        User,
        on_delete=models.PROTECT,
    )
    slug = models.CharField(max_length=255, unique=True)
    avatar = models.ImageField(upload_to="images/avatar", null=True, blank=True)
    phone = models.CharField(
        max_length=10,
        validators=[phone_validator],
    )
    email = models.EmailField(null=True, blank=True)
    alternative_number = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        validators=[phone_validator],
    )
    clinic_no = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        validators=[phone_validator],
    )
    gender = models.CharField(choices=GenderChoices.choices, max_length=50)
    specializations = models.ManyToManyField(Specialization)
    website = models.URLField(max_length=255, null=True, blank=True)
    bio = models.TextField(max_length=255, blank=True, null=True)
    reg_no = models.CharField(max_length=255, null=True, blank=True)
    reg_council = models.CharField(max_length=255, null=True, blank=True)
    reg_year = models.PositiveIntegerField(null=True, blank=True)
    degree = models.CharField(max_length=255, null=True, blank=True)
    institute_name = models.CharField(max_length=255, null=True, blank=True)
    completion_year = models.PositiveIntegerField(null=True, blank=True)
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    own_establishment = models.BooleanField(null=True, blank=True)
    identity_proof = models.FileField(
        upload_to="documents/identity_proofs",
        null=True,
        blank=True,
        validators=[validate_pdf_doc],
    )
    medical_reg_proof = models.FileField(
        upload_to="documents/medical_reg_proofs",
        null=True,
        blank=True,
        validators=[validate_pdf_doc],
    )
    establishment_proof = models.FileField(
        upload_to="documents/establishment_proofs",
        null=True,
        blank=True,
        validators=[validate_pdf_doc],
    )
    address = models.OneToOneField(
        DoctorAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    fee = models.PositiveIntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    timings = models.JSONField(null=True, blank=True)
    time_duration = models.CharField(
        max_length=5, choices=TimeSlot.choices, default=TimeSlot.TEN_MINUTES
    )
    onboarding_steps = models.JSONField(default=get_default_onboarding)
    auto_confirm = models.BooleanField(default=False)
    deleting_reason = models.CharField(max_length=255, null=True, blank=True)
    onboarded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="onboarded_by_user",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name_plural = "Doctors"
        ordering = ("-created_at",)

    @property
    def owned_establishment(self):
        doc_esta = DoctorEstablishment.objects.filter(
            doctor=self.pk, is_owner=True
        ).first()
        return doc_esta.establishment.id

    def make_slug(self):
        specializations = ""
        for spec in self.specializations.all():
            specializations += f"-{spec.name}" if specializations else spec.name
        slug = (
            slugify(f"{self.full_name} {specializations}")
            if specializations
            else slugify(self.full_name)
        )
        while Doctor.all_objects.filter(slug=slug).exclude(pk=self.pk):
            slug = f"{slug}-{get_random_string(4)}"
        return slug

    def save(self, *args, **kwargs):
        self.full_name = self.format_full_name()
        if not self.slug:
            self.slug = get_random_string(10)
        super().save(*args, **kwargs)

    def format_full_name(self):
        variations_to_check = ["dr.", "dr", "Dr.", "Dr"]
        name = self.full_name.strip()

        for variation in variations_to_check:
            if name.lower().startswith(variation.lower()):
                name = name[len(variation) :].strip()
                return f"Dr. {name}"

        return f"Dr. {name}"

    def count_filled_fields(self, exclude=None):
        if exclude is None:
            exclude = []
        filled_fields = 0
        for field_name, field_value in self.__dict__.items():
            if (
                field_name not in exclude
                and field_value is not None
                and field_value != ""
            ):
                filled_fields += 1
        return filled_fields

    def __str__(self):
        return f"{self.full_name} - {self.time_duration}"


class DoctorImages(BaseModel):
    image = models.ImageField(upload_to="images/doctors")
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="doctor_images"
    )

    class Meta:
        verbose_name_plural = "Doctor Images"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.image}"


class DoctorEstablishment(models.Model):
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="associated_doctors"
    )
    establishment = models.ForeignKey(
        "establishments.Establishment",
        on_delete=models.CASCADE,
        related_name="associated_establishments",
    )
    is_owner = models.BooleanField(default=False)
    timings = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = ("doctor", "establishment")

    def __str__(self):
        return f"{self.doctor} - {self.establishment}"
