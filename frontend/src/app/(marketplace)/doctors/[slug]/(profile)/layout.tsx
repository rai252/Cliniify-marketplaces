import { FiCheckCircle } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import ShareFeedback from "@/app/(marketplace)/components/share-feedback";
import AppointmentBooking from "./components/time-slots";
import { doctorService } from "@/services/doctor.service";
import ButtonsPage from "./components/buttons";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function Main({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;
  const data = await doctorService.getDoctorDetail({ id: slug });

  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <section className="doctor-section mt-10 bg-slate-50">
        <div className="flex flex-col container mx-auto">
          <div className="w-full">
            <Card key={data?.id} className="my-4">
              <CardContent className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-2/3 mt-5">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:mr-5 relative">
                      {data?.is_verified && (
                        <Badge className="bg-teal-700 hover:bg-teal-600 absolute left-1 top-1 rounded-lg">
                          <FiCheckCircle className="text-xs text-white inline-block" />{" "}
                          &nbsp; Verified
                        </Badge>
                      )}
                      <Image
                        src={
                          typeof data?.avatar === "string"
                            ? data.avatar
                            : "/images/doctor-image.webp"
                        }
                        alt=""
                        className="object-cover w-40 h-40 rounded-lg shadow-lg sm:w-40 sm:h-40"
                        style={{ maxWidth: "160px", maxHeight: "160px" }}
                        width={500}
                        height={500}
                      />
                    </div>
                    <div className="sm:text-left mt-5">
                      <p className="text-xl font-semibold mb-2 text-teal-700 hover:text-teal-600">
                        {data?.full_name}
                      </p>
                      <p className="text-base text-gray-800 mb-2">
                        {data?.specializations.map((specialization, index) =>
                          index === 0
                            ? `${specialization.name}`
                            : `, ${specialization.name}`
                        )}
                      </p>
                      <p className="text-sm text-black mb-2">
                        <span className="text-md text-black">
                          {data?.experience_years}
                        </span>{" "}
                        Years of experience
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{data?.bio}</p>
                      <p>
                        <ShareFeedback doctorId={data.id} />
                      </p>
                    </div>
                  </div>

                  <div className="flex-grow border-b border-gray-200 mt-5 mb-5"></div>
                  <ButtonsPage params={{ slug: data?.slug.toString() }} />
                  <div>{children}</div>
                </div>
                <AppointmentBooking />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
