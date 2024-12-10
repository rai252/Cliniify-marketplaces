// src/app/(marketplace)/establishment/[slug]/(profile)/page.tsx
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { establishmentService } from "@/services/establishment.service";
import Image from "next/image";
import React from "react";
import { Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function EstablishmentDetail({
  children,
  params,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const { slug } = params;
  const establishmentData = await establishmentService.getEstablishmentById(
    slug
  );
  return (
    <div className="main-section bg-slate-50">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5" />
          <section className="doctor-section mt-10">
            <div className="flex flex-col container mx-auto">
              <div className="w-full">
                <Card key={establishmentData.id}>
                  <CardContent className="flex flex-col sm:flex-row">
                    <div className="overflow-hidden sm:mr-4">
                      <Image
                        src={
                          typeof establishmentData.logo === "string"
                            ? establishmentData.logo
                            : establishmentData.logo instanceof File
                            ? URL.createObjectURL(establishmentData.logo)
                            : ""
                        }
                        alt="Doctor Profile"
                        className="object-contain  border-2 border-solid border-gray-300 mt-6 p-1"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="w-full sm:w-2/3 mt-5">
                      <div className="flex flex-col sm:flex-col">
                        <div className="  text-4xl sm:mr-5 relative">
                          {establishmentData.name}
                        </div>
                        <div className="text-xl   text-gray-500">
                          {establishmentData.establishment_category}{" "}
                          <span className="text-gray-500 text-xl">Clinic</span>
                        </div>
                        <p>
                          {establishmentData.address.address_line_2},{" "}
                          {establishmentData.address.city},{" "}
                          {establishmentData.address.pincode}
                        </p>
                        <p>{establishmentData.address.state}</p>
                        <Link
                          href={establishmentData.website || " "}
                          className="text-blue-500"
                          target="blank"
                        >
                          {establishmentData.website}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <div>
                        <div className="flex ml-1.5 mb-[75px]">
                          {/* <span className="text-slate-700 font-medium mr-2">
                            {establishmentData.average_establishment_rating ||
                              0}
                            .0
                          </span> */}
                          <StarRating
                            average_rating={
                              establishmentData.average_establishment_rating ||
                              0
                            }
                          />
                        </div>
                        <Dialog>
                          <DialogTrigger className="bg-teal-600 flex justify-center items-center text-white   font-semibold w-44 rounded h-10 hover:text-teal-600 hover:bg-slate-100">
                            <Phone size={22} />
                            &nbsp;Call Now
                          </DialogTrigger>
                          <DialogContent className=" w-96 rounded">
                            <DialogHeader className="mb-15 flex items-center justify-center flex-col">
                              <DialogTitle className="text-2xl">
                                Contact Us
                              </DialogTitle>
                              <DialogDescription className="  flex text-black text-xl">
                                <div className="flex flex-col  ">
                                  Name: {establishmentData.contact_person}
                                  <span>
                                    <span>Number:&nbsp;</span>
                                    <a
                                      href={`tel:${establishmentData.phone}`}
                                      className="text-blue-500"
                                    >
                                      {establishmentData.phone}
                                    </a>
                                  </span>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {children}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
