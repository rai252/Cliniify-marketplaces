import React from "react";
import { useParams } from "react-router-dom";
import { useGetDoctorByIdQuery } from "@/services/doctors/doctor.service";
import { FaUserAlt } from "react-icons/fa";
import { FaHospitalUser } from "react-icons/fa";
import { TbSchool } from "react-icons/tb";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoDocumentTextSharp, IoHomeSharp } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumb";
import { FaRegImages } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FilePreview } from "./custom/filePrivew";
import defaultImage from "@/assets/images/default-avatar.webp";

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

const DoctorDetails: React.FC = () => {
  const { id = "" } = useParams();
  const {
    data: doctor,
    isLoading,
    isError,
  } = useGetDoctorByIdQuery({ id: id, expand: "address" });

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
          {/* <div className="w-12 h-12 rounded-full absolute border-8 border-dashed border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-8 border-dashed border-teal-400 border-t-transparent"></div> */}
        </div>
      </div>
    );
  }

  if (isError || !doctor) {
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

  const formatTimeDuration = (time: any) => {
    if (!time || typeof time !== "string") {
      return "N/A";
    }
    const [hoursStr, minutesStr] = time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      return "N/A";
    }

    let formattedDuration = "";
    if (hours > 0) {
      formattedDuration += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      formattedDuration += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    return formattedDuration.trim();
  };

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Doctors", path: "/doctors" },
    { label: "Doctor Details" },
  ];

  return (
    <div className="w-full mx-auto px-4 py-8">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Doctor Details</h1>
        <Link
          to="/doctors"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <IoIosArrowRoundBack className="mr-1 mt-1" /> Back
        </Link>
      </header>

      <main className="space-y-8">
        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaUserAlt className="mr-2 text-gray-600" /> Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="md:col-span-2 lg:col-span-1">
              <img
                src={doctor.avatar || defaultImage}
                alt={doctor.full_name}
                className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
              />
            </div>
            {[
              { label: "Full Name", value: doctor.full_name },
              { label: "Phone", value: doctor.phone || "N/A" },
              { label: "Email", value: doctor.email },
              {
                label: "Gender",
                value:
                  doctor.gender === "M"
                    ? "Male"
                    : doctor.gender === "F"
                    ? "Female"
                    : doctor.gender === "O"
                    ? "Other"
                    : "Not Selected",
              },
              {
                label: "Specializations",
                value:
                  doctor.specializations?.map((spec) => spec.name).join(", ") ||
                  "N/A",
              },
              { label: "Bio", value: doctor.bio || "N/A" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaHospitalUser className="mr-2 text-gray-600" /> Professional
            Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Reg. Number", value: doctor.reg_no || "N/A" },
              { label: "Reg. Council", value: doctor.reg_council || "N/A" },
              { label: "Reg. Year", value: doctor.reg_year || "N/A" },
              {
                label: "Experience",
                value: `${doctor.experience_years || 0} years`,
              },
              {
                label: "Own Establishment",
                value: doctor.own_establishment ? "Yes" : "No",
              },
              { label: "Fee", value: doctor.fee ? `₹${doctor.fee}` : "N/A" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TbSchool className="mr-2 text-gray-600" /> Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Degree", value: doctor.degree || "N/A" },
              { label: "Institute", value: doctor.institute_name || "N/A" },
              {
                label: "Completion Year",
                value: doctor.completion_year || "N/A",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IoHomeSharp className="mr-2 text-gray-600" /> Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Street",
                value: doctor.address?.address_line_1 || "N/A",
              },
              {
                label: "Locality",
                value: doctor.address?.address_line_2 || "N/A",
              },
              { label: "Landmark", value: doctor.address?.landmark || "N/A" },
              { label: "City", value: doctor.address?.city || "N/A" },
              { label: "State", value: doctor.address?.state || "N/A" },
              { label: "Pincode", value: doctor.address?.pincode || "N/A" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IoDocumentTextSharp className="mr-2 text-gray-600" /> Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilePreview
              url={doctor.identity_proof || ""}
              title="Identity Proof"
              downloadName={`${doctor.full_name}-Identity-Proof`}
            />
            <FilePreview
              url={doctor.medical_reg_proof || ""}
              title="Medical Proof"
              downloadName={`${doctor.full_name}-Medical-Proof`}
            />
            <FilePreview
              url={doctor.establishment_proof || ""}
              title="Establishment Proof"
              downloadName={`${doctor.full_name}-Establishment-Proof`}
            />
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IoMdTime className="mr-2 text-gray-600" /> Timings
          </h2>
          {doctor.associated_establishment.map((establishment) => (
            <div key={establishment.id} className="mb-8">
              <h3 className="text-md font-semibold mb-2">
                {establishment.name}
              </h3>
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
                  <div
                    key={`${establishment.id}-${day}`}
                    className="bg-gray-50 rounded-md p-3"
                  >
                    <p className="font-semibold mb-2">{day}</p>
                    {(doctor.relations as any).find(
                      (relation: any) =>
                        relation.establishment_id === establishment.id
                    )?.timings?.[day]?.length > 0 ? (
                      (doctor.relations as any)
                        .find(
                          (relation: any) =>
                            relation.establishment_id === establishment.id
                        )
                        ?.timings[day].map(
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
            </div>
          ))}
          <p className="mt-4 text-sm text-gray-500">
            Time Duration:{" "}
            <span className="text-gray-700">
              {formatTimeDuration(doctor.time_duration)}
            </span>
          </p>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaRegImages className="mr-2 text-gray-600" /> Images
          </h2>
          {doctor.images && doctor.images.length > 0 ? (
            <ImageCarousel
              images={doctor.images.map((img) => ({
                image: Array.isArray(img.image)
                  ? (img.image[0] as string) || ""
                  : img.image || "",
              }))}
            />
          ) : (
            <p className="text-gray-500 text-center">No images available</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorDetails;
