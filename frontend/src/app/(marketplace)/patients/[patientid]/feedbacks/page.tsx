"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHandPointLeft, FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IPatient } from "@/types/patient/patient";
import { IFeedbackList } from "@/types/feedback/feedback";
import { feedbackService } from "@/services/feedback.service";
import { patientService } from "@/services/patient.service";
import dayjs from "dayjs";
import Loader from "@/components/loader";

export default function FeedbackList({
  params,
}: {
  params: { patientid: number };
}) {
  const { patientid } = params;
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [feedbacks, setFeedbackList] = useState<IFeedbackList | null>({
    count: 0,
    next: null,
    previous: null,
    loading: true,
    results: [],
  });
  const [patientId, setPatientId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(1);
  const [readMore, setreadMore] = useState<number | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientData = await patientService.getPatient({ patientid });
        setPatient(patientData);
        setPatientId(patientData.id);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchPatientData();
  }, [patientid]);

  const page_size = 10;

  useEffect(() => {
    const fetchFeedbackData = async (page: number, page_size: number) => {
      try {
        const feedbacksData: any = await feedbackService.getFeedbacks({
          expand: "patient,doctor",
          patient: patient?.id,
          page,
          page_size,
        });
        const calculatedTotalNumberOfPages =
          Math.ceil(feedbacksData.count / page_size) || 1;
        setTotalNumberOfPages(calculatedTotalNumberOfPages);
        setFeedbackList(feedbacksData);
      } catch (error) {
        console.error("Error fetching feedbacks data:", error);
      }
    };
    if (patient) {
      fetchFeedbackData(currentPage, page_size);
    }
  }, [patient?.id, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id: number) => {
    try {
      await feedbackService.deleteFeedback(id);
      toast.success("Feedback deleted successfully!");
      setFeedbackList((prevFeedbackList) => {
        if (!prevFeedbackList) {
          return prevFeedbackList;
        }
        const updatedFeedbackList = prevFeedbackList.results.filter(
          (feedback) => feedback.id !== id
        );
        const updatedFeedbackData: IFeedbackList = {
          ...prevFeedbackList,
          results: updatedFeedbackList,
        };
        return updatedFeedbackData;
      });
    } catch (error) {
      toast.error("Failed to delete feedback!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    const formattedDate = date.format("MMMM D, YYYY");
    const month = date.format("MMM");
    return `${month}, ${formattedDate.split(", ")[1]}`;
  };

  const formatDatefordate = (dateString: string) => {
    const date = dayjs(dateString);
    const day = date.format("D");
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
    return `${dayWithSuffix}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = dayjs(dateString);
    const days = dayjs().diff(date, "day");
    const months = dayjs().diff(date, "month");

    if (months > 0) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else if (days >= 7) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else if (days >= 1) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return "Today";
    }
  };

  const toggleFeedback = (feedbackId: number) => {
    setreadMore((prevId) => (prevId === feedbackId ? null : feedbackId));
  };

  return (
    <div className="main-section">
      <div className="relative isolate lg:px-8">
        <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
      </div>
      <section className="feedback-section mt-8 bg-slate-50">
        <div className="flex flex-col mt-5 container mx-auto">
          <div className="p-4 w-full mt-10">
            {feedbacks?.loading ? (
              <Loader />
            ) : feedbacks?.results.length === 0 ? (
              <div className="no-appointment-booking-image text-center flex flex-col items-center justify-center mb-10">
                <h1 className="  text-3xl font-medium text-teal-800 mb-10 mt-10">
                  No Feedbacks!
                </h1>
                <Image
                  src="/images/no-feedback.jpg"
                  alt="appointment"
                  height={500}
                  width={500}
                />
                <div className="flex items-center flex-wrap mt-10">
                  <Link href={`/`}>
                    <Button className="  text-base">
                      <FaHandPointLeft />
                      &nbsp; Back to home
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {feedbacks?.results.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="mb-2 shadow-lg rounded-3xl overflow-hidden"
                  >
                    <div className="pt-3 pb-3 md:pb-1 px-4 md:px-16 bg-gray-50">
                      <div className="flex flex-wrap items-center">
                        <div className="mr-4 w-14 h-14 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                          <Image
                            className="h-10 w-10 object-cover object-top rounded-full"
                            src={
                              typeof feedback.doctor?.avatar === "string"
                                ? feedback.doctor?.avatar
                                : "/images/doctor-image.webp"
                            }
                            alt=""
                            height={50}
                            width={50}
                          />
                        </div>
                        <h4 className="  w-full md:w-auto text-xl font-heading font-medium mt-5 md:mt-0">
                          <Link href={`/doctors/${feedback?.doctor?.slug}`}>
                            <span className="text-teal-700">
                              {feedback.doctor?.full_name}
                            </span>{" "}
                            {feedback.doctor?.specializations?.map(
                              (Speciality) => (
                                <span
                                  key={Speciality.id}
                                  className="  text-base text-gray-500"
                                >
                                  ({Speciality.name})
                                </span>
                              )
                            )}
                          </Link>
                        </h4>
                        <div className="w-full md:w-px h-2 md:h-8 mx-8 bg-transparent md:bg-gray-200"></div>
                        <span className="  text-gray-700 mr-4 text-xl font-heading font-medium">
                          {feedback.rating % 1 === 0
                            ? `${feedback.rating}.0`
                            : feedback.rating}
                        </span>
                        <div className="inline-flex">
                          <span
                            className="flex align-center"
                            style={{
                              marginBottom: "4px",
                              marginLeft: "-3px",
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                style={{
                                  color:
                                    star <= feedback.rating
                                      ? "#FDCC0D"
                                      : "#D3D3D3",
                                  fontSize: "20px",
                                  marginRight: "5px",
                                  cursor: "pointer",
                                }}
                              />
                            ))}
                          </span>
                        </div>
                        <div className="w-full md:w-px h-2 md:h-8 mx-8 bg-transparent md:bg-gray-200"></div>
                        <div className="inline-flex">
                          <p className="text-base font-bold text-gray-600">
                            Date: {formatDatefordate(feedback.comment_at)}{" "}
                            {formatDate(feedback.comment_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 overflow-hidden md:px-16 pt-5 pb-0 md:pb-10 bg-white">
                      <div className="flex flex-wrap">
                        <div className="w-full md:w-4/5 mb-6 md:mb-0">
                          <p className="  text-lg mb-8 text-darkBlueGray-400 leading-loose">
                            {readMore === feedback.id
                              ? feedback.comment
                              : `${feedback.comment.substring(0, 240)}`}
                            &nbsp;
                            {feedback.comment.length > 240 && (
                              <button
                                className="btn text-teal-600 font-medium"
                                onClick={() => toggleFeedback(feedback.id)}
                              >
                                {readMore === feedback.id
                                  ? "read less"
                                  : "... read more"}
                              </button>
                            )}
                          </p>
                          <div className="-mb-8">
                            <div className="inline-flex w-24 mr-5 md:w-auto md:mr-2 mb-2">
                              <Link
                                href={`/patients/${patientId}/feedbacks/${feedback.id}/edit/`}
                              >
                                <Button className="flex items-center h-10 pl-2 pr-6 bg-green-100 hover:bg-green-50 border-2 border-green-500 rounded-full">
                                  <div className="flex mr-2 w-6 h-6 items-center justify-center bg-white rounded-full text-green-600">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </div>
                                  <span className="text-green-600 font-heading font-medium">
                                    Edit
                                  </span>
                                </Button>
                              </Link>
                            </div>
                            <div className="inline-flex w-24 md:w-auto md:mr-2 mb-2">
                              <Button
                                className="flex items-center h-10 pl-2 pr-6 bg-red-100 hover:bg-red-50 border-2 border-red-300 rounded-full"
                                onClick={() => handleDelete(feedback.id)}
                              >
                                <div className="flex mr-2 w-6 h-6 items-center justify-center bg-white rounded-full text-red-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line
                                      x1="10"
                                      y1="11"
                                      x2="10"
                                      y2="17"
                                    ></line>
                                    <line
                                      x1="14"
                                      y1="11"
                                      x2="14"
                                      y2="17"
                                    ></line>
                                  </svg>
                                </div>
                                <span className="text-red-500 font-heading font-medium">
                                  Delete
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full mt-5 md:mt-0 text-left md:text-right md:w-1/5">
                          <p className="  mb-0 md:mb-8 text-base text-gray-600">
                            {formatTimeAgo(feedback.comment_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {feedbacks && feedbacks.results.length > 0 && (
                  <div className="flex justify-center items-center mt-10 mb-10">
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
                        {Array.from(
                          { length: totalNumberOfPages },
                          (_, index) => (
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
                          )
                        )}
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
              </>
            )}
          </div>
        </div>
        <Toaster position="top-right" />
      </section>
    </div>
  );
}
