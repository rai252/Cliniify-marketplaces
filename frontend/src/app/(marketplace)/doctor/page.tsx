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
              <h1 className="text-3xl sm:text-3xl text-gray-700 font-bold ">
                Grow And Market Your Practice In The Most Efficient Way!
              </h1>

              <div className="flex items-center flex-wrap mt-4">
                <Link href={`/register?type=doctor`}>
                  <Button className="text-base bg-teal-700">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="sm:w-1/2 flex justify-end order-first sm:order-last">
              <Image
                src="/images/doctor/doctor.png"
                alt=""
                width={500}
                height={600}
                style={{ width: "200%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="pt-10 lg:pt-10 pb-10 lg:pb-10 bg-slate-50">
        <div className="container">
          <div
            className="banner-header text-center wow animate__fadeInUp"
            data-wow-duration="500ms"
            data-wow-delay="0.9s"
          >
            <h1 className="text-3xl sm:text-3xl text-gray-700 font-bold ">
              Effortlessly grow and market your practice!
            </h1>
            <p className="text-lg sm:text-lg text-gray-800 mt-4 mb-6">
              We empower physicians with an affordable digital platform to
              deliver efficient, high-value care and compete against costly,
              inefficient providers.
            </p>
          </div>

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
                    Digitally market your practice and provide price
                    transparency.
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
                    Improve the patient experience and patient engagement.
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
                    Improve practice efficiency and watch your practice grow.
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
          <div
            className="banner-header text-center wow animate__fadeInUp"
            data-wow-duration="500ms"
            data-wow-delay="0.9s"
          >
            <h1 className="text-3xl sm:text-3xl text-gray-700 font-bold ">
              Services Critical To Your Practice!
            </h1>
            <p className="text-lg sm:text-lg text-gray-800 mt-4 mb-6">
              Integrate Cliniify Marketplace to attract patients and grow your
              practice.
            </p>
          </div>

          <div className="flex flex-col mx-auto bg-white">
            <div className="w-full draggable">
              <div className="container flex flex-col items-center mx-auto  gap-8">
                <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-6 mb-8 text-center">
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
                      Telemedicine
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
                      Appointment Scheduler
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
                        src="/images/doctor/network-ehr.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Network EHR
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/doctor/website-development.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Website Development
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/doctor/digital-marketing-analytics.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Digital Marketing Analytics
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/doctor/messages.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Messages
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/doctor/community.png"
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
                        src="/images/doctor/news.png"
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
                        src="/images/doctor/educational-videos.png"
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
                        src="/images/doctor/doctor-network.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Doctor Network
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 px-8 py-10  rounded-3xl shadow-main">
                    <div className="hover:bg-teal-50 border border-slate-300 hover:border-teal-500 p-6 rounded-full">
                      <Image
                        src="/images/doctor/referrals.png"
                        alt=""
                        width={80}
                        height={80}
                      ></Image>
                    </div>
                    <p className="  text-xl font-v text-dark-grey-900">
                      Referrals
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
