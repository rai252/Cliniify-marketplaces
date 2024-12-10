from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from django.core.exceptions import ObjectDoesNotExist
from django.template.exceptions import TemplateDoesNotExist
from django.contrib import messages

from core.tasks import send_email_task
from .models import EstablishmentStaffInvitation, Establishment

from django.core.exceptions import ObjectDoesNotExist
from django.template.exceptions import TemplateDoesNotExist
from rest_framework.response import Response
from rest_framework import status


def _send_establishment_staff_invitation(doctor, token, establishment):
    try:
        invitation = EstablishmentStaffInvitation.objects.get(token=token)

        if invitation.accepted:
            error_message = "This invitation has already been accepted."
            return Response(
                {"error": error_message}, status=status.HTTP_400_BAD_REQUEST
            )

        relative_link = f"/api/establishments-invitations/invitation/?token={token}"
        abs_url = settings.BACKEND_URL + relative_link

        subject = f"Invitation to join {establishment.name} as a staff member"
        try:
            html_message = render_to_string(
                "establishments/staff_invitation_email.html",
                {
                    "doctor": doctor,
                    "establishment": establishment,
                    "abs_url": abs_url,
                },
            )
        except TemplateDoesNotExist:
            error_message = (
                "The staff invitation email template is missing or not found."
            )
            return Response({"error": error_message}, status=status.HTTP_404_NOT_FOUND)
    
        plain_message = html_message
        from_email = settings.DEFAULT_FROM_EMAIL
        send_email_task(subject, plain_message, [doctor.email], from_email)
        return Response(
            {"message": f"Staff invitation sent successfully to {doctor.email}"},
            status=status.HTTP_200_OK,
        )

    except ObjectDoesNotExist:
        error_message = "The establishment or staff invitation instance does not exist."
        return Response({"error": error_message}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        error_message = (
            f"An unexpected error occurred while sending the staff invitation: {str(e)}"
        )
        return Response(
            {"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
