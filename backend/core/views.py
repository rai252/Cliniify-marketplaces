from django.conf import settings
from django.db.models import Avg, Q
from django.http import HttpResponse, Http404
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from doctors.filters import DoctorFilter

from core.pagination import StandardResultsSetPagination
from doctors.models import Doctor, DoctorEstablishment
from specializations.models import Specialization
from establishments.models import Establishment
from establishments.serializers import (
    EstablishmentSearchSerializer,
)
from doctors.serializers import DoctorAddressSerializer


def web_entrypoint(request):
    try:
        with open(settings.WEB_ENTRYPOINT) as file:
            return HttpResponse(file.read())
    except Exception:
        raise Http404


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def search(request):
    query = request.GET.get("q")
    location = request.GET.get("location")

    errors = validate_search_params(query, location)
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    location_list = location.split(",")

    establishments_by_location = search_establishments(query, location_list)

    doctors_by_location = search_doctors(
        request=request, query=query, location_list=location_list
    )

    combined_results = combine_results(establishments_by_location, doctors_by_location)

    combined_results = sort_combined_results(combined_results)

    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(combined_results, request)
    serialized_data = [serialize_combined(item, request) for item in result_page]

    return paginator.get_paginated_response(serialized_data)


def search_establishments(query, location_list):

    unique_establishments = set()
    for loc in location_list:
        location_filters = Q(address__city__icontains=loc.strip()) | Q(
            address__state__icontains=loc.strip()
        )
        name_filters = Q(name__icontains=query)
        category_filters = Q(establishment_category__icontains=query)
        services_filters = Q(establishment_services__name__icontains=query)
        filters = location_filters & (name_filters | category_filters | services_filters)
        filtered_establishments = Establishment.objects.filter(filters).distinct()
        unique_establishments.update(filtered_establishments)


    establishments_by_location = []
    for establishment in unique_establishments:
        establishment.average_rating = get_average_rating_for_establishment(
            establishment
        )
        establishment.associated_doctors = get_associated_doctors(establishment)
        establishments_by_location.append(establishment)

    return establishments_by_location

def search_doctors(request, query, location_list):

    doctor_filter = DoctorFilter(request.GET, queryset=Doctor.objects.all())
    unique_doctors = set()
    for loc in location_list:
        location_filters = Q(address__city__icontains=loc.strip()) | Q(
            address__state__icontains=loc.strip()
        )
        specialization_filters = Q(specializations__name__icontains=query)
        name_filters = Q(full_name__icontains=query)
        filters = location_filters & (specialization_filters | name_filters)
        filtered_doctors = doctor_filter.qs.filter(filters, is_verified=True).distinct()
        unique_doctors.update(filtered_doctors)


    doctors_by_location = list(unique_doctors)

    highest_rated_doctors = get_highest_rated_doctors(doctors_by_location)

    sorted_doctors = sort_doctors_by_location(highest_rated_doctors, location_list)

    return sorted_doctors

def get_associated_doctors(establishment):
    doctor_establishments = DoctorEstablishment.objects.filter(
        establishment=establishment
    )
    doctors = [
        doctor_establishment.doctor for doctor_establishment in doctor_establishments
    ]
    return doctors

def validate_search_params(query, location):
    errors = {}
    if not query:
        errors["q"] = "q query parameter is required."
    if not location:
        errors["location"] = "location query parameter is required."
    return errors

def get_highest_rated_doctors(doctors_by_location):
    highest_rated_doctors = []
    for doctor in doctors_by_location:
        average_rating = doctor.doctor_feedbacks.aggregate(Avg("rating"))["rating__avg"]
        doctor.average_rating = round(average_rating, 1) if average_rating else 0
        highest_rated_doctors.append(doctor)
    return highest_rated_doctors

def get_average_rating_for_establishment(establishment):
    doctor_establishments = DoctorEstablishment.objects.filter(
        establishment=establishment
    )
    total_rating = 0
    num_doctors = 0
    for doctor_establishment in doctor_establishments:
        doctor = doctor_establishment.doctor
        average_rating = doctor.doctor_feedbacks.aggregate(Avg("rating"))["rating__avg"]
        if average_rating:
            total_rating += average_rating
            num_doctors += 1
    average_rating_for_establishment = (
        total_rating / num_doctors if num_doctors > 0 else 0
    )
    return average_rating_for_establishment

def sort_doctors_by_location(doctors, location_list):
    sorted_doctors = []
    for loc in location_list:
        doctors_in_city = [doctor for doctor in doctors if doctor.address.city == loc]
        sorted_doctors.extend(sorted(doctors_in_city, key=lambda x: -x.average_rating))
    other_doctors = [
        doctor
        for doctor in doctors
        if doctor.address.city not in location_list and doctor not in sorted_doctors
    ]
    sorted_doctors.extend(other_doctors)
    return sorted_doctors

def combine_results(establishments, doctors):
    combined_results = []
    for establishment in establishments:
        combined_results.append({"type": "establishment", "data": establishment})
    for doctor in doctors:
        combined_results.append({"type": "doctor", "data": doctor})
    return combined_results


def sort_combined_results(combined_results):
    sorted_results = sorted(combined_results, key=lambda x: -x["data"].average_rating)
    return sorted_results


def serialize_combined(item, request):
    if item["type"] == "establishment":
        serialized = EstablishmentSearchSerializer(
            item["data"], context={"request": request}
        ).data
    elif item["type"] == "doctor":
        serialized = serialize_doctor(item["data"], request)
    return serialized


def serialize_doctor(doctor, request):
    serialized = {
        "id": doctor.id,
        "type":"doctor",
        "full_name": doctor.full_name,
        "slug": doctor.slug,
        "bio": doctor.bio,
        "gender": doctor.gender,
        "email": doctor.user.email,
        "phone": doctor.phone,
        "avatar": (
            request.build_absolute_uri(doctor.avatar.url) if doctor.avatar else None
        ),
        "specializations": [
            specialization.name for specialization in doctor.specializations.all()
        ],
        "address": DoctorAddressSerializer(doctor.address).data,
        "experience_years": doctor.experience_years,
        "fee": doctor.fee,
        "is_verified": doctor.is_verified,
        "average_rating": doctor.average_rating,
    }
    return serialized


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def suggestions(request):
    search_term = request.GET.get("q")
    if search_term:
        doctors = Doctor.objects.filter(
            Q(full_name__icontains=search_term), is_verified=True
        )
        doctors_data = [
            {"category": "Doctor", "suggestion": doctor.full_name} for doctor in doctors
        ]

        specializations = Specialization.objects.filter(Q(name__icontains=search_term))
        specialization_data = [
            {"category": "Specialization", "suggestion": specialization.name}
            for specialization in specializations
        ]

        establishments = Establishment.objects.filter(Q(name__icontains=search_term))
        establishments_data = [
            {"category": "Establishment", "suggestion": establishment.name}
            for establishment in establishments
        ]

        estab = Establishment.objects.filter(Q(name__icontains=search_term))
        establishments_category_data = [
            {
                "category": "Type",
                "suggestion": establishment_type.establishment_category,
            }
            for establishment_type in estab
        ]

        return Response(
            doctors_data
            + specialization_data
            + establishments_data
            + establishments_category_data
        )
    else:
        return Response({"status": False, "msg": "Invalid search terms"})
