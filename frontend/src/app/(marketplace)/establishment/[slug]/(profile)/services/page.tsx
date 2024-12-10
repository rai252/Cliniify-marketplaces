import { Card, CardContent } from "@/components/ui/card";
import { doctorService } from "@/services/doctor.service";
import { establishmentService } from "@/services/establishment.service";
import { IDoctor } from "@/types/doctor/doctor";
import { IEstablishment } from "@/types/establishment/establishment";
import ToggleButtons from "@/components/ToggleButtons";

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
    <section className="mt-4 pb-4">
      <Card className="p-5 sm:max-w-8xl ">
        <ToggleButtons params={{ slug: establishmentData.slug }} />
        <h1 className="text-3xl ml-5 text-gray-800 font-medium">
          Services in {establishmentData.name}
        </h1>

        <CardContent>
          <ul className="mt-5 sm:grid grid-cols-2 gap-2 text-balance">
            {establishmentData.establishment_services.map((service, index) => (
              <li key={index} className="text-normal  text-gray-800 list-item">
                <span className="text-gray-600 font-medium">
                  {service.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
