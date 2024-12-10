from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from django.core.validators import RegexValidator

from core.models import BaseModel
from doctors.models import Doctor, DoctorEstablishment
from specializations.models import Specialization

phone_regex = RegexValidator(
    regex=r"^(\+\d{1,3})?,?\s?\d{8,13}", message="Invalid phone number."
)


class EstablishmentAddress(BaseModel):
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


class Establishment(BaseModel):
    class EstablishmentCategory(models.TextChoices):
        GENERAL = "general"
        SPECIALITY = "speciality"
        MULTI_SPECIALITY = "multi-speciality"

    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True, null=True, blank=True)
    establishment_category = models.CharField(
        choices=EstablishmentCategory.choices, max_length=80
    )
    logo = models.ImageField(
        upload_to="images/establishments/logos", null=True, blank=True
    )
    tagline = models.CharField(max_length=255, null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    website = models.URLField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(
        max_length=15, null=True, blank=True, validators=[phone_regex]
    )
    contact_person = models.CharField(max_length=255, null=True, blank=True)
    address = models.OneToOneField(
        EstablishmentAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    specializations = models.ManyToManyField(Specialization)
    onboarded_by = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        related_name="establishment_onboarded_by_user",
        null=True,
        blank=True,
    )
    timings = models.JSONField(null=True, blank=True)

    @property
    def owner(self):
        doc_estab = DoctorEstablishment.objects.filter(
            establishment=self, is_owner=True
        ).first()
        return doc_estab.doctor.id if doc_estab else None

    @property
    def staffs(self):
        staffs = DoctorEstablishment.objects.filter(
            establishment=self, is_owner=False
        ).values_list("doctor", flat=True)
        return staffs

    class Meta:
        verbose_name_plural = "Establishments"
        ordering = ("-created_at",)

    def _make_slug(self):
        city = self.address.city if self.address else None
        slug = slugify(f"{self.name} {city}") if city else slugify(self.name)
        if self.slug and slug in self.slug:
            return self.slug
        while Establishment.all_objects.filter(slug=slug).exists():
            slug = f"{slug}-{get_random_string(4)}"
        return slug

    def save(self, *args, **kwargs):
        self.slug = self._make_slug()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class EstablishmentImage(BaseModel):
    image = models.ImageField(upload_to="images/establishments")
    establishment = models.ForeignKey(
        Establishment, on_delete=models.CASCADE, related_name="establishment_images"
    )

    class Meta:
        verbose_name_plural = "Establishment Images"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.image}"


class EstablishmentService(BaseModel):
    name = models.CharField(max_length=255)
    establishment = models.ForeignKey(
        Establishment, on_delete=models.CASCADE, related_name="establishment_services"
    )

    class Meta:
        verbose_name_plural = "Establishment Services"
        ordering = ("-created_at",)

    def __str__(self):
        return self.name


class EstablishmentStaffInvitation(BaseModel):
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="doctors_invitation"
    )
    establishment = models.ForeignKey(
        Establishment,
        on_delete=models.CASCADE,
        related_name="establishment_Staff_invitation",
    )
    accepted = models.BooleanField(default=False)
    token = models.CharField(max_length=255)
    accepted_at = models.DateTimeField(null=True, blank=True)
    invited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Establishment Staff Invitation"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.establishment.name} invited {self.doctor.full_name}"


class EstablishmentRequestStaff(BaseModel):
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="doctors_request"
    )
    establishment = models.ForeignKey(
        Establishment,
        on_delete=models.CASCADE,
        related_name="establishmen_request",
    )
    is_approved = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    is_rejected = models.BooleanField(default=False)
    rejected_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Establishment Request Staff"
        ordering = ("-requested_at",)

    def __str__(self):
        return f"{self.establishment.name} invited {self.doctor.full_name}"
