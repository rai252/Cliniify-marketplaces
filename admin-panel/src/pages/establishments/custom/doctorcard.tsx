import { IDoctor } from "@/interfaces/doctor.interface";
import React from "react";
import defaultimage from '@/assets/images/default-avatar.webp'


interface DoctorCardProps {
  doctor: IDoctor;
  isLoading: boolean;
  isError: boolean
  [key: string]: any; 
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isLoading, isError, ...props }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div aria-label="Loading..." role="status">
          <svg
            className="animate-spin w-10 h-10 fill-slate-800"
            viewBox="3 3 18 18"
          >
            <path
              className="opacity-20"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            ></path>
            <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (isError) {
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
              We couldn't retrieve your patient data. This is likely a
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
            <span>Error: Unable to fetch patient data from the server.</span>
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

  return (
    <div
      className="bg-white p-2 rounded-xl mb-1 mt-1 shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:bg-slate-50"
      {...props}
    >
      <div className="flex items-">
        <img
          className="w-[100px] h-[100px] border border-gray-300 rounded-md mr-2 object-cover object-center"
          src={doctor.avatar || defaultimage}
          alt={doctor?.full_name}
        />
        <div className="flex flex-col p-2">
          <span className="font-bold">{doctor?.full_name}</span>
          <span className="text-sm text-gray-600">{doctor?.degree}</span>
          <span className="text-sm text-gray-600">{doctor?.address?.city}</span>
          <span className="text-sm text-gray-600">
            {doctor?.gender == "M" ? "Male" : "Female"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
