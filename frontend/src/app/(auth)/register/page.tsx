"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Header from "@/components/layout/header";
import RegistrationForm from "./components/registration-form";
import Footer from "@/components/layout/footer";
export default function Register() {
  const [isDoctorRegistration, setIsDoctorRegistration] = useState(false);

  const params = useSearchParams();
  const router = useRouter();

  // Carousel responsive settings
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow p-6">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-white">
        <div
          className="flex flex-col lg:flex-row items-center lg:space-x-16 space-y-10 lg:space-y-0 w-full max-w-7xl p-12 "
          style={{ marginLeft: "3rem" }}
        >
          {/* Carousel Section */}
          <div
            className="w-full lg:w-1/2 flex justify-center"
            style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <Carousel
              responsive={responsive}
              infinite
              autoPlay
              autoPlaySpeed={5000}
              showDots={false}
              arrows={false}
              className="w-full max-w-full"
            >
              {/* Doctor Images */}
              <div>
                <Image
                  src="/images/12.jpg"
                  alt="Doctor Image 2"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>

              <div>
                <Image
                  src="/images/11.jpg"
                  alt="Doctor Image 1"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>
              {/* Patient Images */}
              <div>
                <Image
                  src="/images/5.jpg"
                  alt="Patient Image 1"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>
              <div>
                <Image
                  src="/images/6.jpg"
                  alt="Patient Image 2"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>
            </Carousel>
          </div>

          {/* Registration Form Section */}
          <div className=" rounded-md w-full max-w-md">
            {/* Logo */}
            {/* <div className="text-center mb-4">
              <Link href="/">
                <Image
                  src="/images/logo/cliniify_logo_black.png"
                  alt="Cliniify Logo"
                  width={150}
                  height={40}
                />
              </Link>
            </div> */}

            {/* <div className="text-center mb-4">
              <p className="text-gray-500">
                Enter your details below to register an account.
              </p>
            </div> */}

            <RegistrationForm
              setIsDoctorRegistration={setIsDoctorRegistration}
            />

            <div className="text-center text-sm text-gray-700 mt-4">
              Don't have an account yet?{" "}
              <button
                className="text-teal-500 hover:text-teal-600 text-sm font-medium"
                onClick={() => {
                  const searchParams = new URLSearchParams(params.toString());
                  searchParams.delete("phone");
                  router.push(`/login?${searchParams.toString()}`);
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
