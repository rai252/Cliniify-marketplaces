# signals.py
import os
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from PIL import Image, ImageFilter
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from safedelete.signals import pre_softdelete

from .models import Patient


@receiver(pre_save, sender=Patient)
def resize_avatar(sender, instance, **kwargs):
    if instance.avatar and (
        not instance.pk or instance.avatar != Patient.objects.get(pk=instance.pk).avatar
    ):
        image = Image.open(instance.avatar)

        if image.mode == "RGBA":
            image = image.convert("RGB")

        max_width = 300
        max_height = 300

        width_ratio = max_width / image.width
        height_ratio = max_height / image.height

        ratio = min(width_ratio, height_ratio)

        new_width = int(image.width * ratio)
        new_height = int(image.height * ratio)
        image = image.resize((new_width, new_height), Image.LANCZOS)

        max_size_mb = 1
        max_size_bytes = max_size_mb * 1024 * 1024
        if instance.avatar.size > max_size_bytes:
            output = BytesIO()
            image.save(output, format="JPEG", quality=70)
            output.seek(0)
            instance.avatar = InMemoryUploadedFile(
                output,
                "ImageField",
                "%s.jpg" % instance.avatar.name.split(".")[0],
                "image/jpeg",
                output.getbuffer().nbytes,
                None,
            )

        new_filename = f"{instance.full_name}_{instance.pk}.jpg"

        # Save the modified image with the new filename
        image_io = BytesIO()
        image.save(image_io, format="JPEG")
        image_io.seek(0)

        instance.avatar.save(os.path.basename(new_filename), image_io, save=False)


@receiver(pre_softdelete, sender=Patient)
def delete_patient_address(sender, instance, **kwargs):
    if instance.address:
        instance.address.delete()
