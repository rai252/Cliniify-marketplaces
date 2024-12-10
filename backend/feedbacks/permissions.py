from rest_framework import permissions
from appointments.models import Appointment
from doctors.models import Doctor
from patients.models import Patient


class CanAddFeedbackOnlyWithAppointment(permissions.BasePermission):
    message = "You have not taken an appointment with this doctor."


    def has_permission(self, request, view):
        excluded_actions = ["list", "retrieve"]
        if view.action in excluded_actions:
            return True
        
        user = request.user
        if hasattr(user, "patient"):  
            doctor_id = request.data.get("doctor", None)
            if doctor_id:
                doctor = Doctor.objects.get(
                    pk=doctor_id
                ) 
                if Appointment.objects.filter(
                    patient=user.patient.id, doctor=doctor
                ).exists():
                    return True

        return request.method in permissions.SAFE_METHODS
