from django.db import models
from core.models import BaseModel
from django.utils.text import slugify

# Create your models here.
class Specialization(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    slug= models.CharField(max_length=255, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):

        base_slug = slugify(f"{self.name}")

        existing_doctors = Specialization.objects.filter(slug=base_slug)
        if existing_doctors.exists():
            count = 1
            while Specialization.objects.filter(slug=f"{base_slug}-{count}").exists():
                count += 1
            self.slug = f"{base_slug}-{count}"
        else:
            self.slug = base_slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name