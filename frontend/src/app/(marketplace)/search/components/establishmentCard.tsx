import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { IEstablishment } from "@/types/search/search";
import StarRating from "../../../../components/star-rating";

interface establishmentCardProps {
  establishmentData: IEstablishment;
}

export default async function establishmentCard({
  establishmentData,
}: establishmentCardProps) {
  return (
    <div
      key={establishmentData.id}
      className="mb-2 shadow-lg rounded-t-8xl rounded-b-5xl overflow-hidden rounded-lg"
    >
      <div className="pt-3 pb-3 md:pb-1 px-4 md:px-16 bg-white">
        <div className="flex flex-wrap items-center">
          <div className="relative">
            <img
              src={
                typeof establishmentData.logo === "string"
                  ? establishmentData.logo
                  : establishmentData.logo instanceof File
                  ? URL.createObjectURL(establishmentData.logo)
                  : "/images/doctor-image.webp"
              }
              className="object-cover object-top w-10 h-10 rounded-full shadow-lg sm:w-40 sm:h-40 mr-5"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                zIndex: 1,
              }}
              alt="Establishment Logo"
            />
          </div>
          <h4 className="  w-full md:w-auto text-xl font-heading font-medium">
            {establishmentData.establishment_category && (
              <p className="  text-base text-gray-500">
                {establishmentData.establishment_category}
              </p>
            )}
            <Link
              href={`/establishment/${establishmentData.slug}`}
              className="hover:underline text-gray-600"
            >
              <p className="  w-full md:w-auto text-xl font-heading font-medium">
                {establishmentData.name}
              </p>
            </Link>
          </h4>
        </div>
      </div>
      <div className="px-4 overflow-hidden md:px-16 pt-4 pb-2 bg-white">
        <div className="flex flex-wrap">
          <div className="w-full md:w-2/3">
            {establishmentData?.average_doctors_rating > 0 && (
              <div className="flex items-center mb-2 ml-1">
                <span className="text-slate-700 font-medium mr-2">
                  {establishmentData?.average_doctors_rating}
                </span>
                <StarRating
                  average_rating={establishmentData?.average_doctors_rating}
                />
              </div>
            )}
            <span className="  flex items-center text-slate-700 font-medium mb-2">
              <MapPin className="mr-1" />
              {establishmentData.address?.address_line_1 &&
                establishmentData.address.address_line_1 + ", "}
              {establishmentData.address?.city &&
                establishmentData.address.city + ", "}
              {establishmentData.address?.state}
            </span>
            {establishmentData.tagline && (
              <p className="  text-base text-gray-500 mb-2">
                {establishmentData.tagline.length > 60
                  ? `${establishmentData.tagline.substring(0, 60)}...`
                  : establishmentData.tagline}
              </p>
            )}
          </div>
          <div className="w-full md:w-1/3 text-right">
            {establishmentData.fee_range && (
              <p className="text-start   text-base font-medium text-gray-500 mb-2">
                <span className="  text-slate-800">
                  {establishmentData.fee_range}
                </span>{" "}
                Consultation Fees
              </p>
            )}
            <Link href={`/establishment/${establishmentData.slug}`}>
              <Button className="  text-base hover:text-teal-600 hover:bg-slate-100 bg-teal-600 font-medium w-full sm:w-72 shadow-xl mb-2">
                View Establishment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
