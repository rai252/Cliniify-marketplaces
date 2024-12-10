import Image from "next/image";
import Link from "next/link";
const Features = () => {
  return (
    <section className="specialization-list py-16 mb-20">
      <div className="container mx-auto px-2 ">
        {/* Title */}
        <div
          className="banner-header text-center wow animate__fadeInUp"
          data-wow-duration="500ms"
          data-wow-delay="0.5s"
        >
          <h2 className="text-4xl sm:text-4xl mb-5 text-gray-700 font-bold ">
            Available Features
          </h2>
        </div>
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 pt-10 wow animate__fadeInUp">
          {[
            {
              src: "/images/features/DRTOP-easy-access.png",
              alt: "Mobile Access",
              title: "Mobile and Desktop",
              description:
                "The platform can be easily accessed through either a mobile or a desktop.",
            },
            {
              src: "/images/features/helpdesk.png",
              alt: "24x7 Help Desk",
              title: "24x7 Help Desk",
              description:
                "24x7 help desk with video conferencing to attend your queries.",
            },
            {
              src: "/images/features/timetable.png",
              alt: "Dynamic Scheduling",
              title: "Dynamic Appointment",
              description:
                "Schedule directly from your mobile or with the assistance of our helpdesk team.",
            },
            {
              src: "/images/features/time saving.png",
              alt: "No Waiting Time",
              title: "No Waiting Time",
              description:
                "The doctor will call you directly on your mobile at the time of the appointment.",
            },
            {
              src: "/images/features/videoconsultation.png",
              alt: "Reschedule or Cancel",
              title: "Reschedule or Cancel",
              description:
                "Facility to reschedule or cancel appointments anytime before consultation.",
            },
            {
              src: "/images/features/timetable.png",
              alt: "Spot Booking",
              title: "Spot Booking",
              description:
                "Spot booking facility available for emergencies. Conditions apply.",
            },
            {
              src: "/images/features/ehr.png",
              alt: "Electronic Records",
              title: "Health Records",
              description:
                "Easily store patient files that are accessible to patients and doctors.",
            },
            {
              src: "/images/features/cost effective.png",
              alt: "Cost-Effective",
              title: "Cost-Effective",
              description:
                "A cost-efficient method for doctors to have their own unique telemedicine platforms.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-3 wow animate__fadeIn"
            >
              <Image
                src={feature.src}
                alt={feature.alt}
                className="m-auto"
                width={80}
                height={80}
              />
              <h3 className="text-lg font-medium text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;
