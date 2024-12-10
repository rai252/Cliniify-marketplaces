from django.contrib import admin
from .models import (
    Establishment,
    EstablishmentImage,
    EstablishmentService,
    EstablishmentAddress,
)

# Register your models here.
admin.site.register(Establishment)
admin.site.register(EstablishmentImage)
admin.site.register(EstablishmentService)
admin.site.register(EstablishmentAddress)
