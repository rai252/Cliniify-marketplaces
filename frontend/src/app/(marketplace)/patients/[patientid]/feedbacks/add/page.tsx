"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "react-hot-toast";
import { doctorService } from "@/services/doctor.service";
import { feedbackService } from "@/services/feedback.service";
import { IDoctor } from "@/types/doctor/doctor";
import { IFeedbackPost } from "@/types/feedback/feedback";

export default function FeedbackForm() {
  const router = useRouter();
  const [doctorDetails, setDoctorDetails] = useState<IDoctor | null>(null);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [feedbackId, setFeedbackId] = useState<number | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctor");
  const patientId = searchParams.get("p");

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

  const handleSubmit = async () => {
    if (
      doctorId &&
      patientId &&
      selectedStars > 0 &&
      feedbackComment.trim() !== ""
    ) {
      const feedbackData: IFeedbackPost = {
        id: 0,
        doctor: Number(doctorDetails?.id),
        patient: Number(patientId),
        rating: selectedStars,
        comment: feedbackComment,
        comment_at: new Date().toISOString(),
      };
      try {
        const submittedFeedbackId = await feedbackService.postFeedback(
          feedbackData
        );
        setFeedbackId(submittedFeedbackId);
        toast.success("Feedback submitted successfully!");
        router.push(`/patients/${patientId}/feedbacks/`);
      } catch (error: any) {
        toast.error(error.detail);
      }
    } else {
      console.error("Validation error: Please provide valid feedback details.");
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedStars(rating);
  };

  return (
    <div className="main-section bg-slate-50 min-h-screen flex flex-col justify-between">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <div className="feedback-form-container mt-20 flex-grow">
        <Card style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
          <CardContent className="flex flex-col">
            <h1 className=" " style={{ fontSize: "1.6em" }}>
              How was your appointment experience with{" "}
              <span className="  text-xxl text-teal-700">
                {doctorDetails?.full_name}?
              </span>
            </h1>
            <h6 className=" " style={{ fontSize: "1em", marginTop: "10px" }}>
              Your experience will help over 1 lac people choose the right
              doctor, daily.
            </h6>
            <Label className="  text-base mt-10">
              Q.1. How would you rate the doctor?
              <span className="  text-xl font-bold text-red-500">*</span>
            </Label>
            <div
              className="flex align-center mt-5"
              style={{ marginBottom: "20px" }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleStarClick(star)}
                  style={{
                    color: star <= selectedStars ? "#FDCC0D" : "#D3D3D3",
                    fontSize: "24px",
                    marginRight: "5px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
            <Label
              className="  text-base"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              Q.2. Tell us about your experience with the doctor.
              <span className="  text-xl font-bold text-red-500">*</span>
            </Label>
            <Textarea
              value={feedbackComment}
              className="  focus-visible:ring-transparent"
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Enter your feedback here..."
              style={{
                width: "100%",
                height: "150px",
                margin: "10px 0",
                padding: "10px",
                fontSize: "0.9em",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <Button
              className="  text-base"
              onClick={handleSubmit}
              style={{ marginTop: "20px" }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
