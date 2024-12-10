"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import VerifyOtp from "./components/verify-otp";
import SendOtp from "./components/send-otp";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
export default function Login() {
  const params = useSearchParams();
  const phone = params.get("phone");

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
      <header className="bg-white-50 shadow p-6">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-white">
        <div
          className="flex flex-col lg:flex-row items-center lg:space-x-16 space-y-10 lg:space-y-0 w-full max-w-7xl p-12"
          style={{ marginLeft: "1rem" }}
        >
          <div
            className="w-full lg:w-1/2 flex justify-center"
            style={{ boxShadow: "0 -2px 4px rgba(0.4, 0.0, 0.0, 0.1)" }}
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
              <div>
                <Image
                  src="/images/11.jpg"
                  alt="Image 1"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>
              <div>
                <Image
                  src="/images/6.jpg"
                  alt="Image Alt Text"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>
              <div>
                <Image
                  src="/images/12.jpg"
                  alt="Image 2"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>
              <div>
                <Image
                  src="/images/14.jpg"
                  alt="Image 3"
                  className="object-cover w-full h-full"
                  width={1100}
                  height={1100}
                  priority
                />
              </div>
            </Carousel>
          </div>

          <div className="rounded-md w-full max-w-md">
            {/* Added text above the login */}
            <div className="font-Inter text-center text-2xl text-gray-700 font-semibold mb-6">
              Connecting Doctors, Patients, and Pharma – All in One Place
            </div>

            <div>{phone ? <VerifyOtp /> : <SendOtp />}</div>

            <div className="text-center text-gray-600 text-sm text-base font-Inter mt-4">
              Join us today! Create an account to get started.{" "}
              <Link href="/register">
                <span className="text-cyan-600 text-sm font-Inter font-medium">
                  Register
                </span>
              </Link>
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
