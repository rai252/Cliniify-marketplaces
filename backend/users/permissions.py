from rest_framework import permissions


class UserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        excluded_actions = [
            "forgot_password",
            "verify_email_for_forgot_password",
            "change_password_for_forgot_password",
            "register",
            "login",
            "register_verify_phone",
            "send_phone_verification_code",
            "send_otp",
        ]
        if view.action in excluded_actions:
            return True

        if request.user.is_authenticated:

            if request.user.is_superuser:
                return True

            if view.action == "list":
                return False

            if view.action == "me":
                return True

            if view.action == "change_password":
                return True
        return False

    def has_object_permission(self, request, view, obj):
        excluded_actions = [
            "forgot_password",
            "verify_email_for_forgot_password",
            "change_password_for_forgot_password",
            "register",
            "verify_email",
        ]
        if view.action in excluded_actions:
            return True

        if request.user.is_authenticated:
            if request.user.is_superuser:
                return True

            if obj == request.user:
                if view.action in ["update", "partial_update", "retrieve"]:
                    return True

        return False
