import SearchComponent from "@/components/search-box";
import Image from "next/image";

export default async function DoctorList() {
  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <section
        className="bg-white bg-no-repeat bg-center bg-cover bg-fixed"
        style={{
          backgroundImage: "url('/images/doctor-banner.png')",
        }}
      >
        <div className="py-20 bg-black bg-opacity-20">
          <div className="container px-4 mx-auto mt-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="  mb-9 text-sm text-white font-semibold uppercase tracking-px">
                👋 Hello, by searching here, you may locate the doctors.
              </p>
              <h2 className="  mb-11 text-4xl md:text-6xl xl:text-6xl text-white font-bold text-center tracking-px-n leading-none">
                Your home for health. Find and Book
              </h2>
              <div className="md:inline-block">
                <SearchComponent />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-2 bg-white overflow-hidden">
        <div className="mx-auto px-4">
          <div className="relative px-8 pt-5 md:pb-10 lg:pt-10 lg:pb-10 rounded-3xl">
            <div className="relative max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center -m-8">
                <div className="w-full md:w-1/2 p-8 mb-16 md:mb-0">
                  <div className="md:max-w-xl">
                    <span className="  inline-block mb-5 text-sm text-teal-700 font-bold uppercase tracking-widest">
                      Book Appointments
                    </span>
                    <h2 className="  font-heading mb-6 text-4xl md:text-4xl lg:text-5xl text-gray-800 font-medium tracking-tight">
                      Instant appointment with doctors.Promised.
                    </h2>
                    <p className="  text-medium mb-5">
                      Secure instant doctor appointments with our seamless
                      booking platform. No more waiting—gain access to top-rated
                      healthcare professionals instantly, anytime you need. Our
                      service guarantees a swift, reliable path to managing your
                      health with ease and confidence.
                    </p>
                    <ul>
                      <li className="mb-3 inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>100,000 Certified Medical Professionals</span>
                      </li>
                      <li className="mb-3 inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>3M+ Suggestions for Patients</span>
                      </li>
                      <li className="inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>25 million patients annually</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <Image
                    className="md:w-full mx-auto md:ml-0"
                    src="/images/doctor-appointment.jpg"
                    alt=""
                    height={400}
                    width={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-2 bg-gray-50 overflow-hidden">
        <div className="mx-auto px-4">
          <div className="relative px-8 pt-5 md:pb-16 lg:pt-10 lg:pb-44 rounded-3xl">
            <div className="relative max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center -m-8">
                <Image
                  className="md:w-1/2 lg:w-auto mx-auto"
                  src="/images/contact.png"
                  alt=""
                  height={400}
                  width={400}
                />
                <div className="w-full md:w-1/2 p-8 mb-16 md:mb-0">
                  <div className="md:max-w-xl">
                    <h2 className="  font-heading mb-6 text-4xl md:text-4xl lg:text-5xl text-gray-800 font-medium tracking-tight">
                      Download the Cliniify app
                    </h2>
                    <ul>
                      <li className="mb-3 inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>Find doctors</span>
                      </li>
                      <li className="mb-3 inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>Book appointments</span>
                      </li>
                      <li className="mb-3 inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>Reshedule appointments</span>
                      </li>
                      <li className="mb-3 inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>Give feedbacks</span>
                      </li>
                      <li className="inline-flex items-center w-full font-medium leading-relaxed">
                        <svg
                          className="mr-3"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill="#1dab9d"
                          ></circle>
                          <path
                            d="M5.91699 10.5834L8.25033 12.9167L14.0837 7.08337"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span>Read articles and blogs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
