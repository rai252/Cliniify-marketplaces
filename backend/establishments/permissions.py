from rest_framework import permissions
from doctors.models import DoctorEstablishment

class EstablishmentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        excluded_actions = ["list", "retrieve"]


        if view.action in excluded_actions:
            return True

        if request.user.is_authenticated:
            if request.user.is_superuser:
                return True

            if request.user:
                if view.action in ["create", "available_staff_doctors", "available_owner_doctors"]:
                    return True


            if request.user.is_sale:
                allowed_actions_for_sale = ["sale_list_establishment", "create", "retrieve", "update", "partial_update", "destroy", "available_staff_doctors", "available_owner_doctors"]    
                if view.action in allowed_actions_for_sale:
                    return True
                
                
            establishment = view.get_object()
            if establishment:
                try:
                    doctor = request.user.doctor
                except:
                    return False

                is_owner = DoctorEstablishment.objects.filter(
                    doctor=doctor, establishment=establishment, is_owner=True
                ).exists()

                if is_owner:
                    if view.action in ["get", "update", "partial_update", "destroy", "available_staff_doctors", "available_owner_doctors"]:
                        return True

        return False