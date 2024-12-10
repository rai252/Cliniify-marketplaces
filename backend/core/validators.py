from django.core.validators import RegexValidator

phone_validator = RegexValidator(regex=r"^\d{10}$", message="Invalid phone number.")


otp_validator = RegexValidator(regex=r"^\d{6}$", message="Invalid OTP.")
