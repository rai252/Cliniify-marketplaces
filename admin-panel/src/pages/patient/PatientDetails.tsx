import React from "react";
import { useParams } from "react-router-dom";
import { useGetPatientByIdQuery } from "@/services/patients/patient.service";
import { FaUserAlt } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import Breadcrumb from "@/components/Breadcrumb";
import defaultImage from "@/assets/images/default-avatar.webp"

const PatientDetails: React.FC = () => {
  const { id = "" } = useParams();
  const {
    data: patient,
    isLoading,
    isError,
  } = useGetPatientByIdQuery({ id: id, expand: "address" });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Patients", path: "/patients" },
    { label: "Patient Details" },
  ];

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

  if (isError || !patient) {
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
    <div className="w-full mx-auto px-4 py-6 sm:py-8">
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Patient Details</h1>
        <Link
          to="/patients"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          <IoIosArrowRoundBack className="mr-2" /> Back
        </Link>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaUserAlt className="mr-2 text-gray-600" /> Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <img
                src={patient.avatar as string || defaultImage}
                alt="Avatar"
                className="w-32 h-32 object-cover rounded-full mx-auto sm:mx-0"
              />
            </div>
            {[
              { label: "Full Name", value: patient.full_name },
              { label: "Phone", value: patient.phone || "N/A" },
              {
                label: "Secondary Phone",
                value: patient.secondary_phone || "N/A",
              },
              { label: "Email", value: patient.email || "N/A" },
              {
                label: "Gender",
                value:
                  patient.gender === "M"
                    ? "Male"
                    : patient.gender === "F"
                    ? "Female"
                    : patient.gender === "O"
                    ? "Other"
                    : "N/A",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IoHomeSharp className="mr-2 text-gray-600" /> Address Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                label: "Street",
                value: patient.address?.address_line_1 || "N/A",
              },
              {
                label: "Locality",
                value: patient.address?.address_line_2 || "N/A",
              },
              { label: "Landmark", value: patient.address?.landmark || "N/A" },
              { label: "City", value: patient.address?.city || "N/A" },
              { label: "State", value: patient.address?.state || "N/A" },
              { label: "Pincode", value: patient.address?.pincode || "N/A" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaUserAlt className="mr-2 text-gray-600" /> Additional Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: "Blood Group", value: patient.blood_group || "Unknown" },
              { label: "Age", value: patient.age || "N/A" },
              {
                label: "Date of Birth",
                value: patient.date_of_birth
                  ? new Date(patient.date_of_birth)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\//g, "-")
                  : "N/A",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDetails;
