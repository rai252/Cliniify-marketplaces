import { Card, CardContent } from "@/components/ui/card";
import { doctorService } from "@/services/doctor.service";
import { establishmentService } from "@/services/establishment.service";
import { IDoctor } from "@/types/doctor/doctor";
import { IEstablishment } from "@/types/establishment/establishment";
import Image from "next/image";
import ToggleButtons from "@/components/ToggleButtons";
import StarRating from "@/components/star-rating";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EstablishmentDetailProps {
  params: { slug: string };
}

async function fetchStaffDetails(staffIds: number[]): Promise<IDoctor[]> {
  const staffPromises = staffIds.map((id) =>
    doctorService.getDoctorDetail({ id })
  );
  return Promise.all(staffPromises);
}

export default async function EstablishmentDetail({
  params,
}: EstablishmentDetailProps) {
  const { slug } = params;
  const establishmentData: IEstablishment =
    await establishmentService.getEstablishmentById(slug);

  // Fetch the staff details
  const staffDetails: IDoctor[] =
    establishmentData.staffs.length > 0
      ? await fetchStaffDetails(establishmentData.staffs)
      : [];
  return (
    <section className="mt-2">
      <Card className="my-4 p-5">
        <ToggleButtons params={{ slug: establishmentData.slug }} />
        <h1 className="text-3xl ml-5 text-gray-800 font-medium">
          Doctors in {establishmentData.name}
        </h1>
        <CardContent className="max-w-[1000px]">
          {staffDetails.length > 0 ? (
            staffDetails.map((staff) => (
              <Card
                key={staff.id}
                className="w-full mb-4 hover:shadow-2xl mt-5"
              >
                <div className="sm:flex flex-col sm:flex-row items-center p-5">
                  <Link href={`/doctors/${staff.slug}`}>
                    <Image
                      src={staff.avatar || "/images/doctor-image.webp"}
                      alt={staff.full_name}
                      className="w-32 h-32 object-cover mr-4 mb-4 sm:mb-0"
                      width={500}
                      height={500}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/doctors/${staff.slug}`}
                      className="hover:underline text-teal-600"
                    >
                      <p className="  text-xl ">{staff.full_name}</p>
                    </Link>
                    <p>
                      {staff.specializations
                        ? staff.specializations
                            .map((spec) => spec.name)
                            .join(", ")
                        : "No specializations available"}
                    </p>
                    <p>{staff.experience_years} years of experience overall</p>
                    <StarRating average_rating={staff.average_rating || 0} />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-auto">
                    <Link href={`/doctors/${staff.slug}`}>
                      <Button className="  text-base hover:text-teal-600 hover:bg-slate-100 bg-teal-600 font-medium w-full sm:w-[200px] shadow-xl mb-2 mr-2">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p>No staff details available.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
