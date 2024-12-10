from django.dispatch import receiver
from safedelete.signals import pre_softdelete

from establishments.models import Establishment


@receiver(pre_softdelete, sender=Establishment)
def delete_establishment_address(sender, instance, **kwargs):
    if instance.address:
        instance.address.delete()
