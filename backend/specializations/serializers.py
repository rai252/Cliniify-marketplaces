from rest_framework import serializers
from .models import Specialization


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ("id", "name", "slug")

    def validate_name(self, value):
        if Specialization.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Specialization with this name already exists.")
        return value