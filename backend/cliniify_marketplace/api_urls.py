from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from core import views

urlpatterns = [
    path("search/", views.search, name="autocomplete"),
    path("suggestions/", views.suggestions, name="suggestions"),
]