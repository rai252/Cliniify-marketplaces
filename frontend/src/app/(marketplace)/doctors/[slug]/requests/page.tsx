"use client";
import React, { useState, useEffect } from "react";
import { IDoctor, IGetResult } from "@/types/doctor/doctor";
import { establishmentService } from "@/services/establishment.service";
import { doctorService } from "@/services/doctor.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import toast from "react-hot-toast";

const OnboardingRequestsPage: React.FC = () => {
  const [onboardingRequests, setOnboardingRequests] = useState<IGetResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [doctors, setDoctors] = useState<{ [id: number]: IDoctor }>({});

  useEffect(() => {
    const fetchOnboardingRequests = async () => {
      try {
        const requests = await establishmentService.getOnboardRequest();
        setOnboardingRequests(requests as any);
        const doctorIds = Array.isArray(requests)
          ? requests.map((request) => request.doctor)
          : [];
        const doctorPromises = doctorIds.map((id: IDoctor) =>
          doctorService.getDoctorDetail({ id })
        );
        const doctorsResponse = await Promise.all(doctorPromises);
        const doctorsMap = doctorsResponse.reduce(
          (acc: { [id: number]: IDoctor }, doctor: IDoctor) => {
            return { ...acc, [doctor.id]: doctor };
          },
          {}
        );

        setDoctors(doctorsMap);
      } catch (error) {
        console.error("Error fetching onboarding requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOnboardingRequests();
  }, []);

  const handleAcceptReject = async (
    requestId: number,
    action: "accept" | "reject"
  ) => {
    try {
      if (action === "accept") {
        await establishmentService.acceptOnboardRequest(requestId);
        toast.success(`Onboarding request accepted successfully!`);
      } else {
        await establishmentService.rejectOnboardRequest(requestId);
        toast.error(`Onboarding request rejected successfully!`);
      }
      setOnboardingRequests(
        onboardingRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting/rejecting onboarding request:", error);
    }
  };

  return (
    <div className="main-section px-1 sm:px-12">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5 bg-slate-200"></div>
        </div>
      </div>
      <div className="p-10 pb-16 md:block mt-10">
        <h2 className="  text-2xl font-medium">Onboarding Requests</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {onboardingRequests.length > 0 ? (
          onboardingRequests.map((request) => (
            <Card key={request.id} className="shadow-md">
              <CardHeader className="sm:flex sm:flex-row sm:items-center sm:justify-between">
                <Image
                  src={
                    doctors[request.doctor]?.avatar ||
                    "/images/doctor-image.webp"
                  }
                  alt="dr profile"
                  className="object-cover object-top w-[100px] h-[100px] rounded-full border-2 border-solid border-gray-300 p-1"
                  width={300}
                  height={300}
                />
                <CardTitle>{doctors[request.doctor]?.full_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="  text-lg">Doctor Id: {request.doctor}</p>
                <p className="  text-lg">
                  Email: {doctors[request.doctor]?.email}
                </p>
                <p className="  text-lg">
                  Phone: {doctors[request.doctor]?.phone || "not available"}
                </p>
                <div className="flex justify-between mt-2">
                  <button
                    className="bg-teal-600 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      handleAcceptReject(request.id, "accept");
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      handleAcceptReject(request.id, "reject");
                    }}
                  >
                    Reject
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="sm:ml-10 flex flex-col justify-center items-center">
            <Image
              src="/images/no-feedbacks.png"
              alt="no-feedback"
              height={300}
              width={300}
            />
            <h2 className="  text-2xl font-medium">
              No Onboarding Requests Found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingRequestsPage;
