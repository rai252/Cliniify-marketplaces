from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from core.tasks import send_email_task

from .models import Appointment
from doctors.models import Doctor

@receiver(pre_save, sender=Appointment)
def send_appointment_status_notification(sender, instance, **kwargs):
    if instance.pk:
        old_instance = Appointment.objects.get(pk=instance.pk)
        if old_instance.status == instance.status:
            return

    templates = {
        "confirmed": {
            "email_subject": "Appointment Confirmed",
            "email_template": "appointments/emails/appointment_confirmation_email.html",
        },
        "cancelled": {
            "email_subject": "Appointment Cancelled",
            "email_template": "appointments/emails/appointment_cancellation_email.html",
        },
        "rescheduled": {
            "email_subject": "Appointment Rescheduled",
            "email_template": "appointments/emails/appointment_rescheduled_email.html",
        },
        "rejected": {
            "email_subject": "Appointment Rejected",
            "email_template": "appointments/emails/appointment_rejected_email.html",
        },
    }
    doctor = Doctor.objects.get(id=instance.doctor.id)
    address = doctor.address
    status = instance.status
    if status in templates:
        template_data = templates[status]
        email_subject = template_data["email_subject"]
        email_body = render_to_string(
            template_data["email_template"],
            {"appointment": instance, "address": address }, 
        )
        if instance.patient.user.email:
            send_email_task(
                subject=email_subject,
                body=email_body,
                recipient_list=[instance.patient.user.email],
            )
