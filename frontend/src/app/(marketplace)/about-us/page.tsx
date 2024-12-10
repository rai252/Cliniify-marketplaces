"use client";
import React from "react";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <section className="about-banner bg-teal-600">
        <div className="flex flex-col mx-auto">
          <div className="w-full draggable">
            <div className="container flex flex-col items-center mx-auto mt-20 mb-16">
              <h1 className="font-medium text-5xl tracking-tight text-white sm:text-4xl">
                About Us
              </h1>
              <p className="text-xl mt-2 text-white">
                Helping people to find and access the very best care
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="services-section">
        <div className="bg-teal-50">
          <div className="relative isolate lg:px-8">
            <div className="mx-auto container flex flex-col-reverse sm:flex-row py-10 sm:py-28 lg:py-10 items-center">
              <div className="sm:w-1/2 sm:mr-8 mt-8 flex flex-col items-center">
                <Image
                  src="/images/about-us/patient.png"
                  alt=""
                  width={50}
                  height={50}
                  style={{ borderRadius: "50%" }}
                />
                <p className=" text-xl font-semibold text-dark-grey-900 text-center mt-2">
                  Empowering patients to find the best care
                </p>
                <p className=" text-base text-center text-gray-700 mt-2">
                  Our healthcare reviews help patients to find the very best
                  doctor, dentist or hospital for them. Cliniify Marketplace
                  reviews give patients more visibility of their healthcare
                  options. With better insights into the specialists available
                  to them, they can book appointments with specialists that they
                  truly trust.
                </p>
              </div>
              <div className="sm:w-1/2 flex flex-col items-center">
                <Image
                  src="/images/about-us/patient-care.png"
                  alt=""
                  width={50}
                  height={50}
                  style={{ borderRadius: "50%" }}
                />
                <p className=" text-xl font-semibold text-dark-grey-900 text-center mt-2">
                  Supporting the delivery of patient-centric care
                </p>
                <p className=" text-base text-center text-gray-700 mt-2">
                  Our review technology allows doctors, dentists and hospitals
                  to seamlessly collect consistent, meaningful feedback in
                  unprecedented volumes. Access to this data supports their
                  delivery of patient-centric care, giving them the opportunity
                  to better understand, respond to and improve their patients’
                  experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="founder-section relative isolate overflow-hidden bg-white px-6 py-20 sm:py-20 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.teal.100),white)] opacity-20"></div>
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-teal-600/10 ring-1 ring-teal-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10">
            <blockquote className="text-center text-xl  font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p>
                “Our health is the most precious thing we have. We want Cliniify
                Marketplace to add greater transparency into healthcare so that
                patients can connect with providers that they really trust.”
              </p>
            </blockquote>
            <figcaption className="mt-0 sm:mt-10">
              <Image
                className="mx-auto h-20 w-20 rounded-full object-top object-fit"
                src="/images/ILA-DESAI.png"
                alt=""
                width={400}
                height={400}
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className=" font-semibold text-gray-900">ILA DESAI</div>
                <svg
                  viewBox="0 0 2 2"
                  width="3"
                  height="3"
                  aria-hidden="true"
                  className="fill-gray-900"
                >
                  <circle cx="1" cy="1" r="1" />
                </svg>
                <div className=" text-gray-600">Founder</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="healthcare-section">
        <div className="flex flex-col mx-auto bg-amber-50">
          <div className="w-full draggable">
            <div className="container flex flex-col items-center mx-auto mt-8 gap-8">
              <h1 className=" font-medium text-3xl tracking-tight text-gray-900 sm:text-4xl">
                A review platform purpose-built for the intricacies of
                healthcare
              </h1>
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="flex flex-col items-center gap-3 px-6 py-6 border border-orange-700/30 bg-orange-50 shadow-lg rounded-lg">
                  <Image
                    src="/images/about-us/anonymous.png"
                    alt=""
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                  />
                  <p className=" text-xl font-semibold text-dark-grey-900 text-center">
                    Anonymous
                  </p>
                  <p className=" text-base text-center text-gray-700">
                    Healthcare is a personal and private experience. We give
                    patients full anonymity so that they can feel confident
                    sharing their feedback
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 px-6 py-6 border border-orange-700/30 bg-orange-50 shadow-lg rounded-lg">
                  <span>
                    <Image
                      src="/images/about-us/verified.png"
                      alt=""
                      width={50}
                      height={50}
                    ></Image>
                  </span>
                  <p className=" text-xl font-semibold text-dark-grey-900">
                    Verified
                  </p>
                  <p className=" text-base text-center text-gray-700">
                    Cliniify Marketplace is a closed review platform and all
                    feedback is verified. We only ever want to publish genuine
                    experiences from real patients
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 px-6 py-6 border border-orange-700/30 bg-orange-50 shadow-lg rounded-lg">
                  <span>
                    <Image
                      src="/images/about-us/representative.png"
                      alt=""
                      width={50}
                      height={50}
                    ></Image>
                  </span>
                  <p className=" text-xl font-semibold text-dark-grey-900">
                    Representative
                  </p>
                  <p className=" text-base text-center text-gray-700">
                    We aim to collect reviews from every person a specialist
                    sees, so that we can provide a fair and authentic depiction
                    of the patient experience
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 px-6 py-6 border border-orange-700/30 bg-orange-50 shadow-lg rounded-lg hover:zoom-in">
                  <span>
                    <Image
                      src="/images/about-us/meaningful.png"
                      alt=""
                      width={50}
                      height={50}
                    ></Image>
                  </span>
                  <p className=" text-xl font-semibold text-dark-grey-900">
                    Meaningful
                  </p>
                  <p className=" text-base text-center text-gray-700">
                    We offer more than a star rating. Our review technology
                    allows us to give in-depth feedback on specific conditions
                    and treatments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="about-cliniify">
        <div className="mx-auto">
          <div className="w-full">
            <div className="container mt-16 mb-16">
              <h1 className=" font-medium text-3xl tracking-tight text-gray-900 sm:text-4xl text-center">
                The Cliniify Marketplace story
              </h1>
              <p className=" text-base mt-10">
                Co-founders Stephanie and Suman launched Cliniify Marketplace in
                2015 when they were working as surgeons in the NHS.
              </p>
              <p className=" text-base mt-5">
                Their lightbulb moment came when Stephanie was dealing with a
                medical issue and struggling to find a specialist online she
                trusted. At the same time, Suman was supporting an ill relative
                and finding it difficult to find the right clinician for them.
                They felt lost and anxious, not knowing who to turn to.
              </p>
              <p className=" text-base mt-5">
                They knew something needed to change, so decided to do something
                about it. Passionate about the idea of using technology to add
                greater transparency to the sector, Stephanie and Suman
                developed Cliniify Marketplace.
              </p>
              <p className=" text-base mt-5">
                Since launching, they have been able to create a healthcare
                review platform that gives patients greater visibility of their
                healthcare options, and provides doctors, dentists and hospitals
                with the feedback needed to support their delivery of
                patient-centric care.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative  bg-blueGray-50">
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-teal-800"
            ></span>
          </div>
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <h1 className=" text-white font-semibold text-4xl sm:text-5xl">
                  Our mission and vision
                </h1>
                <p className=" mt-4 text-lg text-white">
                  We help doctors collect feedback, and as a result, help
                  patients find the best care.
                </p>
              </div>
            </div>
          </div>
          <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px">
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>
        <section className="pb-10 bg-blueGray-200 -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <Image
                        src="/images/about-us/mission.png"
                        alt=""
                        height={100}
                        width={100}
                      ></Image>
                    </div>
                    <h6 className=" text-xl font-semibold">Mission</h6>
                    <p className=" mt-2 mb-4 text-blueGray-500">
                      Divide details about your product or agency work into
                      parts. A paragraph describing a feature will be enough.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                      <Image
                        src="/images/about-us/vision.png"
                        alt=""
                        height={100}
                        width={100}
                      ></Image>
                    </div>
                    <h6 className=" text-xl font-semibold">Vision</h6>
                    <p className=" mt-2 mb-4 text-blueGray-500">
                      Keep you user engaged by providing meaningful information.
                      Remember that by this time, the user is curious.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                      <Image
                        src="/images/about-us/goal.png"
                        alt=""
                        height={100}
                        width={100}
                      ></Image>
                    </div>
                    <h6 className=" text-xl font-semibold">Goal</h6>
                    <p className=" mt-2 mb-4 text-blueGray-500">
                      Write a few lines about each one. A paragraph describing a
                      feature will be enough. Keep you user engaged!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section className="commitment-section">
        <div className="flex flex-col mx-auto bg-white">
          <div className="w-full draggable">
            <div className="container flex flex-col items-center mx-auto mt-8 gap-8">
              <h1 className=" font-medium text-3xl text-gray-900 sm:text-4xl">
                Our commitment to trust and transparency
              </h1>
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="flex flex-col items-center gap-3 px-8 py-10 rounded-xl border border-teal-400 shadow-main">
                  <span>
                    <Image
                      src="/images/about-us/patients.png"
                      alt=""
                      width={100}
                      height={100}
                    ></Image>
                  </span>
                  <p className=" text-base text-dark-grey-900">
                    We launched Cliniify Marketplace after noticing just how
                    difficult it was to find reliable, representative and
                    verified healthcare reviews. Not being able to get easy
                    access to feedback was affecting patients as well as
                    doctors, dentists and hospitals.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 px-8 py-10 rounded-xl border border-teal-400 shadow-main">
                  <span>
                    <Image
                      src="/images/about-us/doctor.png"
                      alt=""
                      width={100}
                      height={100}
                    ></Image>
                  </span>
                  <p className=" text-base text-dark-grey-900">
                    We are adding this trust and transparency back into
                    healthcare. Our review technology helps doctors, dentists
                    and hospitals deliver patient-centric care. We also empower
                    patients to confidently share their experiences and find the
                    best care available.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 px-8 py-10 rounded-xl border border-teal-400 shadow-main">
                  <span>
                    <Image
                      src="/images/about-us/policies.png"
                      alt=""
                      width={100}
                      height={100}
                    ></Image>
                  </span>
                  <p className=" text-base text-dark-grey-900">
                    Our policies and guidelines ensure that Cliniify Marketplace
                    remains a trustworthy platform for healthcare reviews. We
                    only ever want to document patient experiences that are
                    meaningful, representative and importantly, genuine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
