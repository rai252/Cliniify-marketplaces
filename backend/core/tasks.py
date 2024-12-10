from django.conf import settings
from django.core.mail import EmailMessage
from huey.contrib.djhuey import task

from .sms import send_sms


@task()
def send_email_task(
    subject,
    body,
    recipient_list,
    from_email=settings.EMAIL_DEFAULT_FROM,
    attachments=[],
):
    try:
        email = EmailMessage(subject, body, from_email, recipient_list)
        email.send()
    except Exception as e:
        raise Exception(e)


@task()
def send_sms_task(phone_number: str, message: str):
    return send_sms(phone_number, message)
