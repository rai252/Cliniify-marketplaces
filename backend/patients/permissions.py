from rest_framework import permissions


class PatientPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            if request.user.is_superuser:
                return True

            if (
                view.action in ["retrieve", "update", "partial_update", "destroy", "profile_completion"]
                and view.get_object().user == request.user
            ):
                return True

        return False
