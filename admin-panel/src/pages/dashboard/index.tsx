import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IAppointmentCount } from "@/interfaces/appointment.interface";
import { IBlogCount } from "@/interfaces/blog.interface";
import { IDoctorCount } from "@/interfaces/doctor.interface";
import { IPatientCount } from "@/interfaces/patient.interface";
import { useGetAppointmentCountsQuery } from "@/services/appointments/appoinment.service";
import { useGetBlogCountsQuery } from "@/services/blogs/blogs.service";
import { useGetDoctorCountsQuery } from "@/services/doctors/doctor.service";
import { useGetPatientCountsQuery } from "@/services/patients/patient.service";
import React, { useEffect, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";

const Dashboard: React.FC = () => {
  const [DoctorCount, setDoctorCount] = useState<IDoctorCount>();
  const [patientCount, setPatientCount] = useState<IPatientCount>();
  const [appointmentCount, setAppointmentCount] = useState<IAppointmentCount>();
  const [blogCount, setBlogCount] = useState<IBlogCount>();
  const { data: doctor_Count, isLoading: isDoctorcountLoading } =
    useGetDoctorCountsQuery({});
  const { data: patient_count, isLoading: isPatientCountLoading } =
    useGetPatientCountsQuery({});
  const { data: appointment_count, isLoading: isAppointmentCountLoading } =
    useGetAppointmentCountsQuery({});
  const { data: blog_count, isLoading: isBlogCountLoading } =
    useGetBlogCountsQuery({});

  useEffect(() => {
    if (!isDoctorcountLoading && doctor_Count) {
      setDoctorCount(doctor_Count);
    }
    if (!isPatientCountLoading && patient_count) {
      setPatientCount(patient_count);
    }
    if (!isAppointmentCountLoading && appointment_count) {
      setAppointmentCount(appointment_count);
    }
    if (!isBlogCountLoading && blog_count) {
      setBlogCount(blog_count);
    }
  }, [
    isDoctorcountLoading,
    doctor_Count,
    isPatientCountLoading,
    patient_count,
    isAppointmentCountLoading,
    appointment_count,
    isBlogCountLoading,
    blog_count,
  ]);

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) {
      return '0';
    }
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  return (
    <div className="mx-auto">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {!isDoctorcountLoading ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Total Doctors
                  </CardTitle>
                  <FaUserDoctor className="text-md" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(DoctorCount?.total_doctor_count as any) ||
                      "0"}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Skeleton className="h-[125px] w-[400px] bg-gray-200 rounded-xl" />
            </>
          )}
          {!isPatientCountLoading ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Total Patient
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M14 20H6q-.825 0-1.412-.587T4 18v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q.5 0 1 .038t1 .112zm-2-8q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m6 7h-1q-.425 0-.712-.288T16 18v-4q0-.425.288-.712T17 13h3.775q.425 0 .65.35t.025.725L20 17h.7q.425 0 .637.375t.013.75l-2.875 5.05q-.1.175-.288.125T18 23.05z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(patientCount?.total_patients_count as any) ||
                      "0"}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Skeleton className="h-[125px] w-[400px] bg-gray-200 rounded-xl" />
            </>
          )}
          {!isAppointmentCountLoading ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Total Appointments
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 19a1 1 0 1 0-1-1a1 1 0 0 0 1 1m5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1m0-4a1 1 0 1 0-1-1a1 1 0 0 0 1 1m-5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1m7-12h-1V2a1 1 0 0 0-2 0v1H8V2a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3m1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9h16Zm0-11H4V6a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V5h8v1a1 1 0 0 0 2 0V5h1a1 1 0 0 1 1 1ZM7 15a1 1 0 1 0-1-1a1 1 0 0 0 1 1m0 4a1 1 0 1 0-1-1a1 1 0 0 0 1 1"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(appointmentCount?.total_appointment_count as any) || "0"}
                  </div>
                  {/*  */}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Skeleton className="h-[125px] w-[400px] bg-gray-200 rounded-xl" />
            </>
          )}
          {!isBlogCountLoading ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Total Blogs
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M20.954 10.667c-.072-.322-.272-.621-.502-.745c-.07-.039-.522-.088-1.004-.109c-.809-.036-.898-.052-1.152-.201c-.405-.237-.516-.493-.518-1.187c-.002-1.327-.554-2.559-1.646-3.67c-.776-.793-1.645-1.329-2.634-1.629c-.236-.072-.768-.097-2.545-.118c-2.787-.033-3.405.024-4.356.402c-1.748.697-3.008 2.166-3.465 4.05c-.087.353-.103.92-.124 4.177c-.025 4.08.004 4.68.258 5.488c.212.668.425 1.077.861 1.657c.835 1.108 2.083 1.907 3.334 2.133c.595.107 7.931.135 8.683.032c1.306-.178 2.331-.702 3.293-1.684c.694-.71 1.129-1.479 1.414-2.499c.117-.424.127-.63.149-3.117c.017-1.878.002-2.758-.046-2.98M8.007 8.108c.313-.316.399-.329 2.364-.329c1.764 0 1.822.004 2.081.134c.375.189.538.456.538.88c0 .384-.153.653-.493.869c-.184.115-.293.123-2.021.133c-1.067.007-1.916-.013-2.043-.048c-.669-.184-.918-1.143-.426-1.639m7.706 8.037l-.597.098l-3.114.035c-2.736.033-3.511-.018-3.652-.08c-.288-.124-.554-.472-.602-.78c-.042-.292.104-.696.33-.9c.285-.257.409-.266 3.911-.27c3.602-.002 3.583-.003 3.925.315c.482.45.381 1.251-.201 1.582"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(blogCount?.total_blog_count as any) || "0"}
                  </div>
                  {/* */}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Skeleton className="h-[125px] w-[400px] bg-gray-200 rounded-xl" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
