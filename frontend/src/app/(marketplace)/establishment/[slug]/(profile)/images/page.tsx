import { doctorService } from "@/services/doctor.service";
import { establishmentService } from "@/services/establishment.service";
import { IDoctor } from "@/types/doctor/doctor";
import { IEstablishment } from "@/types/establishment/establishment";
import ToggleButtons from "@/components/ToggleButtons";
import CarouselComponent from "./components/establishmentCarousel";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="mt-4">
      <Card className="my-4">
        <CardContent className="p-5">
          <ToggleButtons params={{ slug: establishmentData.slug }} />
          <h1 className="text-3xl ml-5 text-gray-800 font-medium mb-2">
            {establishmentData.name}
          </h1>
          <CarouselComponent images={establishmentData.establishment_images} />
        </CardContent>
      </Card>
    </section>
  );
}
