import Image from "next/image";
import Link from "next/link";
const Consultation = () => {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-5xl mx-auto px-4 mt-10 mb-10">
        {" "}
        <div className="mb-6 text-center wow animate__jackInTheBox">
          <h2 className="text-3xl font-semibold text-gray-700 py-6">
            Book a Consultation With Cliniify
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center px-6 lg:flex-row gap-10 space-y-6 lg:space-y-0">
          <div className="flex-1 flex flex-col items-center text-center space-y-3 wow animate__flipInX">
            <Image
              src="/images/p_1.png"
              alt="Download App"
              className="m-auto"
              width={250}
              height={250}
            />
            <h3 className="text-xl font-medium text-gray-800">
              1. Download the Cliniify App
            </h3>
            <p className="text-sm text-gray-700">
              Begin by installing the Cliniify mobile application on your
              smartphone for easy access to all features.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="flex-1 flex flex-col items-center text-center space-y-3 wow animate__flipInX"
            data-wow-delay="0.5s"
          >
            <Image
              src="/images/bookingbg.png"
              alt="Book Appointment"
              className="m-auto"
              width={250}
              height={250}
            />
            <h3 className="text-xl font-medium text-gray-800">
              2. Book Your Appointment
            </h3>
            <p className="text-sm text-gray-700">
              Select from a wide range of medical specialists and schedule your
              consultation at a time that suits you best.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="flex-1 flex flex-col items-center text-center space-y-3 wow animate__flipInX"
            data-wow-delay="0.7s"
          >
            <Image
              src="/images/bookingbg2 (2).png"
              alt="Get Consult"
              className="m-auto"
              width={250}
              height={250}
            />
            <h3 className="text-xl font-medium text-gray-800">
              3. Get medical consult
            </h3>
            <p className="text-sm text-gray-700">
              After the consultation, conveniently receive your prescription,
              medical advice, and lab orders directly to your phone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Consultation;
