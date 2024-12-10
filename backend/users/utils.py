from datetime import timedelta

from django.utils.crypto import get_random_string
from django.utils import timezone

from core.tasks import send_sms_task


def send_verification_code(phone):
    """Sends verification code to the given phone number"""

    from .models import PhoneVerification  # Import here to avoid circular import

    code = get_random_string(length=6, allowed_chars="0123456789")
    PhoneVerification.objects.create(phone=phone, code=code)

    message = f"Your verification code is {code}. Do not share this code with anyone. Powered by Synbus Technology LLP."
    send_sms_task(phone, message)


def verify_code(phone, code):
    from .models import PhoneVerification  # Import here to avoid circular import

    try:
        phone_verification = PhoneVerification.objects.get(
            phone=phone,
            code=code,
            created_at__gte=timezone.now() - timedelta(minutes=10),
        )
    except Exception as e:
        return False

    phone_verification.verified = True
    phone_verification.save()
    return True
