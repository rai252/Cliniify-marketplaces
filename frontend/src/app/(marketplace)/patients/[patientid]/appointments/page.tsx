"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { Toaster, toast } from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { IAppointmentList } from "@/types/appointment/appointment";
import { appointmentService } from "@/services/appointment.service";
import { IAppointmentDetail } from "@/types/appointment/appointment";
import { Button } from "@/components/ui/button";
import { FaHandPointLeft } from "react-icons/fa";
import Loader from "@/components/loader";

export default function Doctor() {
  const [appointmentList, setAppointmentList] = useState<
    IAppointmentList | undefined
  >({ count: 0, next: null, previous: null, loading: true, results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(1);
  const page_size = 10;

  const fetchData = async (page: number, page_size: number) => {
    try {
      const appointmentData = await appointmentService.getAppointmentList({
        expand: "patient,doctor",
        page,
        page_size,
      });

      const calculatedTotalNumberOfPages =
        Math.ceil(appointmentData.count / page_size) || 1;
      setTotalNumberOfPages(calculatedTotalNumberOfPages);
      setAppointmentList(appointmentData);
    } catch (error) {
      console.error("Error fetching appointment list:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, page_size);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

  function formatDate(dateString: string | undefined): string {
    if (!dateString) return "";

    const date = dayjs(dateString);
    const day: number = date.date();
    const suffix: string = getDaySuffix(day);
    const month: string = date.format("MMM");
    const year: number = date.year();

    return `${day}${suffix}, ${month} ${year}`;
  }

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const cancellationData: Partial<IAppointmentDetail> = {
        status: "cancelled",
      };
      await appointmentService.cancelAppointment(
        appointmentId,
        cancellationData
      );
      fetchData(currentPage, page_size);
      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    }
  };

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
    <div className="main-section bg-slate-50 min-h-screen flex flex-col justify-between">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>

      <div className="feedback-form container mt-20 mb-14 flex-grow">
        {appointmentList?.loading ? (
          <Loader />
        ) : appointmentList?.results.length === 0 ? (
          <div className="no-appointment-booking-image text-center flex flex-col items-center justify-center">
            <h1 className="  text-3xl font-medium text-teal-800 mb-10">
              No appointments!
            </h1>
            <Image
              src="/images/no-appointment.jpg"
              alt="appointment"
              height={700}
              width={700}
            />
            <div className="flex items-center flex-wrap mt-10">
              <Link href={`/doctors`}>
                <Button className="  text-base">
                  <FaHandPointLeft />
                  &nbsp; Find Doctors
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap -m-4">
            {appointmentList?.results.map((appointment, index) => (
              <div
                key={index}
                className="p-4 sm:w-1/2 w-full hover:scale-105 duration-500"
              >
                <div className="flex items-center justify-between p-4 rounded-lg shadow-gray-300 shadow-2xl bg-white">
                  <div className="w-full">
                    <div className="  text-lg font-semibold text-gray-600 mb-3 flex justify-between">
                      <p>Appointment on {formatDate(appointment.date)}</p>
                      <p className="  text-sm text-gray-600">
                        Time: &nbsp;
                        {time(appointment?.start_time)}
                      </p>
                    </div>
                    <Separator className="border border-slate-100" />
                    {appointment.doctor && (
                      <div className="w-full mt-5">
                        <p className="  font-medium text-base text-gray-500 mb-2">
                          Doctor:{" "}
                          <span className="  text-black font-medium text-base">
                            <Link
                              href={`/doctors/${appointment?.doctor?.slug}`}
                            >
                              {appointment.doctor?.full_name}
                            </Link>
                            &nbsp;
                            {appointment.doctor.specializations.map(
                              (specialization) => (
                                <span
                                  key={specialization.id}
                                  className="  font-medium text-base text-slate-700"
                                >
                                  ({specialization.name})
                                </span>
                              )
                            )}
                          </span>
                        </p>
                        <p className="  font-medium text-base mb-2 text-gray-500">
                          Status:&nbsp;
                          <span
                            className={`  center relative inline-block select-none whitespace-nowrap rounded-lg py-1 px-2 align-baseline text-xs font-bold uppercase leading-none text-white ${
                              appointment.status === "pending"
                                ? "bg-yellow-500 text-white"
                                : appointment.status === "confirmed"
                                ? "bg-green-500 text-white"
                                : appointment.status === "rejected"
                                ? "bg-red-500 text-black"
                                : appointment.status === "rescheduled"
                                ? "bg-indigo-500 text-black"
                                : appointment.status === "cancelled"
                                ? "bg-red-500 text-black"
                                : ""
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </p>
                        <p className="  font-medium text-base text-gray-500 mb-2">
                          Location:{" "}
                          <span className="text-black font-medium text-base">
                            {appointment?.doctor.address.city &&
                              appointment?.doctor.address.city + ", "}
                            {appointment?.doctor.address.state}
                          </span>
                        </p>
                      </div>
                    )}
                    <div className="flex justify-start mt-2">
                      <Link
                        href={`/patients/${appointment?.patient?.id}/appointments/${appointment.id}/`}
                      >
                        <button className="  text-sm font-medium mt-6 px-4 py-2 border border-teal-600 text-black hover:text-white rounded-lg tracking-wider hover:bg-teal-600 focus:outline-none">
                          View Detail
                        </button>
                      </Link>

                      {appointment.status === "confirmed" && (
                        <div className="flex">
                          <Link
                            href={`/patients/${appointment?.patient?.id}/appointments/${appointment.id}/reshedule/`}
                          >
                            <button className="  ml-2 text-sm font-medium mt-6 px-4 py-2 border border-yellow-400 text-black rounded-lg tracking-wider hover:bg-yellow-300 focus:outline-none">
                              Reschedule
                            </button>
                          </Link>
                          <button
                            onClick={() =>
                              cancelAppointment(String(appointment?.id))
                            }
                            className="  ml-2 text-sm font-medium mt-6 px-4 py-2 border border-red-600 text-black hover:text-white rounded-lg tracking-wider hover:bg-red-500 focus:outline-none"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {appointment.status === "pending" && (
                        <button
                          onClick={() =>
                            cancelAppointment(String(appointment?.id))
                          }
                          className="  ml-2 text-sm font-medium  mt-6 px-4 py-2 border border-red-600 text-black hover:text-white rounded-lg tracking-wider hover:bg-red-500 focus:outline-none"
                        >
                          Cancel
                        </button>
                      )}

                      {appointment.status === "rejected" && (
                        <Link
                          href={`/patients/${appointment?.patient?.id}/appointments/${appointment?.id}/reshedule/`}
                        >
                          <button className="  ml-2 text-sm font-medium mt-6 px-4 py-2 border border-yellow-400 text-black rounded-lg tracking-wider hover:border-yellow-300 focus:outline-none">
                            Reschedule
                          </button>
                        </Link>
                      )}

                      {appointment.status === "cancelled" && (
                        <Link
                          href={`/patients/${appointment?.patient?.id}/appointments/${appointment?.id}/reshedule/`}
                        >
                          <button className="  ml-2 text-sm font-medium mt-6 px-4 py-2 border border-yellow-400 text-black rounded-lg tracking-wider hover:bg-yellow-300 focus:outline-none">
                            Reschedule
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {appointmentList && appointmentList.results.length > 0 && (
          <div className="flex justify-center items-center mt-20">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={`cursor-pointer ${
                      currentPage === 1 ? "cursor-auto" : ""
                    }`}
                    onClick={
                      currentPage === 1
                        ? undefined
                        : () => handlePageChange(currentPage - 1)
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalNumberOfPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                      className={`cursor-pointer ${
                        index + 1 === currentPage
                          ? "hover:bg-teal-500 hover:text-white border-teal-500"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className={`cursor-pointer ${
                      currentPage === totalNumberOfPages ? "cursor-auto" : ""
                    }`}
                    onClick={
                      currentPage === totalNumberOfPages
                        ? undefined
                        : () => handlePageChange(currentPage + 1)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
