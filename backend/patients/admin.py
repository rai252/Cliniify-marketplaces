from django.contrib import admin
from .models import Patient, PatientAddress

admin.site.register(Patient)
admin.site.register(PatientAddress)
