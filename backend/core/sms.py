from django.conf import settings
import requests


def send_sms(phone_number: str, message: str):
    if settings.SMS_BACKEND == "console":
        print("------------------------------ SMS ------------------------------------")
        print(f"Phone Number: {phone_number}")
        print(f"Message: {message}")
        print("-----------------------------------------------------------------------")
        return True

    params = {
        "apikey": settings.SMS_API_KEY,
        "senderid": settings.SMS_SENDER_ID,
        "channel": settings.SMS_CHANNEL,
        "dcs": settings.SMS_DCS,
        "flashsms": settings.SMS_FLASH_SMS,
        "route": settings.SMS_ROUTE,
        "number": phone_number,
        "text": message,
    }
    response = requests.get(settings.SMS_API_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        if data["ErrorCode"] == "000":
            return True

    return False
