"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { IDoctor } from "@/types/doctor/doctor";
import { Toaster, toast } from "react-hot-toast";
import { doctorService } from "@/services/doctor.service";
import { appointmentService } from "@/services/appointment.service";
import {
  IAppointmentList,
  IAppointmentDetail,
} from "@/types/appointment/appointment";
import dayjs from "dayjs";
import Loader from "@/components/loader";

export default function AppointmentList({
  params,
}: {
  params: { id: number; slug: string };
}) {
  const { slug } = params;
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [appointments, setAppointments] = useState<IAppointmentList>({
    count: 0,
    next: null,
    previous: null,
    loading: true,
    results: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(1);
  const [status, setStatus] = useState(appointments?.results[0]?.status);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorData = await doctorService.getDoctorDetail({ id: slug });
        setDoctor(doctorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDoctorData();
  }, [slug]);

  const page_size = 10;

  useEffect(() => {
    const fetchFeedbackData = async (page: number, page_size: number) => {
      try {
        const feedbacksData: any = await appointmentService.getAppointmentList({
          expand: "patient,doctor",
          doctor: doctor?.id,
          page,
          page_size,
        });
        const calculatedTotalNumberOfPages =
          Math.ceil(feedbacksData.count / page_size) || 1;
        setTotalNumberOfPages(calculatedTotalNumberOfPages);
        setAppointments({ loading: false, ...feedbacksData });
      } catch (error) {
        console.error("Error fetching feedbacks data:", error);
      }
    };
    if (doctor) {
      fetchFeedbackData(currentPage, page_size);
    }
  }, [doctor?.id, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const completeAppointment = async (appointmentId: string) => {
    try {
      const completionData: Partial<IAppointmentDetail> = {
        status: "completed",
      };
      await appointmentService.UpdateAppointmentStatus(
        appointmentId,
        completionData
      );
      toast.success("Appointment marked as completed successfully!");
      setAppointments((prevAppointments) => {
        return {
          ...prevAppointments,
          results: prevAppointments.results.map((appointment) =>
            appointment.id.toString() === appointmentId
              ? { ...appointment, status: completionData.status as "completed" }
              : appointment
          ),
        };
      });
    } catch (error) {
      toast.error("Failed to mark appointment as completed. Please try again.");
    }
  };

  const confirmedAppointment = async (appointmentId: string) => {
    try {
      const confirmedData: Partial<IAppointmentDetail> = {
        status: "confirmed",
      };
      await appointmentService.UpdateAppointmentStatus(
        appointmentId,
        confirmedData
      );
      toast.success("Appointment Confirmed successfully!");
      setAppointments((prevAppointments) => {
        return {
          ...prevAppointments,
          results: prevAppointments.results.map((appointment) =>
            appointment.id.toString() === appointmentId
              ? { ...appointment, status: confirmedData.status as "confirmed" }
              : appointment
          ),
        };
      });
    } catch (error) {
      toast.error("Failed to confirm appointment. Please try again.");
    }
  };
  const rejectAppointment = async (appointmentId: string) => {
    try {
      const rejectData: Partial<IAppointmentDetail> = {
        status: "rejected",
      };
      await appointmentService.UpdateAppointmentStatus(
        appointmentId,
        rejectData
      );
      toast.success("Appointment Rejected successfully!");
      setAppointments((prevAppointments) => {
        return {
          ...prevAppointments,
          results: prevAppointments.results.map((appointment) =>
            appointment.id.toString() === appointmentId
              ? { ...appointment, status: rejectData.status as "rejected" }
              : appointment
          ),
        };
      });
    } catch (error) {
      toast.error("Failed to reject appointment. Please try again.");
    }
  };
  const cancelAppointment = async (appointmentId: string) => {
    try {
      const cancellationData: Partial<IAppointmentDetail> = {
        status: "cancelled",
      };
      await appointmentService.cancelAppointment(
        appointmentId,
        cancellationData
      );
      toast.success("Appointment Cancelled successfully!");
      setAppointments((prevAppointments) => {
        return {
          ...prevAppointments,
          results: prevAppointments.results.map((appointment) =>
            appointment.id.toString() === appointmentId
              ? {
                  ...appointment,
                  status: cancellationData.status as "cancelled",
                }
              : appointment
          ),
        };
      });
    } catch (error) {
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    const day = date.format("D");
    const month = date.format("MMM");
    const year = date.format("YYYY");
    const dayWithSuffix =
      day +
      (["11", "12", "13"].includes(day)
        ? "th"
        : ["1", "21", "31"].includes(day.slice(-1))
        ? "st"
        : ["2", "22"].includes(day.slice(-1))
        ? "nd"
        : ["3", "23"].includes(day.slice(-1))
        ? "rd"
        : "th");

    return `${dayWithSuffix} ${month}, ${year}`;
  };

  const convertToAmPm = (time24: string) => {
    const [hours, minutes] = time24.split(":");
    const time = dayjs(`2000-01-01T${time24}`);
    const amPm = time.format("A");
    const hours12 = time.hour() % 12 || 12;
    return `${hours12}:${minutes} ${amPm}`;
  };

  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <div className="p-8 rounded-md w-full mt-10 mb-72">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h2 className="  text-2xl text-gray-600 font-semibold">
              Appointment list
            </h2>
          </div>
        </div>
        <div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            {appointments.loading ? (
              <Loader />
            ) : (
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="  text-base">
                        Appointment ID
                      </TableHead>
                      <TableHead className="  text-base">
                        Patient Name
                      </TableHead>
                      <TableHead className="  text-base">Date & Time</TableHead>
                      <TableHead className="  text-base">Message</TableHead>
                      <TableHead className="  text-base">Status</TableHead>
                      <TableHead className="  text-base">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments?.results.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="text-base  ">
                          <p className="  text-base text-gray-900 whitespace-no-wrap">
                            {appointment?.id}
                          </p>
                        </TableCell>
                        <TableCell className="text-base  ">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <Image
                                className="object-cover w-10 h-10 rounded-full object-top"
                                src={
                                  (appointment?.patient.avatar as string) ||
                                  "/images/image.png"
                                }
                                alt=""
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="  text-base text-gray-900 whitespace-no-wrap">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="hover:bg-transparent"
                                      variant="ghost"
                                    >
                                      {appointment?.patient.full_name}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle className="  mb-2">
                                        Patient&apos;s details
                                      </DialogTitle>
                                      <Separator />
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <p className=" ">
                                        Name:{" "}
                                        <span className="font-medium">
                                          {appointment?.patient.full_name}
                                        </span>
                                      </p>
                                      <p className="  mt-2">
                                        Contact No:{" "}
                                        <span className="font-medium">
                                          {appointment?.patient.phone}
                                        </span>
                                      </p>
                                      <p className="  mt-2">
                                        Address:{" "}
                                        <span className="font-medium">
                                          {appointment?.patient.address
                                            ?.street &&
                                            appointment.patient.address.street +
                                              ", "}
                                          {appointment?.patient.address?.city &&
                                            appointment.patient.address.city +
                                              ", "}
                                          {appointment?.patient.address?.state}
                                        </span>
                                      </p>
                                      <p className="  mt-2">
                                        Email:{" "}
                                        <span className="font-medium">
                                          {appointment?.patient.email}
                                        </span>
                                      </p>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-base  ">
                          {formatDate(appointment.date)} At{" "}
                          {convertToAmPm(appointment.start_time)}
                        </TableCell>
                        <TableCell className="text-base  ">
                          <p className="  text-base mb-2 text-gray-500">
                            <span className="text-base">
                              {appointment.message}
                            </span>
                          </p>
                        </TableCell>
                        <TableCell className="text-base  ">
                          <p className="  text-base mb-2 text-gray-500">
                            <span
                              className={`  center mt-2 relative inline-block select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline text-xs font-medium uppercase leading-none text-black ${
                                appointment.status === "pending"
                                  ? "border border-yellow-400 text-black"
                                  : appointment.status === "confirmed"
                                  ? "border border-green-400 text-black"
                                  : appointment.status === "rejected"
                                  ? "border border-red-300 text-black"
                                  : appointment.status === "rescheduled"
                                  ? "border border-indigo-400 text-black"
                                  : appointment.status === "cancelled"
                                  ? "border border-red-500 text-black"
                                  : appointment.status === "completed"
                                  ? "border border-blue-400 text-black"
                                  : ""
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </p>
                        </TableCell>

                        <TableCell className="text-base  ">
                          {appointment.status === "pending" && (
                            <p className="buttons mb-5">
                              <button
                                onClick={() =>
                                  completeAppointment(String(appointment.id))
                                }
                                className="  text-sm px-2 py-2 bg-blue-600 text-white rounded-lg tracking-wider hover:bg-blue-500 focus:outline-none"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() =>
                                  confirmedAppointment(String(appointment.id))
                                }
                                className="  ml-1 text-sm mt-6 px-2 py-2 bg-green-600 text-white rounded-lg tracking-wider hover:bg-green-500 focus:outline-none"
                              >
                                Confirmed
                              </button>
                              <button
                                onClick={() =>
                                  rejectAppointment(String(appointment.id))
                                }
                                className="  ml-1 text-sm mt-6 px-2 py-2 border bg-yellow-400 text-black rounded-lg tracking-wider hover:bg-yellow-500 focus:outline-none"
                              >
                                Reject
                              </button>
                              <Dialog
                                open={
                                  appointmentToCancel ===
                                  appointment.id.toString()
                                }
                              >
                                <DialogTrigger asChild>
                                  <button
                                    onClick={() =>
                                      setAppointmentToCancel(
                                        appointment.id.toString()
                                      )
                                    }
                                    className="  ml-1 text-sm mt-6 px-2 py-2 border bg-red-600 text-white rounded-lg tracking-wider hover:bg-red-500 focus:outline-none"
                                  >
                                    Cancel
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle className="  mb-2">
                                      Confirm Cancellation
                                    </DialogTitle>
                                    <Separator />
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <p className=" ">
                                      Are you sure you want to cancel this
                                      appointment?
                                    </p>
                                    <div className="mt-4 flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setAppointmentToCancel(null)
                                        }
                                      >
                                        No, go back
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() =>
                                          cancelAppointment(
                                            String(appointment.id)
                                          )
                                        }
                                      >
                                        Yes, cancel it
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </p>
                          )}

                          {appointment.status === "confirmed" && (
                            <div className="flex mb-5 space-x-2">
                              <button
                                onClick={() =>
                                  completeAppointment(String(appointment.id))
                                }
                                className="  ml-1 text-sm mt-6 px-2 py-2 bg-blue-600 text-white rounded-lg tracking-wider hover:bg-blue-500 focus:outline-none"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() =>
                                  cancelAppointment(String(appointment.id))
                                }
                                className="  ml-1 text-sm mt-6 px-2 py-2 border bg-red-600 text-white rounded-lg tracking-wider hover:bg-red-500 focus:outline-none"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {(appointment.status === "cancelled" ||
                            appointment.status === "completed") && <p></p>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {appointments && appointments.results.length > page_size && (
              <div className="flex mt-5 justify-center text-center">
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
                          currentPage === totalNumberOfPages
                            ? "cursor-auto"
                            : ""
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
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
