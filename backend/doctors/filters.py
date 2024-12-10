import django_filters 
from django_filters import OrderingFilter
from .models import Doctor
from django.db.models import Avg, Case, When, Value, FloatField

class DoctorFilter(django_filters.FilterSet):
    FEE_CHOICES = [
        ('0to500', 'Less than ₹500'),
        ('500', '₹500 - ₹700'),
        ('700', '₹700 - ₹900'),
        ('1000', 'Above ₹1000'),
    ]

    EXPERIENCE_CHOICES = [
        ('1', '1+ Years of experience'),
        ('5', '5+ Years of experience'),
        ('10', '10+ Years of experience'),
        ('15', '15+ Years of experience'),
        ('20', '20+ Years of experience'),
    ]

    RATING_CHOICES = [
        ('5', '5★'),
        ('4', '4★ & above'),
        ('3', '3★ & above'),
        ('2', '2★ & above'),
        ('1', '1★ & above'),
    ]

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    fee = django_filters.ChoiceFilter(
        field_name='fee',
        choices=FEE_CHOICES,
        method='filter_fee'
    )

    experience_years = django_filters.ChoiceFilter(
        field_name='experience_years',
        choices=EXPERIENCE_CHOICES,
        method='filter_experience_years'
    )

    average_rating = django_filters.ChoiceFilter(
        label='Average Rating',
        choices=RATING_CHOICES,
        method='filter_average_rating'
    )

    gender = django_filters.ChoiceFilter(
        field_name='gender',
        label='Gender',
        choices=GENDER_CHOICES,
        method='filter_gender'
    )

    ordering = OrderingFilter(
        fields=(
            ('experience_years', 'Experience'),
            ('fee', 'Consultation Fee'),
        ),
        field_labels={
            'experience_years': 'Experience',
            'fee': 'Consultation Fee',
        }
    )

    def filter_fee(self, queryset, name, value):
       if value == '0to500':
           return queryset.filter(fee__lt=500)
       elif value == '500':
           return queryset.filter(fee__gte=500)
       elif value == '700':
           return queryset.filter(fee__gte=700)
       elif value == '1000':
           return queryset.filter(fee__gte=1000)
       return queryset

    def filter_experience_years(self, queryset, name, value):
       if value == '1':
           return queryset.filter(experience_years__gte=1)
       elif value == '5':
           return queryset.filter(experience_years__gte=5)
       elif value == '10':
           return queryset.filter(experience_years__gte=10)
       elif value == '15':
           return queryset.filter(experience_years__gte=15)
       elif value == '20':
           return queryset.filter(experience_years__gte=20)
       return queryset

    def filter_average_rating(self, queryset, name, value):
    # Annotate the queryset with the calculated average_rating
        annotated_qs = queryset.annotate(
            average_rating=Case(
                When(doctor_feedbacks__rating__isnull=True, then=Value(0.0)),
                default=Avg('doctor_feedbacks__rating'),
                output_field=FloatField()
            )
        )
        if value == '5':
            return annotated_qs.filter(average_rating=5.0)
        elif value == '4':
            return annotated_qs.filter(average_rating__gte=4.0)
        elif value == '3':
            return annotated_qs.filter(average_rating__gte=3.0)
        elif value == '2':
            return annotated_qs.filter(average_rating__gte=2.0)
        elif value == '1':
            return annotated_qs.filter(average_rating__gte=1.0)
        return annotated_qs

    def filter_gender(self, queryset, name, value):
        if value in ['M', 'F', 'O']:
            return queryset.filter(gender=value)
        return queryset

    class Meta:
        model = Doctor
        fields = ['fee', 'experience_years', 'average_rating', 'gender', 'specializations']
