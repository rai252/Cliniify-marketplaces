from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from datetime import datetime, timedelta

from users.serializers import User, UserSerializer
from doctors.serializers import DoctorSerializer
from patients.serializers import PatientSerializer
from .models import Appointment
from doctors.models import Doctor
from establishments.serializers import EstablishmentSerializer 

class AppointmentSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Appointment
        fields = (
            "id",
            "doctor",
            "patient",
            "establishment",
            "date",
            "start_time",
            "end_time",
            "duration",
            "status",
            "message",
            "requested_at",
            "confirmed_at",
            "is_rescheduled",
            "reschedule_reason",
            "is_paid",
        )
        read_only_fields = ("id",)
        expandable_fields = {
            "doctor": (DoctorSerializer, {'expand': ['address']}),
            "patient": (PatientSerializer, {'expand': ['address']}),
            "establishment": (EstablishmentSerializer, {'expand': ['address']})
        }

    def create(self, validated_data):
        doctor = validated_data.get("doctor")
        start_time = validated_data.get("start_time")
        date = validated_data.get("date")

        doctor_data = None

        if doctor and start_time:
            conflicting_appointments = Appointment.objects.filter(
                doctor=doctor,date=date, start_time=start_time
            )

            if conflicting_appointments.exists():
                raise serializers.ValidationError(
                    "An appointment is already scheduled for this doctor at the specified start time."
                )
        
        if doctor:
            if isinstance(doctor, Doctor) and hasattr(doctor, "id"):
                doctor_id = doctor.id
            else:
                raise serializers.ValidationError(
                    "Doctor object must have an 'id' attribute."
                )

            doctor_data = Doctor.objects.get(id=doctor_id)
            duration_str = doctor_data.time_duration
            duration_parts = duration_str.split(":")
            duration_hours = int(duration_parts[0])
            duration_minutes = int(duration_parts[1])
            duration_time = timedelta(hours=duration_hours, minutes=duration_minutes)

            start_datetime = datetime.combine(datetime.today(), start_time)
            end_datetime = start_datetime + duration_time
            validated_data["end_time"] = end_datetime.time()

        if doctor_data and doctor_data.auto_confirm:
            if validated_data.get("status") != "confirmed":
                validated_data["status"] = "confirmed"
                validated_data["confirmed_at"] = datetime.now()

        return Appointment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        doctor = validated_data.get("doctor")
        start_time = validated_data.get("start_time")
        date = validated_data.get("date")
        is_rescheduled = validated_data.get("is_rescheduled", False)

        doctor_data = None

        if doctor and start_time:
            conflicting_appointments = Appointment.objects.filter(
                doctor=doctor,date=date, start_time=start_time
            ).exclude(id=instance.id)

            if conflicting_appointments.exists():
                raise serializers.ValidationError(
                    "An appointment is already scheduled for this doctor at the specified start time."
                )
        
        if doctor:
            if isinstance(doctor, Doctor) and hasattr(doctor, "id"):
                doctor_id = doctor.id
            else:
                raise serializers.ValidationError(
                    "Doctor object must have an 'id' attribute."
                )
            doctor_data = Doctor.objects.get(id=doctor_id)
            duration_str = doctor_data.time_duration
            duration_parts = duration_str.split(":")
            duration_hours = int(duration_parts[0])
            duration_minutes = int(duration_parts[1])
            duration_time = timedelta(hours=duration_hours, minutes=duration_minutes)

            start_datetime = datetime.combine(datetime.today(), start_time)
            end_datetime = start_datetime + duration_time
            validated_data["end_time"] = end_datetime.time()

        if is_rescheduled:
            validated_data["status"] = "pending"

        if doctor_data and doctor_data.auto_confirm:
            if validated_data.get("status") != "confirmed":
                validated_data["status"] = "confirmed"
                validated_data["confirmed_at"] = datetime.now()

        return super().update(instance, validated_data)


# class AppointmentSerializer(FlexFieldsModelSerializer):
#     class Meta:
#         model = Appointment
#         fields = (
#             "id",
#             "doctor",
#             "patient",
#             "date",
#             "start_time",
#             "end_time",
#             "duration",
#             "status",
#             "requested_at",
#             "confirmed_at",
#             "is_rescheduled",
#             "reschedule_reason",
#             "is_paid",
#         )
#         read_only_fields = ("id",)
#         expandable_fields = {
#             "doctor": DoctorSerializer,
#             "patient": PatientSerializer,
#         }

#     def create(self, validated_data):
#         doctor = validated_data.get("doctor")
#         start_time = validated_data.get("start_time")

#         # Ensure that the doctor is a Doctor object and has an id attribute
#         if isinstance(doctor, Doctor) and hasattr(doctor, 'id'):
#             doctor_id = doctor.id
#         else:
#             raise serializers.ValidationError("Doctor object must have an 'id' attribute.")

#         doctor_data = Doctor.objects.get(id=doctor_id)
#         duration_str = doctor_data.time_duration
#         duration_parts = duration_str.split(":")
#         duration_hours = int(duration_parts[0])
#         duration_minutes = int(duration_parts[1])
#         duration_time = timedelta(hours=duration_hours, minutes=duration_minutes)

#         start_datetime = datetime.combine(datetime.today(), start_time)
#         end_datetime = start_datetime + duration_time
#         validated_data["end_time"] = end_datetime.time()

# # Check if the doctor's auto_confirm field is True
# if doctor_data.auto_confirm:
#     validated_data["status"] = "confirmed"
#     validated_data["confirmed_at"] = datetime.now()

#         return Appointment.objects.create(**validated_data)

#     def update(self, instance, validated_data):
#         doctor = validated_data.get("doctor")
#         start_time = validated_data.get("start_time")

#         # Ensure that the doctor is a Doctor object and has an id attribute
#         if isinstance(doctor, Doctor) and hasattr(doctor, 'id'):
#             doctor_id = doctor.id
#         else:
#             raise serializers.ValidationError("Doctor object must have an 'id' attribute.")

#         doctor_data = Doctor.objects.get(id=doctor_id)
#         duration_str = doctor_data.time_duration
#         duration_parts = duration_str.split(":")
#         duration_hours = int(duration_parts[0])
#         duration_minutes = int(duration_parts[1])
#         duration_time = timedelta(hours=duration_hours, minutes=duration_minutes)

#         start_datetime = datetime.combine(datetime.today(), start_time)
#         end_datetime = start_datetime + duration_time
#         validated_data["end_time"] = end_datetime.time()

# # Check if the doctor's auto_confirm field is True
# if doctor_data.auto_confirm:
#     validated_data["status"] = "confirmed"
#     validated_data["confirmed_at"] = datetime.now()

#         return super().update(instance, validated_data)
