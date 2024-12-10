import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { doctorService } from "@/services/doctor.service";
import { FiClock } from "react-icons/fi";
import { Separator } from "@/components/ui/separator";
import DoctorEstablishment from "@/components/DoctorEstablishment";
import { TimeSlot } from "@/components/TimingInput";
import { establishmentService } from "@/services/establishment.service";
import { IEstablishment } from "@/types/establishment/establishment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faLocationDot } from "@fortawesome/free-solid-svg-icons";
interface DoctorDetailProps {
  params: { slug: string };
}

const faqData = [
  {
    question: "How can I schedule an appointment with a doctor?",
    answer:
      "You can schedule a doctor's appointment by calling the clinic directly, using the online appointment booking system on the clinic's website. Some clinics also allow walk-in appointments.",
  },
  {
    question:
      "What information should I provide when scheduling an appointment?",
    answer:
      "When scheduling a doctor's appointment, be prepared to provide your full name, contact information, date of birth, insurance details, and a brief description of the reason for your visit. This helps the clinic prepare for your appointment.",
  },
  {
    question: "How early should I arrive for my appointment?",
    answer:
      "It's recommended to arrive at least 15-20 minutes before your scheduled appointment time. This allows time for check-in procedures, updating information if necessary, and ensures that you are ready to see the doctor at your appointed time.",
  },
  {
    question: "Is telemedicine an option for doctor appointments?",
    answer:
      "Yes, many healthcare providers offer telemedicine services, allowing patients to consult with doctors remotely through video calls or phone calls. This option is convenient for minor issues or follow-up appointments and can save travel time.",
  },
  {
    question: "What if I have an emergency? Can I get a same-day appointment?",
    answer:
      "For emergencies, it's crucial to seek immediate medical attention. In non-emergency situations, clinics may offer same-day appointments for urgent matters. However, availability depends on the clinic's policies and the nature of your concern.",
  },
];

function format12HourTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hourValue = parseInt(hours, 10);
  const ampm = hourValue >= 12 ? "PM" : "AM";
  const formattedHour = hourValue % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

const DoctorDetail: React.FC<DoctorDetailProps> = async ({ params }) => {
  const { slug } = params;
  const doctorData = await doctorService.getDoctorDetail({
    id: slug,
    expand: "address",
  });

  const establishments =
    doctorData.associated_establishment.length > 0
      ? await Promise.all(
          doctorData.associated_establishment.map((est) =>
            establishmentService.getEstablishmentDetail({ id: est.id })
          )
        )
      : [];

  const timings = establishments.reduce(
    (acc: { [key: number]: any }, est: IEstablishment) => {
      acc[est.id] = {
        name: est.name,
        timings: est.timings,
      };
      return acc;
    },
    {}
  );

  return (
    <>
      <div className="doctor-information">
        <div className="mb-4 sm:mr-20 w-full flex mt-5">
          {doctorData?.address && (
            <div className="w-full sm:w-1/2 pr-4">
              <p className="text-base text-teal-800">Address</p>
              <p className="text-sm sm:text-md text-gray-700 mt-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-500 mr-2 inline-block"
                />
                {doctorData.address?.address_line_1 &&
                  `${doctorData.address.address_line_1}, `}
                {doctorData.address?.city && `${doctorData.address.city}, `}
                {doctorData.address?.state}
              </p>
            </div>
          )}
          <div className="w-full sm:w-1/2 pl-4">
            <p className="text-base text-teal-800">
              Consultation Fees: ₹{doctorData?.fee}
            </p>
            <p className="text-sm sm:text-md text-gray-700 mt-2">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-gray-500 mr-2 inline-block"
              />
              Online Payment Available
            </p>
          </div>
        </div>

        <div className="mb-4 sm:mr-0 w-full mt-7">
          {/* <p className="  text-sm sm:text-lg text-teal-800">Timing</p> */}
          {Object.keys(timings).length > 0 ? (
            <>
              {Object.entries(timings).map(([estId, { name, timings }]) => (
                <div key={estId}>
                  <h3 className="  text-md text-teal-800 mt-2">
                    {name} - Timing
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-2 sm:grid-cols-7 sm:gap-0 sm:justify-between">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <div key={day} className="mb-4 sm:mb-0">
                        <p className="  text-sm text-black-700">
                          <FiClock className="text-gray-600 inline-block" />{" "}
                          {day}
                        </p>
                        {Array.isArray(timings[day]) ? (
                          timings[day].length > 0 ? (
                            timings[day].map(
                              (slot: TimeSlot, index: number) => (
                                <div key={index} className="flex flex-col mt-1">
                                  <p className="  text-sm text-gray-700">
                                    {format12HourTime(slot.start_time)}
                                  </p>
                                  <p className="  text-sm text-gray-700">
                                    {format12HourTime(slot.end_time)}
                                  </p>
                                </div>
                              )
                            )
                          ) : (
                            <p className="sm:text-center   text-sm text-red-600 mt-2 flex">
                              Closed
                            </p>
                          )
                        ) : timings[day] === "closed" ? (
                          <p className="sm:text-center   text-sm text-red-600 mt-2">
                            Closed
                          </p>
                        ) : (
                          <p className="  text-sm text-gray-700 mt-2">Closed</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="  text-base text-red-500 mt-2">No timings</p>
          )}
        </div>
        <Separator />
        <div className="flex">
          <div className="mb-4 sm:mr-0 w-full mt-5">
            <p className="text-md text-teal-800">Education & Specialization</p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="text-sm text-black">Speciality:</span> &nbsp;
              {doctorData?.specializations.map((specialization, index) => (
                <span key={specialization.id}>
                  {specialization.name}
                  {index < doctorData.specializations.length - 1 && ", "}
                </span>
              ))}
            </p>

            <p className="text-sm text-gray-700 mt-2">
              <span className="text-sm text-black">Completion Year:</span>{" "}
              &nbsp;{doctorData?.completion_year}
            </p>
          </div>
          <div className="mb-4 sm:mr-0 w-full mt-5">
            <DoctorEstablishment
              owned_establishment={doctorData.owned_establishment}
            />
          </div>
        </div>

        <div className="mb-8 mt-5">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="text-gray-700">
            <Accordion type="single" collapsible>
              {faqData.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-start   hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className=" ">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDetail;
