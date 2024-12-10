"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PatientPage() {
  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row h-full lg:h-full">
            <div className="sm:w-1/2 sm:mr-8 flex flex-col justify-center mt-32 sm:mt-10 sm:py-28">
              <div className="hidden sm:mb-8 sm:flex sm:justify-start"></div>
              <h1 className="  font-medium text-2xl tracking-tight text-gray-900 sm:text-4xl">
                Transforming the patient experience by providing world-class
                services to the Physicians
              </h1>
              <div className="flex items-center flex-wrap mt-10">
                <Link href={`/register`}>
                  <Button className="bg-teal-700 text-base">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="sm:w-1/2 flex justify-end order-first sm:order-last">
              <Image
                src="/images/patient/patient_banner.jpg"
                alt=""
                width={500}
                height={600}
                style={{ width: "200%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="pt-10 lg:pt-10 pb-10 lg:pb-10 bg-teal-50">
        <div className="container">
          <h1 className="text-center   font-medium text-3xl tracking-tight text-gray-900 sm:text-4xl mb-5">
            Improving The Patient Experience With Superior Satisfaction!
          </h1>
          <p className="text-center   text-base mt-2 mb-10">
            As a physician led organization, Cliniify Marketplace is dedicated
            to assisting the physician and healthcare business community in
            providing you the services you need in the most convenient and
            efficient way for the best value in your market.
          </p>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 md:w-1/4 px-2">
              <div className="bg-white rounded-lg overflow-hidden mb-10 h-96">
                <Image
                  src="/images/patient/physician.png"
                  alt="image"
                  className="w-full"
                  width={500}
                  height={600}
                />
                <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                  <p className="text-base text-body-color leading-relaxed mb-7">
                    Connect with your preferred physician virtually, through any
                    device
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 px-2">
              <div className="bg-white rounded-lg overflow-hidden mb-10 h-96">
                <Image
                  src="/images/patient/scheduling.png"
                  alt="image"
                  className="w-full"
                  width={500}
                  height={600}
                />
                <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                  <p className="text-base text-body-color leading-relaxed mb-7">
                    Online Clinic and Telemedicine Scheduling.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 px-2">
              <div className="bg-white rounded-lg overflow-hidden mb-10 h-96">
                <Image
                  src="/images/patient/healthcare.png"
                  alt="image"
                  className="w-full"
                  width={500}
                  height={600}
                />
                <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                  <p className="text-base text-body-color leading-relaxed mb-7">
                    A Marketplace to shop for Healthcare Services.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 px-2">
              <div className="bg-white rounded-lg overflow-hidden mb-10 h-96">
                <Image
                  src="/images/patient/record.png"
                  alt="image"
                  className="w-full"
                  width={500}
                  height={600}
                />
                <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                  <p className="text-base text-body-color leading-relaxed mb-7">
                    A Personal Health Record to Avoid Filling out the same forms
                    with every doctor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-10 lg:pt-10 pb-10 lg:pb-10">
        <div className="container">
          <h1 className="text-center   font-medium text-3xl tracking-tight text-gray-900 sm:text-4xl mb-5">
            Moving Healthcare To A Patient-Centered Industry
          </h1>
          <p className="text-center   text-base mt-2 mb-10">
            Join Cliniify Marketplace to interact with our community of doctors
            focused on improving your experience in receiving the most efficient
            value-based care.
          </p>
          <div className="flex justify-center flex-wrap mt-10">
            <Link href={`/register`}>
              <Button className="bg-teal-700 text-base">Register Now</Button>
            </Link>
          </div>
          <div className="flex flex-col mx-auto bg-white">
            <div className="w-full draggable">
              <div className="container flex flex-col items-center mx-auto mt-8 gap-8">
                <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-8 text-center">
                  <div className="flex flex-col items-center gap-3 px-8 py-10 rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/telemedicine- appointment.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Telemedicine Appointment
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10 rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/clinic-appointment.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Clinic/House Appointment
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/marketplace.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Marketplace
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/personal-health-record.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Personal Health Record
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/messaging.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Messaging
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/cliniify-community.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Cliniify Community
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/news.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">News</p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/educational-videos.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Educational Videos
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/ask-our-doctors.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Ask our Doctors
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/patient/price-transparency.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Price Transparency
                    </p>
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
