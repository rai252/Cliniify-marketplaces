import Image from "next/image";
import Link from "next/link";
const Personalized = () => {
  return (
    <section className="specialization-list mt-20 ">
      <div className="flex flex-col mx-auto bg-gray-50">
        <div className="w-full draggable">
          <div className="container flex flex-col items-center mx-auto mt-10 mb-10 gap-10">
            <div
              className="banner-header text-center wow animate__fadeInUp"
              data-wow-duration="500ms"
              data-wow-delay="0.5s"
            >
              <h2 className="text-4xl sm:text-4xl text-gray-700 font-bold ">
                Consult specialists for personalized care.
              </h2>
              <p className="text-lg sm:text-lg text-gray-800 mt-5">
                Access to expert physicians and surgeons, advanced technologies
                and top-quality surgery facilities right here.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6 mb-8">
              <div
                className="specialization-card group rounded-lg wow animate__fadeInDown"
                data-wow-duration="200ms"
                data-wow-delay="1.1s"
              >
                <Link href="/doctors">
                  <div className="relative block rounded-lg overflow-hidden">
                    <Image
                      src="/images/dentalimg.jpg"
                      alt="Dentist"
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300 rounded-lg"
                    />
                    <div className="absolute inset-0 flex justify-center items-center text-white bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg">
                      <div className="text-center">
                        <div className="bg-white w-16 h-16 flex justify-center items-center rounded-lg mx-auto">
                          <img
                            src="/images/Dentisticon.svg"
                            alt="Dentist Icon"
                            className="w-10 h-10"
                          />
                        </div>
                        <p className="font-Inter text-2xl font-semibold mt-2">
                          Dentist
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div
                className="specialization-card group rounded-lg wow animate__fadeInDown"
                data-wow-duration="200ms"
                data-wow-delay="1.2s"
              >
                <Link href="/doctors">
                  <div className="relative block rounded-lg overflow-hidden">
                    <Image
                      src="/images/Optometristimg.png"
                      alt="Optometrist"
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white transition-all duration-300 group-hover:bg-opacity-40">
                      <div className="text-center">
                        <div className="bg-white w-16 h-16 flex justify-center items-center rounded-xl mx-auto">
                          <img
                            src="/images/EYES.svg"
                            alt="Optometrist Icon"
                            width={2000}
                            height={2000}
                            className="w-25 h-25"
                          />
                        </div>
                        <p className="font-Inter text-2xl font-semibold mt-2">
                          Optometrist
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div
                className="specialization-card group rounded-lg wow animate__fadeInDown"
                data-wow-duration="200ms"
                data-wow-delay="1.3s"
              >
                <Link href={`/doctors`}>
                  <span
                    className="relative block rounded-lg overflow-hidden"
                    style={{ width: "228.65px", height: "337.66px" }}
                  >
                    <Image
                      src="/images/Dermatologistimg.webp"
                      alt="dermatologist"
                      width={228.67}
                      height={337.66}
                      className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white transition-all duration-300 group-hover:bg-opacity-40">
                      <div className="text-center">
                        <div className="bg-white w-16 h-16 flex justify-center items-center rounded-xl mx-auto">
                          <img
                            src="/images/Dermatologisticon.svg"
                            alt="Optometrist Icon"
                            width={1500}
                            height={1000}
                            className="w-25 h-25"
                          />
                        </div>
                        <p className="font-Inter text-2xl font-semibold mt-2">
                          Dermatologist
                        </p>
                      </div>
                    </div>
                  </span>
                </Link>
              </div>

              <div
                className="specialization-card group relative rounded-lg overflow-hidden wow animate__fadeInDown"
                data-wow-duration="200ms"
                data-wow-delay="1.4s"
              >
                <Link href={`/doctors`}>
                  <span className="relative block rounded-lg overflow-hidden">
                    <Image
                      src="/images/Orthopedicimg.jpg"
                      alt="Orthopedic"
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex justify-center items-center text-white bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300">
                      <div className="text-center">
                        <div className="bg-white w-16 h-16 flex justify-center items-center rounded-xl ml-[20px]">
                          {" "}
                          <img
                            src="/images/Orthopedicicon.svg"
                            alt="Orthopedic Icon"
                            className="w-10 h-10"
                          />
                        </div>
                        <p className="font-Inter text-2xl font-semibold mt-2">
                          Orthopedic
                        </p>
                      </div>
                    </div>
                  </span>
                </Link>
              </div>

              <div
                className="specialization-card group rounded-lg wow animate__fadeInDown"
                data-wow-duration="200ms"
                data-wow-delay="1.5s"
              >
                <Link href={`/doctors`}>
                  <span className="relative block rounded-lg overflow-hidden">
                    <Image
                      src="/images/Cardiologistimg.jpg"
                      alt="Cardiologist"
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex justify-center items-center text-white bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300">
                      <div className="text-center">
                        <div className="bg-white w-16 h-16 flex justify-center items-center rounded-xl ml-[20px]">
                          {" "}
                          <img
                            src="/images/Cardiologisticon.svg"
                            alt="Neurology Icon"
                            className="w-10 h-10"
                          />
                        </div>
                        <p className="font-Inter text-2xl font-semibold mt-2">
                          Cardiologist
                        </p>
                      </div>
                    </div>
                  </span>
                </Link>
              </div>

              <div
                className="specialization-card group rounded-lg wow animate__fadeInDown"
                data-wow-duration="200ms"
                data-wow-delay="1.7s"
              >
                <Link href={`/doctors`}>
                  <span className="relative block rounded-lg overflow-hidden">
                    <Image
                      src="/images/Neurologyimg.jpg"
                      alt="Neurology"
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex justify-center items-center text-white bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300">
                      <div className="text-center">
                        <div className="bg-white w-16 h-16 flex justify-center items-center rounded-xl ml-[20px]">
                          {" "}
                          <img
                            src="/images/Neurologyicon.svg"
                            alt="Neurology Icon"
                            className="w-10 h-10"
                          />
                        </div>
                        <p className="font-Inter text-2xl font-semibold mt-2">
                          Neurology
                        </p>
                      </div>
                    </div>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Personalized;
