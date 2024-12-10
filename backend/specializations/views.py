from rest_framework import viewsets, filters
from django.shortcuts import get_object_or_404

from .models import Specialization
from .serializers import SpecializationSerializer

class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = []
    authentication_classes = []
    filter_backends = (filters.SearchFilter,)
    search_fields = ("name",)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get(self.lookup_field)
        if not str(lookup_value).isnumeric():
            obj = get_object_or_404(queryset, slug=lookup_value)
            self.check_object_permissions(self.request, obj)
            return obj

        return super().get_object()