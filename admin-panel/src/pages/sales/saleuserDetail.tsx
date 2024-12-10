import React from "react";
import { useParams } from "react-router-dom";
import { useGetSaleUsersDoctorQuery } from "@/services/doctors/doctor.service";
import { FaUserAlt } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumb";
import {
  useGetSaleUserByIdQuery,
} from "@/services/sales/sale.service";
import { useGetSaleUsersEstablishmentQuery } from "@/services/establishments/establishment.service";
import { Badge } from "@/components/ui/badge";
import DoctorCard from "./customCard/DoctorCard";
import EstablishmentCard from "./customCard/EstablishmentCard";
import { BsHospitalFill } from "react-icons/bs";

const SaleUserDetails: React.FC = () => {
  const { id = "" } = useParams();
  const {
    data: saleuserDetail,
    isLoading: isLoadingsaleuserDetail,
    isError: isErrorsaleuserDetail,
  } = useGetSaleUserByIdQuery(id);
  const {
    data: saleUserRegDoctor,
    isLoading: isLoadingsaleUserRegDoctor,
    isError: isErrorsaleUserRegDoctor,
  } = useGetSaleUsersDoctorQuery({ sale_user_id: id });
  const {
    data: saleUserRegEstab,
    isLoading: isLoadingsaleUserRegEstab,
    isError: isErrorsaleUserRegEstab,
  } = useGetSaleUsersEstablishmentQuery({ sale_user_id: id });

  if (
    isLoadingsaleuserDetail &&
    isLoadingsaleUserRegDoctor &&
    isLoadingsaleUserRegEstab
  ) {
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

  if (
    isErrorsaleuserDetail ||
    isErrorsaleUserRegDoctor ||
    isErrorsaleUserRegEstab
  ) {
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
              We couldn't retrieve your sale user details data. This is likely a
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
            <span>Error: Unable to fetch sale user details data from the server.</span>
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
    { label: "Sale User", path: "/sales-user" },
    { label: "Sale User Details" },
  ];

  return (
    <div className="flex flex-col">
      <div className="text-right py-4 px-6">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="flex justify-between">
          <div>
            <span className="text-xl font-bold">Sale User Details</span>
          </div>
          <div className="flex border border-black rounded-lg p-1 text-black hover:bg-black hover:text-white">
            <Link to="/sales-user" className="flex mr-2">
              <IoIosArrowRoundBack className="mt-1 mr-1 text-lg" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* Personal Details */}
        <div className="flex-grow mx-4">
          <div className="bg-white w-full rounded-lg overflow-hidden p-6 mb-4">
            <div className="flex">
              <FaUserAlt className="text-gray-700 mt-1" />
              &nbsp;
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                Basic Details
              </h3>
            </div>
            <hr />
            &nbsp;
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-2">
              <p>
                <span className="font-bold text-gray-400">Email</span> <br />
                {saleuserDetail?.email}
              </p>
              <p>
                <span className="font-bold text-gray-400">Active</span> <br />
                {saleuserDetail?.is_active ? (
                  <Badge className="bg-green-600/15 text-green-600 hover:bg-green-600/15 rounded-md">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-red-600/15 text-red-600 hover:bg-red-600/15 rounded-md">
                    Not Active
                  </Badge>
                )}
              </p>
            </div>
          </div>
        </div>
        {/* Doctor Details */}
        <div className="flex-grow mx-4 mt-4">
          <div className="bg-white w-full rounded-lg overflow-hidden p-6 mb-4">
            <div className="flex justify-between">
              <div className="flex">
                <FaUserAlt className="text-gray-700 mt-1" />
                &nbsp;
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Onboarded doctors
                </h3>
              </div>
              <div className="text-gray-700">
                <span className="font-bold">Count: </span>
                {saleUserRegDoctor?.results.length}
              </div>
            </div>
            <hr />
            &nbsp;
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
              {saleUserRegDoctor?.results.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        </div>
        {/* Establishment List */}
        <div className="flex-grow mx-4 mt-4">
          <div className="bg-white w-full rounded-lg overflow-hidden p-6 mb-4">
            <div className="flex justify-between">
              <div className="flex">
                <BsHospitalFill className="text-gray-700 mt-1" />
                &nbsp;
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Onboarded establishments
                </h3>
              </div>
              <div className="text-gray-700">
                <span className="font-bold">Count: </span>
                {saleUserRegEstab?.results.length}
              </div>
            </div>
            <hr />
            &nbsp;
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
              {saleUserRegEstab?.results.map((establishment) => (
                <EstablishmentCard
                  key={establishment.id}
                  establishment={establishment}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleUserDetails;
