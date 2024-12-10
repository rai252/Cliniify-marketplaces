from django.contrib import admin
from doctors.models import Doctor, DoctorEstablishment, DoctorAddress, DoctorImages


admin.site.register(Doctor)
admin.site.register(DoctorEstablishment)
admin.site.register(DoctorAddress)
admin.site.register(DoctorImages)
