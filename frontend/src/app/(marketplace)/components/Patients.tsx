import Image from "next/image";

const Patients = () => {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="container px-4 mx-auto">
        <span className="font-Inter inline-block py-1 px-3 mb-4 text-base font-semibold text-teal-900 bg-orange-50 rounded-full">
          Healthcare Services
        </span>

        <h2 className="text-4xl sm:text-4xl text-gray-700 font-bold ">
          Steps For New Patients
        </h2>

        <div className="max-w-20xl mx-auto">
          <div className="flex flex-wrap -mx-5 mt-8 items-center">
            <div className="w-full lg:w-1/5 xl:w-auto mx-auto px-4 mb-16 lg:mb-0">
              <Image
                className="block h-80 md:h-100 lg:h-auto xl:h-150 mx-auto"
                src="/images/bgstep.webp"
                alt=""
                height={800}
                width={500}
              />
            </div>
            <div className="w-full lg:w-2/5 xl:w-auto px-4 lg:pb-10 mb-16 lg:mb-0 ml-2 mt-10">
              <div className="mx-auto max-w-sm">
                <div
                  className="flex items-center pb-12 mb-12 border-b border-gray-100 wow animate__flipInX"
                  data-wow-duration="500ms"
                  data-wow-delay="0.5s"
                >
                  <div className="relative flex-shrink-0 w-50 h-50 mr-6 bg-blue-100 rounded-lg py-[15px] px-[5px]">
                    <Image
                      src="/images/hreat-pulse.svg"
                      alt=""
                      height={100}
                      width={100}
                      className="rounded-lg"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black text-xl text-blue-900 font-bold">
                      1
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      Choose Your Doctor
                    </h3>
                    <span className="text-sm text-gray-400">
                      Lorem Ipsum is simply dummy text of the printing..
                    </span>
                  </div>
                </div>
                <div
                  className="flex items-center pb-12 mb-12 border-b border-gray-100 wow animate__flipInX"
                  data-wow-duration="500ms"
                  data-wow-delay="0.5s"
                >
                  <div className="relative flex-shrink-0 w-50 h-50 mr-6 bg-yellow-100 rounded-lg py-[15px] px-[5px]">
                    <Image
                      src="/images/hreat-pulse.svg"
                      alt=""
                      height={100}
                      width={100}
                      className="rounded-lg"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black text-xl text-red-900 font-bold">
                      3
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Set Appointment</h3>
                    <span className="text-sm text-gray-400">
                      After choose your preferred doctor, set your appointment..
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/5 xl:w-auto px-4 lg:pb-10 mb-16 lg:mb-0 ml-2 mt-10">
              <div className="mx-auto max-w-sm">
                <div
                  className="flex items-center pb-12 mb-12 border-b border-gray-100 wow  animate__flipInX"
                  data-wow-duration="500ms"
                  data-wow-delay="0.5s"
                >
                  <div className="relative flex-shrink-0 w-50 h-50 mr-6 bg-orange-100 rounded-lg py-[15px] px-[5px]">
                    <Image
                      src="/images/hreat-pulse.svg"
                      alt=""
                      height={100}
                      width={100}
                      className="rounded-lg"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black text-xl text-orange-900 font-bold">
                      2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Consult With Doctor
                    </h3>
                    <span className="text-sm text-gray-400">
                      Discuss your health concerns with the doctor you choosed..
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center pb-12 mb-12 border-b border-gray-100 wow animate__flipInX"
                  data-wow-duration="500ms"
                  data-wow-delay="0.5s"
                >
                  <div className="relative flex-shrink-0 w-50 h-50 mr-6 bg-red-200 rounded-lg py-[15px] px-[5px]">
                    <Image
                      src="/images/hreat-pulse.svg"
                      alt=""
                      height={100}
                      width={100}
                      className="rounded-lg"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black text-xl text-teal-900 font-bold">
                      4
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Get recommendation
                    </h3>
                    <span className="text-sm text-gray-400">
                      After consulting you receive personalized advice &
                      solution..
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Patients;
