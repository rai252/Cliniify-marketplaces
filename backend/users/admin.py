from django.contrib import admin
from users.models import User, PhoneVerification

admin.site.register(User)
admin.site.register(PhoneVerification)
