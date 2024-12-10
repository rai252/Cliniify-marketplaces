from rest_framework import permissions
from .models import Doctor, DoctorEstablishment
from establishments.models import Establishment

class DoctorPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        excluded_actions = ["list", "retrieve", "time_slots"]
        if view.action in excluded_actions:
            return True

        if request.user.is_authenticated:
            if request.user.is_superuser:
                return True

            if request.user.is_sale:
                allowed_actions_for_sale = ["sale_list_doctor", "create", "retrieve", "update", "partial_update", "destroy"]
                if view.action in allowed_actions_for_sale:
                    return True

            if view.action in ["retrieve", "update", "partial_update", "destroy", "profile_completion"] and view.get_object().user == request.user:
                return True


        return False

class OnboardEstablishmentPermission(permissions.BasePermission):
     def has_permission(self, request, view):
        if request.user.is_authenticated:
            if view.action in ["search_establishment", "send_request"]:
                return True
            if view.action in ["get_requests", "accept_request", "reject_request"]:
                try:
                    doctor = Doctor.objects.get(user=request.user)

                    doctor_establishment = DoctorEstablishment.objects.get(doctor=doctor, is_owner=True)
                    if doctor_establishment:
                        return True
                except (DoctorEstablishment.DoesNotExist, Doctor.DoesNotExist):
                    pass
        return False
            

class DoctorEstablishmentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.doctor == request.user.doctor