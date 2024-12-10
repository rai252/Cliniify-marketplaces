from django.db import models
from django.db.models.query import QuerySet
from django.utils import timezone
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE


class BaseModel(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
