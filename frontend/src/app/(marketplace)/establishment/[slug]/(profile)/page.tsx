import { doctorService } from "@/services/doctor.service";
import { establishmentService } from "@/services/establishment.service";
import { IDoctor } from "@/types/doctor/doctor";
import { IEstablishment } from "@/types/establishment/establishment";
import ToggleButtons from "@/components/ToggleButtons";
import Summary from "@/components/Summary";
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

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <section className="mt-2 bg-slate-50">
      <Card className="my-4">
        <CardContent className="p-5">
          <ToggleButtons params={{ slug: establishmentData.slug }} />
          <h1 className="text-3xl ml-5 text-gray-800 font-medium">
            {establishmentData.name}
          </h1>

          <div className="flex flex-col sm:flex-row items-center">
            <div className="flex-1 mt-5">
              <div className="  text-medium ml-5">
                {establishmentData.summary ? (
                  <Summary summary={establishmentData.summary} />
                ) : (
                  <p>No summary available</p>
                )}
              </div>
            </div>
          </div>
          <div className="ml-5 sm:grid sm:grid-cols-3 mb-5 ">
            <div className="mb-5">
              <h1 className="text-2xl   font-medium text-gray-700 mb-3">
                Timings
              </h1>
              {establishmentData.timings && (
                <div>
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr>
                        <th className="px-2 py-3 md:px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-2 py-3 md:px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Timings
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(establishmentData.timings)
                        .sort(
                          (a, b) =>
                            daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
                        )
                        .map((day, index) => {
                          const timingsForDay =
                            establishmentData.timings?.[day];
                          if (timingsForDay) {
                            return (
                              <tr
                                key={day}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="px-2 py-4 md:px-4 border-b border-gray-200 text-sm">
                                  <p className="text-gray-900 font-medium">
                                    {day}
                                  </p>
                                </td>
                                <td
                                  className="px-2 py-4 md:px-4 border-b border-gray-200 text-sm"
                                  style={{
                                    display: "table-cell",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "8px",
                                    }}
                                  >
                                    {timingsForDay.map(
                                      (timing: any, index: number) => (
                                        <div
                                          key={index}
                                          style={{
                                            display: "inline-block",
                                            whiteSpace: "nowrap",
                                            color: "#4a5568",
                                            marginRight: "16px",
                                          }}
                                        >
                                          {timing.start_time} -{" "}
                                          {timing.end_time}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          } else {
                            return null;
                          }
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="flex flex-col   mb-5 sm:ml-20">
              <h1 className="text-2xl   font-medium text-gray-700">Address</h1>
              <p className="text-lg text-gray-700">
                {establishmentData.address.address_line_1},{" "}
                {establishmentData.address.address_line_2}
              </p>
              <p className="text-lg text-gray-700">
                {establishmentData.address.landmark}
              </p>
              <p className="text-lg text-gray-700">
                {establishmentData.address.city}
              </p>
              <p className="text-lg text-gray-700">
                {establishmentData.address.state},{" "}
                {establishmentData.address.pincode}
              </p>
            </div>
            <div className="mb-5 sm:ml-14">
              <h1 className="text-2xl   font-medium text-gray-700">
                Modes of Payment
              </h1>
              <p className="  text-gray-700 text-lg">
                Credit Card | Insurance | Cash | Cheque |
              </p>
              <p className="  text-gray-700 text-lg">
                Online Payment | Debit Card
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
