import DoctorCarousel from "@/components/DoctorCarousel";

const BookDoctor = () => {
  return (
    <section
      className="works-list bg-cover pt-2"
      style={{ backgroundImage: "url('/images/bg.avif')" }}
    >
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center h-full">
        <div className="grid grid-cols-3 gap-5 items-center">
          <div className="col-span-1 text-center lg:text-left mb-8 lg:mb-0 px-5">
            <h2 className="text-4xl sm:text-4xl font-bold text-gray-700 wow animate__fadeIn">
              Book Our Doctor
            </h2>
            <div
              className="wow animate__fadeInUp"
              data-wow-duration="500ms"
              data-wow-delay="0.5s"
            >
              <p className="text-base sm:text-4sm text-gray-700 mt-2 ">
                Access top-rated physicians and surgeons who provide
                personalized, world-class care.
              </p>
              <p className="text-base sm:text-4sm text-gray-600 mt-2">
                With their expertise and dedication, we ensure the highest
                standard of treatment tailored to your health needs, offering
                reliable, compassionate, and exceptional healthcare for your
                peace of mind. Book your appointment with trusted specialists
                today.
              </p>
            </div>
          </div>
          <div className="col-span-2 ">
            <DoctorCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};
export default BookDoctor;
