import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
// import { TbSchool } from "react-icons/tb";
import { IoIosArrowRoundBack, IoMdTime } from "react-icons/io";
// import { IoDocumentTextSharp, IoHomeSharp } from "react-icons/io5";
// import { IoMdTime } from "react-icons/io";
// import { Badge } from "@/components/ui/badge";
import defaultImage from '@/assets/images/default-avatar.webp'
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumb";
import { useGetEstablishmentByIdQuery } from "@/services/establishments/establishment.service";
import { IoDocumentTextSharp, IoHomeSharp } from "react-icons/io5";
import { MdMedicalServices } from "react-icons/md";
import { FaRegImages } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetDoctorByIdQuery } from "@/services/doctors/doctor.service";
import { IDoctor } from "@/interfaces/doctor.interface";
import DoctorCard from "../sales/customCard/DoctorCard";
import StaffList from "./custom/staffList";
import { Badge } from "@/components/ui/badge";

interface Image {
  image: string;
}

interface ImageCarouselProps {
  images: Image[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
            <div className="shadow-sm border border-gray-200 rounded-lg h-44 overflow-hidden">
              <img
                src={image.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer">
        <span className="material-icons">chevron_left</span>
      </CarouselPrevious>
      <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer">
        <span className="material-icons">chevron_right</span>
      </CarouselNext>
    </Carousel>
  );
};

const EstablishmentDetails: React.FC = () => {
  const { id = "" } = useParams();
  const {
    data: establishment,
    isLoading,
    isError,
  } = useGetEstablishmentByIdQuery(id);

  const [owner, setOwner] = useState<IDoctor | null>(null);

  
  const { data: doctorOwner, isLoading: isLoadingOwner } =
    useGetDoctorByIdQuery({id:establishment?.owner as string, expand: "address"}, {skip: !establishment});

  useEffect(() => {
    if (doctorOwner) {
      setOwner(doctorOwner);
    }
  }, [doctorOwner]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 24 24"
          >
            <ellipse cx="12" cy="5" fill="#4f46e5" rx="4" ry="4">
              <animate
                id="svgSpinnersBouncingBall0"
                fill="freeze"
                attributeName="cy"
                begin="0;svgSpinnersBouncingBall2.end"
                calcMode="spline"
                dur="0.375s"
                keySplines=".33,0,.66,.33"
                values="5;20"
              />
              <animate
                attributeName="rx"
                begin="svgSpinnersBouncingBall0.end"
                calcMode="spline"
                dur="0.05s"
                keySplines=".33,0,.66,.33;.33,.66,.66,1"
                values="4;4.8;4"
              />
              <animate
                attributeName="ry"
                begin="svgSpinnersBouncingBall0.end"
                calcMode="spline"
                dur="0.05s"
                keySplines=".33,0,.66,.33;.33,.66,.66,1"
                values="4;3;4"
              />
              <animate
                id="svgSpinnersBouncingBall1"
                attributeName="cy"
                begin="svgSpinnersBouncingBall0.end"
                calcMode="spline"
                dur="0.025s"
                keySplines=".33,0,.66,.33"
                values="20;20.5"
              />
              <animate
                id="svgSpinnersBouncingBall2"
                attributeName="cy"
                begin="svgSpinnersBouncingBall1.end"
                calcMode="spline"
                dur="0.4s"
                keySplines=".33,.66,.66,1"
                values="20.5;5"
              />
            </ellipse>
          </svg>
        </div>
      </div>
    );
  }

  if (isError || !establishment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 mx-auto text-red-500 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Oops! Data Fetch Failed
            </h1>
            <p className="text-gray-600">
              We couldn't retrieve your doctor data. This is likely a
              temporary issue.
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 text-sm text-red-700 flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error: Unable to fetch doctor data from the server.</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Try these steps to resolve the issue:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 pl-5 list-disc">
              <li>Check your internet connection</li>
              <li>Refresh the page</li>
              <li>Clear your browser cache</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Establishment", path: "/establishments" },
    { label: "Establishment Details" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">
          Establishment Details
        </h1>
        <Link
          to="/establishments"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          <IoIosArrowRoundBack className="mr-2" /> Back
        </Link>
      </div>

      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaUserAlt className="mr-2 text-gray-600" /> Basic Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <img
              src={(establishment.logo as string) || defaultImage}
              alt="Logo"
              className="w-24 h-24 object-cover rounded-md mx-auto sm:mx-0"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p>{establishment.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p>{establishment.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="truncate">{establishment.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tagline</p>
            <p>{establishment.tagline || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact Person</p>
            <p>{establishment.contact_person || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p>{establishment.establishment_category || "N/A"}</p>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <IoDocumentTextSharp className="mr-2 text-gray-600" /> Summary
        </h2>
        <div
          dangerouslySetInnerHTML={{ __html: establishment.summary || "N/A" }}
          className="prose max-w-none text-sm sm:text-base"
        />
      </section>

      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <IoHomeSharp className="mr-2 text-gray-600" /> Address Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <p className="text-sm text-gray-500">Street</p>
            <p>{establishment.address?.address_line_1 || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Locality</p>
            <p>{establishment.address?.address_line_2 || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Landmark</p>
            <p>{establishment.address?.landmark || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City</p>
            <p>{establishment.address?.city || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p>{establishment.address?.state || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pincode</p>
            <p>{establishment.address?.pincode || "N/A"}</p>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MdMedicalServices className="mr-2 text-gray-600" /> Services
        </h2>
        {establishment.establishment_services?.length > 0 ? (
          <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
            {establishment.establishment_services.map((service, index) => (
              <li key={index} className="rounded-md p-0 text-sm text-start">
                {service.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>N/A</p>
        )}
      </section>

      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaRegImages className="mr-2 text-gray-600" /> Images
        </h2>
        <ImageCarousel images={establishment.establishment_images as any} />
      </section>

      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaUserAlt className="mr-2 text-gray-600" /> Owner & Staff
        </h2>
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Owner</h3>
          {isLoadingOwner ? (
            <p className="text-sm">Loading...</p>
          ) : owner ? (
            <div className="flex justify-center sm:justify-start">
              <DoctorCard doctor={owner} />
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2">Staff</h3>
          <div className="overflow-x-auto">
            <StaffList staffIds={establishment?.staffs?.map(String) || []} />
          </div>
        </div>
      </section>

      <section className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <IoMdTime className="mr-2 text-gray-600" /> Timings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div key={day} className="bg-gray-50 rounded-md p-3">
              <p className="font-semibold mb-2">{day}</p>
              {establishment.timings &&
              Array.isArray((establishment.timings as any)[day]) &&
              (establishment.timings as any)[day].length > 0 ? (
                (establishment.timings as any)[day].map(
                  (
                    timing: { start_time: string; end_time: string },
                    idx: number
                  ) => (
                    <Badge
                      key={idx}
                      className="bg-green-500 rounded-md mr-2 mb-2"
                    >
                      {timing.start_time} - {timing.end_time}
                    </Badge>
                  )
                )
              ) : (
                <Badge variant="destructive">Closed</Badge>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default EstablishmentDetails;
