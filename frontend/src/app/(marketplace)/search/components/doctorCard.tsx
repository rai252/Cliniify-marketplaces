import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiCheckCircle } from "react-icons/fi";
import StarRating from "@/components/star-rating";
import { IDoctor } from "@/types/search/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

interface DoctorCardProps {
  doctorData: IDoctor;
}

export default function DoctorCard({ doctorData }: DoctorCardProps) {
  return (
    <div
      key={doctorData.id}
      className="mb-4 shadow-md rounded-lg overflow-hidden bg-white"
    >
      {/* Header Section */}
      <div className="flex flex-wrap items-center px-4 py-3 md:px-6 md:py-4">
        <div className="flex-1">
          <h4 className="text-lg md:text-xl font-bold text-gray-800">
            {doctorData.full_name}
          </h4>
          <p className="text-sm text-gray-500">
            {doctorData.specializations.join(", ")}
          </p>
          {doctorData.is_verified && (
            <Badge className="mt-2 bg-teal-700 text-white">
              <FiCheckCircle className="inline-block mr-1" /> Verified
            </Badge>
          )}
        </div>

        {/* Doctor Avatar (Moved to the Right with Smaller Size) */}
        <div className="flex-shrink-0 ml-4">
          <img
            src={doctorData.avatar || "/images/doctor-image.webp"}
            alt={`${doctorData.full_name}'s avatar`}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-md shadow-lg object-cover object-top"
          />
        </div>
      </div>
      {/* Content Section */}
      <div className="px-4 py-2 md:px-6 md:py-3">
        <div className="flex flex-wrap">
          {/* Left Section */}
          <div className="w-full md:w-2/3">
            {/* Ratings */}
            {doctorData.average_rating > 0 && (
              <div className="flex items-center mb-3">
                <span className="text-gray-800 font-medium mr-2">
                  {doctorData.average_rating.toFixed(1)}
                </span>
                <StarRating average_rating={doctorData.average_rating} />
              </div>
            )}
            {/* Experience */}
            {doctorData.experience_years && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>{doctorData.experience_years}</strong> Years of
                Experience
              </p>
            )}
            {/* Location */}

            {/* Bio */}
            {doctorData.bio && (
              <p className="text-sm text-gray-500 mt-2">
                {doctorData.bio.length > 60
                  ? `${doctorData.bio.substring(0, 60)}...`
                  : doctorData.bio}
              </p>
            )}
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/3 text-right">
            {/* Location with Icon */}
            {doctorData.address?.city || doctorData.address?.state ? (
              <p className="text-sm text-gray-600 flex items-center justify-end mb-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-500 mr-2"
                />
                {doctorData.address?.city && `${doctorData.address.city}, `}
                {doctorData.address?.state}
              </p>
            ) : null}

            {/* Fees with Icon */}
            {doctorData.fee && (
              <p className="text-sm text-gray-600 flex items-center justify-end mb-2">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="text-gray-500 mr-2"
                />
                <strong>{doctorData.fee}</strong>
              </p>
            )}

            {/* Appointment Button */}
            <Link href={`/doctors/${doctorData.slug}`}>
              <Button className="w-full sm:w-40 bg-teal-600 text-white hover:bg-teal-700 shadow-md">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
