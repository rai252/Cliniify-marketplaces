import { IEstablishments } from "@/interfaces/establishments.interface";
import React from "react";
import { Link } from "react-router-dom";
import defaultimage from "@/assets/images/default-avatar.webp";

interface EstablishmentCardProps {
  establishment: IEstablishments; // Replace with the appropriate type for establishment data
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  establishment,
}) => {
  return (
    <Link to={`/establishment/details/${establishment.id}`}>
      <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
        <div className="flex items-start space-x-3">
          <img
            className="w-10 h-10 rounded-md object-cover object-center shrink-0 border border-gray-200"
            src={(establishment.logo as string) || defaultimage}
            alt={establishment?.name}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-gray-800 truncate">
              {establishment?.name}
            </span>
            <span className="text-xs text-blue-500 truncate mb-1">
              {establishment?.establishment_category}
            </span>
            <div className="text-xs text-gray-500 truncate">
              <span className="inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
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
                {establishment?.address?.city || "N/A"}
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate">
              <span className="inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {establishment?.phone || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EstablishmentCard;
