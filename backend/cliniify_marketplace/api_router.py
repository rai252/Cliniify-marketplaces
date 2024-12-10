from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter


from users.views import UserViewSet
from doctors import views
from patients.views import PatientViewSet
from specializations.views import SpecializationViewSet 
from appointments.views import AppointmentViewSet
from feedbacks.views import FeedbackViewSet
from blogs.views import BlogViewSet 
from establishments.views import EstablishmentViewSet, EstablishmentStaffInvitationViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet, basename="users")
router.register("doctors", views.DoctorViewSet, basename="doctors")
router.register("patients", PatientViewSet, basename="patients")
router.register("specializations", SpecializationViewSet, basename="specializations")
router.register("appointments", AppointmentViewSet, basename="appointments")
router.register("feedbacks", FeedbackViewSet, basename="feedbacks")
router.register("blogs", BlogViewSet, basename="blogs")
router.register("establishments", EstablishmentViewSet, basename="establishments")
router.register("establishments-invitations", EstablishmentStaffInvitationViewSet, basename="establishments-invitations")
router.register("establishments/onboard-requests", views.OnboradEstablishmentrequestViewSet, basename="onboard-request")
# router.register("doctors/establishments", views.DoctorEstablishmentViewSet, basename="doctor_establishments")

urlpatterns = router.urls
