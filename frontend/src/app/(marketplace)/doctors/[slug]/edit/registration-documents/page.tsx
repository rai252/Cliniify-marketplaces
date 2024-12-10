"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { doctorService } from "@/services/doctor.service";
import { IRegistrationDocuments } from "@/types/doctor/doctor";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  reg_no: z
    .string({
      required_error: "Please enter your registration number.",
    })
    .or(z.number()),
  reg_council: z
    .string({
      required_error: "Please enter your registration council name.",
    })
    .or(z.number()),
  reg_year: z
    .string({
      required_error: "Please enter your registration year.",
    })
    .or(z.number()),
  identity_proof: z.string().nullable(),
  medical_reg_proof: z.string().nullable(),
  establishment_proof: z.string().nullable(),
});

export default function RegistrationDetails({
  params,
}: {
  params: { id: number; slug: string };
}) {
  const { id, slug } = params;
  const router = useRouter();
  const [isToastVisible, setToastVisible] = useState(false);
  const [doctor, setDoctor] = useState<IRegistrationDocuments | null>(null);
  const [identityProofFile, setIdentityProofFile] = useState<File | null>(null);
  const [medicalRegProofFile, setMedicalRegProofFile] = useState<File | null>(
    null
  );
  const [identityProofUrl, setIdentityProofUrl] = useState<string | null>(null);
  const [medicalRegProofUrl, setMedicalRegProofUrl] = useState<string | null>(
    null
  );
  const [establishmentProofUrl, setEstablishmentProofUrl] = useState<
    string | null
  >(null);

  const [establishmentProofFile, setEstablishmentProofFile] =
    useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const regYearRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorData = (await doctorService.getDetailsDocuments({
          id: slug,
        })) as IRegistrationDocuments;
        setDoctor(doctorData);

        setIdentityProofUrl(doctorData?.identity_proof as any);
        setMedicalRegProofUrl(doctorData?.medical_reg_proof as any);
        setEstablishmentProofUrl(doctorData?.establishment_proof as any);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [id]);

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      reg_no: "",
      reg_council: "",
      reg_year: "",
      identity_proof: null,
      medical_reg_proof: null,
      establishment_proof: null,
    },
  });

  useEffect(() => {
    form.setValue("reg_no", doctor?.reg_no || "");
    form.setValue("reg_council", doctor?.reg_council || "");
    form.setValue("reg_year", doctor?.reg_year || "");

    const identityProofValue =
      doctor?.identity_proof instanceof File
        ? null
        : (doctor?.identity_proof as string | null) || "";
    form.setValue("identity_proof", identityProofValue);

    const medicalRegProofValue =
      doctor?.medical_reg_proof instanceof File
        ? null
        : (doctor?.medical_reg_proof as string | null) || "";
    form.setValue("medical_reg_proof", medicalRegProofValue);

    const establishmentProofValue =
      doctor?.establishment_proof instanceof File
        ? null
        : (doctor?.establishment_proof as string | null) || "";
    form.setValue("establishment_proof", establishmentProofValue);
  }, [doctor, form]);

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSaving(true);

      const currentYear = new Date().getFullYear();
      if (Number(data.reg_year) > currentYear) {
        form.setError("reg_year", {
          message: "Registration year cannot be greater than the current year.",
        });
        regYearRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      const educationData = await doctorService.getDetailsEducation({
        id: slug,
      });
      if (Number(data.reg_year) < educationData.completion_year) {
        form.setError("reg_year", {
          message: "Registration year cannot be less than the completion year.",
        });
        regYearRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
      const onbording_steps: any = doctor?.onboarding_steps;
      onbording_steps["reg_doc"] = true;

      const res = await doctorService.updateRegistrationDocuments(
        { id: slug },
        {
          reg_no: data.reg_no,
          reg_council: data.reg_council,
          reg_year: data.reg_year,
          identity_proof: identityProofFile,
          medical_reg_proof: medicalRegProofFile,
          establishment_proof: establishmentProofFile,
          onboarding_steps: onbording_steps,
        }
      );

      router.push(`/doctors/${slug}/edit/establishment`);

      toast.success("Data updated successfully!");
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      toast.error("Failed to update data. Please try again.");
      setToastVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  function getFileNameFromUrl(url: string) {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const fileName = pathname.split("/").pop();
    return fileName;
  }

  function isPdfFile(url: string): boolean {
    return url.toLowerCase().endsWith(".pdf");
  }

  function isDocFile(url: string): boolean {
    return url.toLowerCase().endsWith(".doc");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="  text-2xl font-medium">Registration details*</h3>
        <p className="  text-base text-muted-foreground">
          Complete your registration details. Provide the necessary information.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="reg_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Council Registration No
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="  text-base"
                      placeholder="Enter Registration no"
                      maxLength={12}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reg_council"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Council Name
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter council name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="reg_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Registration Year
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="  text-base"
                      placeholder="Enter your registration year"
                      {...field}
                      ref={regYearRef}
                      maxLength={4}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.reg_year?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="mt-20">
            <h3 className="  text-2xl font-medium">
              Documents / Certificates
              <span className="  text-lg font-bold text-red-500 p-0.5">*</span>
            </h3>
            <p className="  text-base text-muted-foreground">
              Submit your documents and certificates. Provide the required
              information.
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FormItem>
              <FormLabel className="  text-base">Identity Proof</FormLabel>
              <div className="flex flex-col sm:flex-row md:item-start xl:items-center">
                <label htmlFor="identityproof" className="cursor-pointer">
                  {identityProofUrl ? (
                    <>
                      {isPdfFile(identityProofUrl) ? (
                        <a
                          href={identityProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/pdf.png"
                            alt="PDF Icon"
                            className="object-fit mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2 cursor-pointer"
                            style={{ width: "200px", height: "200px" }}
                            width={300}
                            height={300}
                          />
                        </a>
                      ) : isDocFile(identityProofUrl) ? (
                        <a
                          href={identityProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/doc.png"
                            alt="DOC Icon"
                            className="object-cover mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2 cursor-pointer"
                            style={{ width: "200px", height: "200px" }}
                            width={300}
                            height={300}
                          />
                        </a>
                      ) : null}
                    </>
                  ) : (
                    <Image
                      src="/images/no-document-icon.jpg"
                      alt="No Document Icon"
                      className="object-cover mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2 cursor-pointer"
                      style={{ width: "200px", height: "200px" }}
                      width={300}
                      height={300}
                    />
                  )}
                  <p className="  text-sm text-muted-foreground mt-1">
                    Accepted formats:{" "}
                    <span className="font-medium">
                      PDF, DOC. Max file size:
                    </span>{" "}
                    <span className="text-red-600 font-medium">2MB</span>
                  </p>
                </label>
              </div>
              <FormControl>
                <Input
                  id="identityproof"
                  type="file"
                  accept=".pdf,.doc"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error("Maximum file size allowed is 2MB.");
                        e.target.value = "";
                        return;
                      }
                      if (uploadedFileNames.includes(file.name)) {
                        toast.error(
                          "A file with the same name has already been uploaded. Please choose a different file."
                        );
                        e.target.value = "";
                        return;
                      }
                      setIdentityProofFile(file);
                      setUploadedFileNames((prevNames) => [
                        ...prevNames,
                        file.name,
                      ]);
                      const fileName = file.name;
                    }
                  }}
                />
              </FormControl>
              {identityProofUrl && (
                <a
                  href={identityProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="  text-teal-600 font-medium"
                >
                  {getFileNameFromUrl(identityProofUrl)}
                </a>
              )}
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="  text-base">
                Medical Register Proof
              </FormLabel>
              <div className="flex flex-col sm:flex-row md:item-start xl:items-center">
                <label htmlFor="registerproof" className="cursor-pointer">
                  {medicalRegProofUrl ? (
                    <>
                      {isPdfFile(medicalRegProofUrl) ? (
                        <a
                          href={medicalRegProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/pdf.png"
                            alt="PDF Icon"
                            className="object-fit mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2"
                            style={{ width: "200px", height: "200px" }}
                            width={300}
                            height={300}
                          />
                        </a>
                      ) : isDocFile(medicalRegProofUrl) ? (
                        <a
                          href={medicalRegProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/doc.png"
                            alt="DOC Icon"
                            className="object-cover mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2"
                            style={{ width: "200px", height: "200px" }}
                            width={300}
                            height={300}
                          />
                        </a>
                      ) : null}
                    </>
                  ) : (
                    <Image
                      src="/images/no-document-icon.jpg"
                      alt="No Document Icon"
                      className="object-cover mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2"
                      style={{ width: "200px", height: "200px" }}
                      width={300}
                      height={300}
                    />
                  )}
                  <p className="  text-sm text-muted-foreground mt-1">
                    Accepted formats:{" "}
                    <span className="font-medium">
                      PDF, DOC. Max file size:
                    </span>{" "}
                    <span className="text-red-600 font-medium">2MB</span>
                  </p>
                </label>
              </div>
              <FormControl>
                <Input
                  id="registerproof"
                  type="file"
                  accept=".pdf,.doc"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error("Maximum file size allowed is 2MB.");
                        e.target.value = "";
                        return;
                      }
                      if (uploadedFileNames.includes(file.name)) {
                        toast.error(
                          "A file with the same name already exists. Please choose a different file."
                        );
                        e.target.value = "";
                        return;
                      }
                      setIdentityProofFile(file);
                      setUploadedFileNames((prevNames) => [
                        ...prevNames,
                        file.name,
                      ]);
                      const fileName = file.name;
                    }
                  }}
                />
              </FormControl>
              {medicalRegProofUrl && (
                <a
                  href={medicalRegProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="  text-teal-600 font-medium"
                >
                  {getFileNameFromUrl(medicalRegProofUrl)}
                </a>
              )}
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="  text-base">Establishment Proof</FormLabel>
              <div className="flex flex-col sm:flex-row md:item-start xl:items-center">
                <label htmlFor="establishmentproof" className="cursor-pointer">
                  {establishmentProofUrl ? (
                    <>
                      {isPdfFile(establishmentProofUrl) ? (
                        <a
                          href={establishmentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/pdf.png"
                            alt="PDF Icon"
                            className="object-fit mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2"
                            style={{ width: "200px", height: "200px" }}
                            width={300}
                            height={300}
                          />
                        </a>
                      ) : isDocFile(establishmentProofUrl) ? (
                        <a
                          href={establishmentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/doc.png"
                            alt="DOC Icon"
                            className="object-cover mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2"
                            style={{ width: "200px", height: "200px" }}
                            width={300}
                            height={300}
                          />
                        </a>
                      ) : null}
                    </>
                  ) : (
                    <Image
                      src="/images/no-document-icon.jpg"
                      alt="No Document Icon"
                      className="object-cover mb-4 sm:mb-0 sm:mr-4 border-2 border-solid border-gray-300 p-2"
                      style={{ width: "200px", height: "200px" }}
                      width={300}
                      height={300}
                    />
                  )}
                  <p className="  text-sm text-muted-foreground mt-1">
                    Accepted formats:{" "}
                    <span className="font-medium">
                      PDF, DOC. Max file size:
                    </span>{" "}
                    <span className="text-red-600 font-medium">2MB</span>
                  </p>
                </label>
              </div>
              <FormControl>
                <Input
                  id="establishmentproof"
                  type="file"
                  accept=".pdf,.doc"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error("Maximum file size allowed is 2MB.");
                        e.target.value = "";
                        return;
                      }
                      if (uploadedFileNames.includes(file.name)) {
                        toast.error(
                          "A file with the same name already exists. Please choose a different file."
                        );
                        e.target.value = "";
                        return;
                      }
                      setIdentityProofFile(file);
                      setUploadedFileNames((prevNames) => [
                        ...prevNames,
                        file.name,
                      ]);
                      const fileName = file.name;
                    }
                  }}
                />
              </FormControl>
              {establishmentProofUrl && (
                <a
                  href={establishmentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="  text-teal-600 font-medium"
                >
                  {getFileNameFromUrl(establishmentProofUrl)}
                </a>
              )}
              <FormMessage />
            </FormItem>
          </div>
          <Button className="  text-base" type="submit">
            {isSaving ? "Saving..." : "Save & Next"}
          </Button>
        </form>
      </Form>
      {isToastVisible && <Toaster position="top-right" />}
    </div>
  );
}
