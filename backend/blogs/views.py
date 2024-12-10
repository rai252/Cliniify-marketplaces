from rest_framework import viewsets, status, filters
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from rest_framework.decorators import action
from rest_framework.response import Response


from .models import Blog
from .serializers import BlogSerializer
from .permissions import ReadOnlyOrAdminPermission


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [ReadOnlyOrAdminPermission]
    filter_backends = (filters.SearchFilter,)
    search_fields = ("title", "subtitle",)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get(self.lookup_field)
        if not str(lookup_value).isnumeric():
            obj = get_object_or_404(queryset, slug=lookup_value)
            self.check_object_permissions(self.request, obj)
            return obj

        return super().get_object()

    def initialize_request(self, request, *args, **kwargs):
        self.action = self.action_map.get(request.method.lower())
        return super().initialize_request(request, *args, **kwargs)

    def get_authenticators(self):
        if self.action in ("list", "retrieve"):
            return []
        return super().get_authenticators()

    @action(methods=["GET"], detail=False, url_path="total_count")
    def total_count(self, request):
        current_date = datetime.now()
        one_month_ago = current_date - timedelta(days=30)
        total_users_count = self.queryset.count()
        last_month_users_count = self.queryset.filter(
            created_at__gte=one_month_ago
        ).count()
        increment_or_decrement_users = total_users_count - last_month_users_count
        percentage_users = (
            (increment_or_decrement_users / last_month_users_count) * 100
            if last_month_users_count > 0
            else 0
        )
        change_type = "increment" if increment_or_decrement_users > 0 else "decrement"
        return Response(
            {
                "total_blog_count": total_users_count,
                "change_type": change_type,
                "increment_or_decrement_users": abs(increment_or_decrement_users),
                "percentage_users": percentage_users,
            },
            status=status.HTTP_200_OK,
        )
