"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "react-hot-toast";
import { IDoctor } from "@/types/doctor/doctor";
import { IUpdateFeedback } from "@/types/feedback/feedback";
import { doctorService } from "@/services/doctor.service";
import { feedbackService } from "@/services/feedback.service";

export default function UpdateFeedbackForm() {
  const router = useRouter();
  const params = useParams<{ patientid: string; feedbackId: string }>();
  const [doctorData, setDoctorData] = useState<IDoctor | null>(null);
  const feedbackID = params.feedbackId;
  const patientID = params.patientid;

  const [feedbackData, setFeedbackData] = useState<IUpdateFeedback | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idAsNumber = feedbackID ? parseInt(feedbackID, 10) : 0;
        const feedbackData = await feedbackService.getFeedbackDetail(
          idAsNumber
        );
        setFeedbackData(feedbackData);

        const doctorData = await doctorService.getDoctorDetail({
          id: feedbackData.doctor,
        });
        setDoctorData(doctorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [feedbackID]);

  const handleStarClick = (rating: number) => {
    setFeedbackData((prevData) => {
      if (prevData) {
        return { ...prevData, rating };
      }
      return null;
    });
  };

  const handleChange =
    (key: keyof IUpdateFeedback) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFeedbackData((prevData) => {
        if (prevData) {
          return { ...prevData, [key]: event.target.value };
        }
        return null;
      });

  const handleSubmit = async () => {
    try {
      if (feedbackData) {
        const updatedFeedbackData = {
          doctor: feedbackData.doctor,
          patient: feedbackData.patient,
          rating: feedbackData.rating,
          comment: feedbackData.comment,
        };

        await feedbackService.updateFeedback(
          feedbackID as unknown as number,
          updatedFeedbackData
        );
        toast.success("Feedback updated successfully!");
        router.push(`/patients/${patientID}/feedbacks/`);
      }
    } catch (error) {
      toast.error("Failed to edit feedback!");
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <div className="main-section bg-slate-50 min-h-screen flex flex-col justify-between">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-10 sm:py-10 lg:py-10"></div>
        </div>
      </div>
      <div className="feedback-form-container mt-20 flex-grow">
        <Card style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
          <CardContent className="flex flex-col">
            <h1 className=" " style={{ fontSize: "1.6em" }}>
              How was your appointment experience with{" "}
              <span className="  text-xxl text-teal-700">
                {doctorData?.full_name}?
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
                    color:
                      star <= (feedbackData?.rating ?? 0)
                        ? "#FFD700"
                        : "#D3D3D3",
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
              value={feedbackData?.comment}
              className="  text-xl focus-visible:ring-transparent"
              onChange={handleChange("comment")}
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
              style={{ marginTop: "20px" }}
              onClick={handleSubmit}
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
