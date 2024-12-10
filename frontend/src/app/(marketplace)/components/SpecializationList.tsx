import Image from "next/image";

export default function SpecializationList() {
  return (
    <section className="specialization-list mt-8">
      <div className="flex flex-col mx-auto bg-white">
        <div className="w-full draggable">
          <div className="container flex flex-col items-center mx-auto mt-10 gap-10">
            <div
              className="banner-header text-center wow animate__fadeInUp"
              data-wow-duration="500ms"
              data-wow-delay="0.9s"
            >
              <h1 className="text-4xl sm:text-4xl text-gray-700 font-bold ">
                Quality Care, Tailored for You
              </h1>
              <p className="text-lg sm:text-lg text-gray-800 mt-5">
                We provide expert care that addresses your physical and
                emotional health needs.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div
                className="flex flex-col items-center text-center gap-3 px-6 py-8 bg-white rounded-lg shadow-lg border border-gray-100 wow animate__flipInX"
                data-wow-duration="500ms"
                data-wow-delay="1.5s"
              >
                <span className="text-blue-500">
                  <Image
                    src="/images/benefit-icon-01.png"
                    alt="Qualified Doctors"
                    width={50}
                    height={50}
                  />
                </span>
                <h3 className="font-semibold text-lg text-dark-grey-700">
                  Expert Doctors
                </h3>
                <p className="text-gray-600">
                  Our team of highly trained and experienced doctors is
                  committed to providing exceptional care.
                </p>
              </div>
              <div
                className="flex flex-col items-center text-center gap-3 px-6 py-8 bg-white rounded-lg shadow-lg border border-gray-100 wow animate__flipInX"
                data-wow-duration="500ms"
                data-wow-delay="1.6s"
              >
                <span className="text-blue-500">
                  <Image
                    src="/images/benefit-icon-02.png"
                    alt="Modern Equipment"
                    width={50}
                    height={50}
                  />
                </span>
                <h3 className="font-semibold text-lg text-dark-grey-700">
                  State-of-the-Art Technology
                </h3>
                <p className="text-gray-600">
                  Experience superior care with cutting-edge medical equipment
                  that enhances diagnosis and treatment.
                </p>
              </div>
              <div
                className="flex flex-col items-center text-center gap-3 px-6 py-8 bg-white rounded-lg shadow-lg border border-gray-100 wow animate__flipInX"
                data-wow-duration="500ms"
                data-wow-delay="1.7s"
              >
                <span className="text-blue-500">
                  <Image
                    src="/images/benefit-icon-03.png"
                    alt="Personalized Approach"
                    width={50}
                    height={50}
                  />
                </span>
                <h3 className="font-semibold text-lg text-dark-grey-700 ">
                  Personalized Care
                </h3>
                <p className="text-gray-600">
                  We focus on understanding your unique health needs, providing
                  a care plan tailored to you.
                </p>
              </div>
              <div
                className="flex flex-col items-center text-center gap-3 px-6 py-8 bg-white rounded-lg shadow-lg border border-gray-100 wow animate__flipInX"
                data-wow-duration="500ms"
                data-wow-delay="1.8s"
              >
                <span className="text-blue-500">
                  <Image
                    src="/images/benefit-icon-04.png"
                    alt="Emergency Assistance"
                    width={50}
                    height={50}
                  />
                </span>
                <h3 className="font-semibold text-lg text-dark-grey-700">
                  Immediate Care
                </h3>
                <p className="text-gray-600">
                  Access urgent medical support whenever you need it, with our
                  responsive and efficient emergency care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
