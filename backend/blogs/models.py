from django.db import models
from django.utils.text import slugify

from core.models import BaseModel


class Blog(BaseModel):
    title = models.CharField(max_length=250)
    slug = models.CharField(max_length=500, null=True, blank=True, unique=True)
    subtitle = models.CharField(max_length=250, null=True, blank=True)
    image = models.ImageField(upload_to="images/blogs", null=True, blank=True)
    content = models.TextField()

    class Meta:
        verbose_name_plural = "Blogs"
        ordering = ("-created_at",)

    def save(self, *args, **kwargs):
        base_slug = slugify(f"{self.title}")

        existing_doctors = Blog.objects.filter(slug=base_slug)
        if existing_doctors.exists():
            count = 1
            while Blog.objects.filter(slug=f"{base_slug}-{count}").exists():
                count += 1
            self.slug = f"{base_slug}-{count}"
        else:
            self.slug = base_slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
