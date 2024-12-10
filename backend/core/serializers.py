
from rest_framework import serializers
from establishments.serializers import EstablishmentAddressSerializer

class CombinedSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.CharField()
    establishment_category = serializers.CharField()
    tagline = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    contact_person = serializers.CharField()
    address = EstablishmentAddressSerializer()
    associated_doctors = serializers.ListField(child=serializers.DictField())
    average_rating = serializers.FloatField()
