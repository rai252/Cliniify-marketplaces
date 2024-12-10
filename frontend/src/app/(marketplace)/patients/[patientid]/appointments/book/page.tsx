"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { doctorService } from "@/services/doctor.service";
import { IDoctor } from "@/types/doctor/doctor";
import { IUser } from "@/types/user/user";
import { userService } from "@/services/user.service";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { appointmentService } from "@/services/appointment.service";
import { IAppointment } from "@/types/appointment/appointment";
import { IPatient } from "@/types/patient/patient";
import { patientService } from "@/services/patient.service";
import dayjs from "dayjs";
import { Textarea } from "@/components/ui/textarea";

const fetchCurrentUser = async () => {
  try {
    const response = await userService.getcurrentUser();
    return response;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export default function Doctor() {
  const router = useRouter();
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "booking" | "success" | "error"
  >("idle");
  const [doctorDetails, setDoctorDetails] = useState<IDoctor | null>(null);
  const [patient, setPatient] = useState<IPatient | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("d");
  const date = searchParams.get("date");
  const timeSlot = searchParams.get("timeSlot");
  const fee = searchParams.get("fee");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await doctorService.getDoctorDetail({ id: doctorId });
        setDoctorDetails(response);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  useEffect(() => {
    const fetchCurrentUserAndData = async () => {
      try {
        const userData = await fetchCurrentUser();
        setCurrentUser(userData);

        if (userData.patient_id) {
          const patientData = await patientService.getPatient({
            patientid: userData.patient_id,
            expand: "user",
          });
          setPatient(patientData);
        }
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };
    fetchCurrentUserAndData();
  }, []);

  const confirmVisit = async () => {
    try {
      setBookingStatus("booking");

      if (!doctorId || !currentUser?.id || !date || !timeSlot || !fee) {
        setBookingStatus("error");
        return;
      }

      const appointmentData: IAppointment = {
        doctor: Number(doctorDetails?.id),
        patient: patient?.id || 0,
        date: date,
        start_time: timeSlot,
        message: message,
      };

      const createdAppointmentId = await appointmentService.bookAppointment(
        appointmentData
      );

      setBookingStatus("success");
      router.push(`/patients/${patient?.id}/appointments/`);
    } catch (error: any) {
      toast.error(error);
      console.error("Error submitting feedback:", error);
      setBookingStatus("error");
    }
  };

  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return "";

    const date = dayjs(dateString);
    const day: number = date.date();
    const suffix: string = getDaySuffix(day);
    const month: string = date.format("MMM");
    const year: number = date.year();

    return `${day}${suffix}, ${month} ${year}`;
  }

  function time(timeString: string | null): string {
    if (!timeString) return "";

    const time = dayjs(`2000-01-01T${timeString}`);
    const hours = time.hour();
    const minutes = time.minute();
    const amPM = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${amPM}`;
  }

  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <section className="doctor-section">
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <div className="max-w-screen-md mx-auto p-5 border rounded-lg mt-20 bg-white">
              <div className="w-full mb-4">
                <div className="bg-green-100 p-5 flex items-center">
                  <div className="flex-1">
                    <p className="  text-lg font-semibold text-black-500">
                      Date: {formatDate(date)}
                    </p>
                  </div>
                  <div className="flex-1 text-end">
                    <p className="  text-lg font-semibold text-black-500">
                      At {time(timeSlot)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-full mb-4">
                <div className="md:flex-1 pr-0 md:pr-2">
                  <div className="bg-white-100 p-5">
                    <div className="flex mb-4">
                      <div className="  sm:mr-5 w-40 object-top">
                        <Image
                          src={
                            typeof doctorDetails?.avatar === "string"
                              ? doctorDetails?.avatar
                              : "/images/doctor-image.webp"
                          }
                          alt=""
                          className="object-cover w-28 h-28 sm:w-28 sm:h-28 rounded-lg"
                          width={160}
                          height={160}
                        />
                      </div>
                      <div className="ml-3 md:ml-5">
                        <h2 className="  text-lg font-semibold mb-2">
                          {doctorDetails?.full_name}
                        </h2>
                        <p className="  text-base text-gray-500 mb-2 ">
                          Specialty:{" "}
                          <span className="text-black  ">
                            {doctorDetails?.specializations.map(
                              (specialization) => (
                                <span key={specialization.id}>
                                  {specialization.name || "not available"}
                                </span>
                              )
                            )}
                          </span>
                        </p>
                        <p className="  text-base text-gray-500">
                          Experience:{" "}
                          <span className="text-black  ">
                            {doctorDetails?.experience_years} Years of
                            experience
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-px bg-gray-300 hidden md:block"></div>
                <div className="md:flex-1 pl-0 md:pl-2">
                  <div className="bg-white-100 p-5">
                    <div>
                      <h2 className="  text-lg font-semibold mb-2">
                        Clinic Details
                      </h2>
                      <p className="  text-base text-gray-500 mb-2">
                        Address:{" "}
                        <span className="text-black">
                          {doctorDetails?.associated_establishment.map((e) => (
                            <span key={e.slug}>
                              {e.address.address_line_1},{" "}
                              {e.address.address_line_2}, {e.address.city},
                              {e.address.state}, {e.address.pincode}
                            </span>
                          ))}
                        </span>
                      </p>
                      <p className="  text-base text-gray-500 mb-2">
                        Phone:
                        {doctorDetails?.phone && (
                          <span className="text-black">
                            &nbsp;+91-{doctorDetails?.phone}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="bg-gray-100 p-4 mb-1">
                  <h2 className="  text-base font-semibold mb-0">
                    Patient Details
                  </h2>
                </div>
                <div className="bg-white-100 p-5 mb-4 md:flex md:flex-row items-start">
                  <div className="md:flex-1 md:pr-2 mb-4 md:mb-0">
                    <div className="mb-4">
                      <div className="ml-3 md:ml-0">
                        <div className="mb-4">
                          <label htmlFor="name" className="block mb-2  ">
                            Full Name
                          </label>
                          <Input
                            name="full_name"
                            value={patient?.full_name || ""}
                            className="w-full bg-slate-100 focus-visible:ring-transparent"
                            readOnly
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="name" className="block mb-2  ">
                            Your Email
                          </label>
                          <Input
                            name="email"
                            value={patient?.user?.email || ""}
                            className="w-full bg-slate-100 focus-visible:ring-transparent"
                            readOnly
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="name" className="block mb-2  ">
                            Message
                          </label>
                          <Textarea
                            className="  focus-visible:ring-transparent"
                            placeholder="Enter your message here..."
                            style={{
                              width: "100%",
                              height: "150px",
                              margin: "10px 0",
                              padding: "10px",
                              fontSize: "0.9em",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                            }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="button">
                      <Button
                        className="w-full mb-5 bg-cyan-900 text-white transition-colors duration-300 ease-in-out border border-gray-300"
                        onClick={confirmVisit}
                        disabled={bookingStatus === "booking"}
                      >
                        {bookingStatus === "booking"
                          ? "Booking..."
                          : "Confirm Clinic Visit"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Toaster position="top-right" />
    </div>
  );
}
