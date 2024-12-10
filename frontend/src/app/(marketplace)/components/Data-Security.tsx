import Image from "next/image";

const DataSecurity = () => {
  return (
    <section
      className="specialization-list py-16"
      style={{
        background:
          "linear-gradient(88.66deg, rgb(214, 238, 255) 1.08%, rgb(249, 253, 255) 26.56%, rgb(255 255 255) 76.5%, rgb(251 251 251) 98.92%)",
      }}
    >
      <div className="container mx-auto">
        <div className="flex flex-row mx-auto">
          <div className="w-full lg:w-2/5 px-2 mt-10 flex justify-center items-center wow animate__flipInX ">
            <Image
              className="block h-80 md:h-100 lg:h-auto xl:h-100 mx-auto"
              src="/images/security.png"
              alt="Healthcare Services"
              height={850}
              width={850}
            />
          </div>

          <div className="w-full lg:w-3/5 px-6 lg:pl-12 flex flex-col justify-center">
            <div
              className="banner-header text-center lg:text-left wow animate__fadeInUp"
              data-wow-duration="500ms"
              data-wow-delay="0.5s"
            >
              <h2 className="text-3xl font-semibold text-gray-700 py-2">
                Data Security is our top priority.
              </h2>

              <div className="text-sm text-gray-600 item-center mb-6">
                <p className="text-base sm:text-4sm text-gray-700 mt-2 wow animate__flipInX">
                  Data security and privacy of online medical records,
                  healthcare services management are not only a patient’s
                  concern but also of doctors as well as ours. We understand how
                  it is important for each of who join us. To alleviate these
                  concerns we use outstanding security measures and technologies
                  that can withstand any hacking and data breach attempts. Your
                  privacy and data safety is our highest priority.
                </p>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-4">
                Explore How We Keep Your Data Secure?
              </h3>

              <div className="flex justify-start space-x-6 items-center gap-10">
                <div className="flex flex-col items-center">
                  <span className="text-blue-500">
                    <Image
                      src="/images/256-bit.svg"
                      alt="256-bit encryption"
                      height={40}
                      width={60}
                    />
                  </span>
                  <h3 className="font-semibold text-lg text-blue-500 mt-2">
                    256-bit
                  </h3>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-blue-500">
                    <Image
                      src="/images/DSCI.svg"
                      alt="DSCI"
                      height={40}
                      width={50}
                    />
                  </span>
                  <h3 className="font-semibold text-lg text-blue-500 mt-2">
                    DSCI
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-blue-500">
                    <Image
                      src="/images/iso.svg"
                      alt="ISO"
                      height={40}
                      width={50}
                    />
                  </span>
                  <h3 className="font-semibold text-lg text-blue-500 mt-2">
                    ISO
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-blue-500">
                    <Image
                      src="/images/hipaa.svg"
                      alt="HIPAA"
                      height={40}
                      width={50}
                    />
                  </span>
                  <h3 className="font-semibold text-lg text-blue-500 mt-2">
                    HIPAA
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DataSecurity;
