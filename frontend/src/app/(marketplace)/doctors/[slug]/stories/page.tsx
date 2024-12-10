"use client";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { IDoctor } from "@/types/doctor/doctor";
import { IFeedbackList } from "@/types/feedback/feedback";
import { doctorService } from "@/services/doctor.service";
import { feedbackService } from "@/services/feedback.service";
import dayjs from "dayjs";
import Loader from "@/components/loader";

export default function FeedbackList({
  params,
}: {
  params: { id: number; slug: string };
}) {
  const { id, slug } = params;
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [feedbacks, setFeedbacks] = useState<IFeedbackList>({
    count: 0,
    next: null,
    previous: null,
    loading: true,
    results: [],
  });
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState<
    IFeedbackList["results"][0] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(1);
  const [readMore, setreadMore] = useState<number | null>(null);

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
  }, [id]);

  const page_size = 10;

  useEffect(() => {
    const fetchFeedbackData = async (page: number, page_size: number) => {
      try {
        const feedbacksData: any = await feedbackService.getFeedbacks({
          expand: "patient,doctor",
          doctor: doctor?.id,
          page,
          page_size,
        });
        const calculatedTotalNumberOfPages =
          Math.ceil(feedbacksData.count / page_size) || 1;
        setTotalNumberOfPages(calculatedTotalNumberOfPages);
        setFeedbacks(feedbacksData);
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

  const handleReplySubmit = async (feedbackId: number) => {
    const feedbackToUpdate = feedbacks?.results.find(
      (feedback) => feedback.id === feedbackId
    );

    if (feedbackToUpdate) {
      const feedbackData = {
        doctor: doctor?.id as number,
        patient: feedbackToUpdate.patient.id as number,
        rating: feedbackToUpdate.rating,
        comment: feedbackToUpdate.comment,
        reply: feedbackComment,
        reply_at: new Date().toISOString(),
      };

      try {
        const submittedFeedbackId = await feedbackService.doctorReply(
          feedbackToUpdate.id,
          feedbackData
        );
        setFeedbackComment(submittedFeedbackId.reply);
        toast.success("Feedback Store successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error submitting feedback:", error);
      }
    }
  };

  const handleReplyUpdate = async (feedbackId: number) => {
    const feedbackToUpdate = feedbacks?.results.find(
      (feedback) => feedback.id === feedbackId
    );
    if (feedbackToUpdate) {
      const feedbackData = {
        doctor: doctor?.id as number,
        patient: feedbackToUpdate.patient.id as number,
        rating: feedbackToUpdate.rating,
        comment: feedbackToUpdate.comment,
        reply: feedbackComment,
        reply_at: new Date().toISOString(),
      };
      try {
        const submittedFeedbackId = await feedbackService.doctorReply(
          feedbackToUpdate.id,
          feedbackData
        );
        setFeedbackComment(submittedFeedbackId.reply);
        toast.success("Feedback updated successfully!");

        setIsEditDialogOpen(false);
        window.location.reload();
      } catch (error) {
        console.error("Error submitting feedback:", error);
      }
    }
  };

  const handleReplyEdit = (feedback: IFeedbackList["results"][0]) => {
    setEditedFeedback(feedback);
    setFeedbackComment(feedback.reply || "");
  };

  useEffect(() => {
    if (isEditDialogOpen) {
      const textarea = document.getElementById(
        "replyTextarea"
      ) as HTMLTextAreaElement | null;

      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }
    }
  }, [isEditDialogOpen]);

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

  const toggleFeedback = (feedbackId: number) => {
    setreadMore((prevId) => (prevId === feedbackId ? null : feedbackId));
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
              Patient&apos;s Experiences
            </h2>
          </div>
        </div>
        <div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            {feedbacks?.loading ? (
              <Loader />
            ) : (
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="  text-base">
                        Patient Name
                      </TableHead>
                      <TableHead className="  text-base">Rating</TableHead>
                      <TableHead className="w-[600px]   text-base">
                        Feedback
                      </TableHead>
                      <TableHead className="  text-base">
                        Feedback Date
                      </TableHead>
                      <TableHead className="  text-base">Reply</TableHead>
                      <TableHead className="  text-base text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks?.results.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell className="text-base  ">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <Image
                                className="w-full h-full rounded-full"
                                src={
                                  (feedback?.patient.avatar as string) ||
                                  "/images/image.png"
                                }
                                alt=""
                                width={200}
                                height={200}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="  text-base text-gray-900 whitespace-no-wrap">
                                {feedback?.patient.full_name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-base  ">
                          <div
                            className="flex align-center"
                            style={{ marginBottom: "10px", marginLeft: "-3px" }}
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
                          </div>
                        </TableCell>
                        <TableCell className="text-base  ">
                          <p className="  text-base text-gray-900 whitespace-no-wrap">
                            {readMore === feedback.id
                              ? feedback.comment
                              : `${feedback.comment.substring(0, 100)}`}
                            &nbsp;
                            {feedback.comment.length > 100 && (
                              <button
                                className="btn text-teal-600 font-medium"
                                onClick={() => toggleFeedback(feedback.id)}
                              >
                                {readMore === feedback.id
                                  ? "read less"
                                  : "read more..."}
                              </button>
                            )}
                          </p>
                        </TableCell>
                        <TableCell className="text-base  ">
                          <p className="  text-base text-gray-900 whitespace-no-wrap">
                            {formatDate(feedback.comment_at)}
                          </p>
                        </TableCell>
                        <TableCell className="text-base  ">
                          {feedback.reply ? (
                            <p className="  text-base text-gray-900 whitespace-no-wrap">
                              {feedback?.reply}
                            </p>
                          ) : (
                            <p className="  text-base text-gray-900 whitespace-no-wrap">
                              <p>Not replied yet</p>
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-base  ">
                          <td className="px-5 py-5 text-sm flex flex-col items-center">
                            {feedback.reply ? (
                              <Dialog>
                                <DialogTrigger>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleReplyEdit(feedback)}
                                  >
                                    Edit Reply
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {feedback?.patient.full_name}
                                    </DialogTitle>
                                    <Separator />
                                    <DialogDescription>
                                      {feedback.comment}
                                      <div className="mt-4">
                                        {formatDate(feedback.comment_at)}
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Separator />
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Image
                                        className="w-20 h-20 rounded-full object-fit"
                                        src={
                                          (doctor?.avatar as string) ||
                                          "/images/image.png"
                                        }
                                        alt=""
                                        width={200}
                                        height={200}
                                      />
                                      <div className="col-span-3">
                                        <Textarea
                                          id="replyTextarea"
                                          className="  w-full"
                                          placeholder="Start typing your reply here..."
                                          value={feedbackComment}
                                          onChange={(e) =>
                                            setFeedbackComment(e.target.value)
                                          }
                                        />
                                        <div className="flex items-start mt-5">
                                          <DialogFooter>
                                            <Button
                                              className="bg-teal-700 hover:bg-teal-600"
                                              type="submit"
                                              onClick={() =>
                                                handleReplyUpdate(feedback.id)
                                              }
                                            >
                                              Edit Reply
                                            </Button>
                                          </DialogFooter>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline">Reply</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {feedback?.patient.full_name}
                                    </DialogTitle>
                                    <Separator />
                                    <DialogDescription>
                                      {feedback.comment}
                                      <div className="mt-4">
                                        {formatDate(feedback.comment_at)}
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Separator />
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Image
                                        className="w-20 h-20 rounded-full"
                                        src={
                                          (doctor?.avatar as string) ||
                                          "/images/image.png"
                                        }
                                        alt=""
                                        width={200}
                                        height={200}
                                      />
                                      <div className="col-span-3">
                                        <Textarea
                                          className="  w-full"
                                          placeholder="Start typing your reply here..."
                                          value={feedbackComment}
                                          onChange={(e) =>
                                            setFeedbackComment(e.target.value)
                                          }
                                        />
                                        <div className="flex items-start mt-5">
                                          <DialogFooter>
                                            <Button
                                              className="bg-teal-700 hover:bg-teal-600"
                                              type="submit"
                                              onClick={() =>
                                                handleReplySubmit(feedback.id)
                                              }
                                            >
                                              Reply
                                            </Button>
                                          </DialogFooter>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </td>
                        </TableCell>
                      </TableRow>
                    ))}
                    {feedbacks && feedbacks.results.length > page_size && (
                      <div className="flex mt-5">
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
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
