"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IAppointmentDetail } from "@/types/appointment/appointment";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { patientService } from "@/services/patient.service";
import { IDoctor } from "@/types/doctor/doctor";
import { IPatient } from "@/types/patient/patient";
import dayjs from "dayjs";
import Image from "next/image";

export default function AppointmentDetail({
  params,
}: {
  params: { appointmentid: number };
}) {
  const router = useRouter();
  const appointmentid = params?.appointmentid;
  const [appointment, setAppointment] = useState<IAppointmentDetail | null>(
    null
  );
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [patient, setPatient] = useState<IPatient | null>(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const AppointmentData = await appointmentService.getAppointmentDetail({
          appointmentid,
        });
        setAppointment(AppointmentData);

        const { doctor, patient } = AppointmentData;

        const doctorData = await doctorService.getDoctorDetail({ id: doctor });
        setDoctor(doctorData);

        const patientData = await patientService.getPatient({
          patientid: patient,
        });
        setPatient(patientData);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchAppointmentData();
  }, [appointmentid]);

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

  function formatDate(dateString: string | undefined): string {
    if (!dateString) return "";

    const date = dayjs(dateString);
    const day: number = date.date();
    const suffix: string = getDaySuffix(day);
    const month: string = date.format("MMM");
    const year: number = date.year();

    return `${day}${suffix}, ${month} ${year}`;
  }

  function time(timeString: string | undefined): string {
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
      <section className="appointment-section bg-slate-50">
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <div className="max-w-screen-md mx-auto p-5 border rounded-lg mt-20 bg-white">
              <div className="w-full mb-4">
                <div className="bg-slate-100 p-5 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-slate-600 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 1C4.48 1 0 5.48 0 11s4.48 10 10 10 10-4.48 10-10S15.52 1 10 1zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM8.71 13.29l-2.5-2.5 1.29-1.29 1.21 1.21 4.29-4.29 1.29 1.29-5.5 5.5z" />
                  </svg>
                  &nbsp;&nbsp;
                  <div className="flex-1">
                    <h2 className="  text-lg font-semibold mb-0 text-slate-600">
                      Appointment{" "}
                      <span
                        className={`rounded-md px-2 py-1 ${
                          appointment?.status === "pending"
                            ? "bg-yellow-500 text-white text-sm  "
                            : appointment?.status === "confirmed"
                            ? "bg-blue-500 text-white text-sm  "
                            : appointment?.status === "rejected"
                            ? "bg-red-500 text-black text-sm  "
                            : appointment?.status === "rescheduled"
                            ? "bg-orange-500 text-black text-sm  "
                            : appointment?.status === "cancelled"
                            ? "bg-red-500 text-black text-sm  "
                            : ""
                        }`}
                      >
                        {appointment?.status}
                      </span>
                    </h2>
                  </div>
                  <div className="flex-1 text-end">
                    <p className="  text-lg font-medium text-black-500">
                      On {formatDate(appointment?.date)} At{" "}
                      {time(appointment?.start_time)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-full mb-4">
                <div className="md:flex-2 pr-0 md:pr-2">
                  <div className="bg-white-100 p-5">
                    <div className="flex mb-4">
                      <div className="  sm:mr-5">
                        <Image
                          src={
                            typeof doctor?.avatar === "string"
                              ? doctor.avatar
                              : "/images/doctor-image.webp"
                          }
                          alt=""
                          className="object-cover w-28 h-28 sm:w-28 sm:h-28 rounded-lg"
                          width={500}
                          height={500}
                        />
                      </div>
                      <div className="ml-3 md:ml-5">
                        <h2 className="  text-lg font-semibold mb-2">
                          {doctor?.full_name}
                        </h2>
                        <span className="  text-base text-slate-500">
                          Specialization:
                          {doctor?.specializations.map((specialization) => (
                            <span
                              key={specialization.id}
                              className="  text-base text-black mb-2"
                            >
                              {" "}
                              {specialization.name || "Not Available"}
                            </span>
                          ))}
                        </span>
                        <p className="  text-base text-gray-500">
                          Experience:{" "}
                          <span className="text-black">
                            {doctor?.experience_years} Years of experience
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-px bg-gray-300 hidden md:block"></div>
                <div className="md:flex-0 pl-0 md:pl-2">
                  <div className="bg-white-100 p-5">
                    <div>
                      <h2 className="  text-lg font-semibold mb-2">
                        Clinic Details
                      </h2>
                      <p className="  text-base text-gray-500 mb-2">
                        Address:{" "}
                        <span className="text-black">
                          {doctor?.associated_establishment.map((e) => (
                            <span key={e.slug}>
                              {e.address.address_line_1},{" "}
                              {e.address.address_line_2}, {e.address.city},
                              {e.address.state}, {e.address.pincode}
                            </span>
                          ))}
                        </span>
                      </p>
                      <p className="  text-base text-gray-500 mb-2">
                        Phone:{" "}
                        <span className="text-black">+91-{doctor?.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="bg-gray-100 p-4 mb-5">
                  <h2 className="  text-lg font-medium mb-0">
                    Patient Details
                  </h2>
                </div>
                <div className="bg-white-100 p-2 md:flex md:flex-row items-start">
                  <div className="md:flex-1 md:pr-2 md:mb-0">
                    <div className="flex mb-4">
                      <div className="ml-3 md:ml-0">
                        <p className="  text-lg text-teal-700 font-medium mb-5">
                          Your appointment ID is {appointment?.id}
                        </p>
                        <p className="  text-base text-gray-500 mb-2">
                          Patient Name:{" "}
                          <span className="text-black">
                            {patient?.full_name}
                          </span>
                        </p>
                        <p className="  text-base text-gray-500 mb-2">
                          Mobile No:{" "}
                          <span className="text-black">
                            +91-{patient?.phone}
                          </span>
                        </p>
                        <p className="  text-base text-gray-500 mb-2">
                          Age:{" "}
                          <span className="text-black">{patient?.age}</span>
                        </p>
                        <p className="  text-base text-gray-500 mb-2">
                          Gender:{" "}
                          <span className="text-black">{patient?.gender}</span>
                        </p>
                        <p className="  text-base text-gray-500 mb-2">
                          Message:{" "}
                          <span className="text-black">
                            {appointment?.message}
                          </span>
                        </p>
                      </div>
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
