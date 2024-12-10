import { IDoctor } from "@/interfaces/doctor.interface";
import React from "react";
import defaultImage from "@/assets/images/default-avatar.webp";
import { Link } from "react-router-dom";

interface DoctorCardProps {
  doctor: IDoctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Link to={`/doctors/details/${doctor.id}`}>
      <div className="bg-white hover:bg-gray-50 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200 mb-2 border border-gray-200 hover:border-blue-300">
        <div className="flex items-center space-x-2">
          <img
            className="w-16 h-16 border border-gray-200 rounded-md object-cover object-center"
            src={doctor.avatar || defaultImage}
            alt={doctor?.full_name}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-gray-800 truncate">
              {doctor?.full_name}
            </span>
            <span className="text-[12px] text-gray-600 truncate">
              {doctor?.degree}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center text-[12px] text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-[2px] text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {doctor?.address?.city || "N/A"}
              </span>
              <span className="inline-flex items-center text-[12px] text-gray-500">
                {doctor?.gender === "M" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-[2px] text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill="currentColor"
                        d="M14 5v1h3.3L13 10.3C12 9.5 10.8 9 9.5 9C6.5 9 4 11.5 4 14.5S6.5 20 9.5 20s5.5-2.5 5.5-5.5c0-1.3-.5-2.5-1.3-3.5L18 6.7V10h1V5zm-4.5 5c1 0 2 .4 2.8 1c.2.2.5.4.7.7c.6.8 1 1.8 1 2.8C14 17 12 19 9.5 19S5 17 5 14.5S7 10 9.5 10"
                      />
                    </svg>
                    Male
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-[2px] text-pink-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill="currentColor"
                        d="M11.5 5C8.5 5 6 7.5 6 10.5c0 2.8 2.2 5.2 5 5.5v2H9v1h2v2h1v-2h2v-1h-2v-2c2.8-.3 5-2.6 5-5.5c0-3-2.5-5.5-5.5-5.5m0 1C14 6 16 8 16 10.5S14 15 11.5 15S7 13 7 10.5S9 6 11.5 6"
                      />
                    </svg>
                    Female
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DoctorCard;
