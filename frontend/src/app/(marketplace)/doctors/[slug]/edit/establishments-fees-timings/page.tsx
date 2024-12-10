"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { doctorService } from "@/services/doctor.service";
import { IDoctor, IRelations } from "@/types/doctor/doctor";
import TimingsHoursForm from "@/components/timing";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { IEstablishment } from "@/types/establishment/establishment";
import { establishmentService } from "@/services/establishment.service";
import {
  convert24HrToAmPm,
  convertTimingsToTwentyFourHourFormat,
} from "@/lib/timingConvert";
import { BusinessHours } from "@/components/TimingInput";

const establishmentFormSchema = z.object({
  time_duration: z.union([z.string(), z.number()]),
  fee: z
    .string({
      required_error: "Please enter your fee.",
    })
    .or(z.number()),
  timings: z.object({
    Monday: z.union([
      z.string(),
      z.array(z.object({ start_time: z.string(), end_time: z.string() })),
    ]),
    Tuesday: z.union([
      z.string(),
      z.array(z.object({ start_time: z.string(), end_time: z.string() })),
    ]),
    Wednesday: z.union([
      z.string(),
      z.array(z.object({ start_time: z.string(), end_time: z.string() })),
    ]),
    Thursday: z.union([
      z.string(),
      z.array(z.object({ start_time: z.string(), end_time: z.string() })),
    ]),
    Friday: z.union([
      z.string(),
      z.array(z.object({ start_time: z.string(), end_time: z.string() })),
    ]),
    Saturday: z.union([
      z.string(),
      z.array(z.object({ start_time: z.string(), end_time: z.string() })),
    ]),
    Sunday: z.union([
      z.string(),
      z.array(z.object({ start_time: z.string(), end_time: z.string() })),
    ]),
  }),
});

export default function EstablishDetails({
  params,
}: {
  params: { id: number; slug: string };
}) {
  const { slug } = params;
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [relatedEstablishments, setRelatedEstablishments] = useState<
    IEstablishment[]
  >([]);
  const [isToastVisible, setToastVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [timings, setTimings] = useState<BusinessHours>();

  const handleSave = (hours: BusinessHours, establishmentId: string) => {
    const businessHrs: BusinessHours = {};
    for (const day in hours) {
      const dayHours = hours[day];
      if (Array.isArray(dayHours)) {
        businessHrs[day] = dayHours.filter(
          (hour: { start_time: string; end_time: string }) =>
            hour.start_time !== "" && hour.end_time !== ""
        );
      }
    }

    setTimings(
      (prevTimings) =>
        ({
          ...prevTimings,
          [establishmentId]: businessHrs as BusinessHours,
        } as any)
    );
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorData = await doctorService.getDoctorDetail({ id: slug });
        setDoctor(doctorData);

        // Fetch related establishments
        const establishments: IEstablishment[] = await Promise.all(
          doctorData.relations.map(async (relation: IRelations) => {
            return await establishmentService.getEstablishmentDetail(
              relation.establishment_id
            );
          })
        );

        setRelatedEstablishments(establishments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDoctorData();
  }, [slug]);

  type ProfileFormValues = z.infer<typeof establishmentFormSchema>;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: {
      time_duration: "",
      fee: "",
      timings: {
        Monday: [{ start_time: "", end_time: "" }],
        Tuesday: [{ start_time: "", end_time: "" }],
        Wednesday: [{ start_time: "", end_time: "" }],
        Thursday: [{ start_time: "", end_time: "" }],
        Friday: [{ start_time: "", end_time: "" }],
        Saturday: [{ start_time: "", end_time: "" }],
        Sunday: [{ start_time: "", end_time: "" }],
      },
    },
  });

  const timeDurationEnum = [
    { label: "10 minutes", value: "00:10" },
    { label: "15 minutes", value: "00:15" },
    { label: "20 minutes", value: "00:20" },
    { label: "30 minutes", value: "00:30" },
    { label: "45 minutes", value: "00:45" },
    { label: "1 hour", value: "01:00" },
  ];

  useEffect(() => {
    form.setValue("time_duration", doctor?.time_duration || "");
    form.setValue("fee", doctor?.fee || "");

    if (!doctor?.timings) {
      form.setValue("timings", {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      });
    }
  }, [doctor, form]);

  const onSubmit = async (data: z.infer<typeof establishmentFormSchema>) => {
    try {
      setIsSaving(true);
      const anyTimeSlotSelected = Object.values(data.timings).some(
        (day) => Array.isArray(day) && day.length > 0
      );

      const timeDurationString = data.time_duration.toString();

      const onboarding_steps: any = doctor?.onboarding_steps;
      onboarding_steps["fee_time"] = true;

      const form_Data: FormData = new FormData();

      // Append the time duration and fee
      form_Data.append("time_duration", timeDurationString);
      form_Data.append("fee", data.fee.toString());
      form_Data.append("onboarding_steps", JSON.stringify(onboarding_steps));

      // Create relations array
      let relations = [];
      if (timings) {
        for (const establishmentId in timings) {
          const convertedTimings = convertTimingsToTwentyFourHourFormat(
            timings[establishmentId] as any
          );
          const relation = {
            doctor: doctor?.id,
            establishment: establishmentId,
            timings: convertedTimings,
          };
          relations.push(relation);
        }
      }
      form_Data.append("relations", JSON.stringify(relations));

      // Update doctor details with FormData
      await doctorService.updateDoctorDetails({ id: slug }, form_Data);

      router.push(`/doctors/${slug}/edit/personal-contact-details`);
      toast.success("Data updated successfully!");
      setToastVisible(true);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      toast.error("Failed to update data. Please try again.");
      setToastVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="  text-2xl font-medium">Establishments*</h3>
        <p className="  text-base text-muted-foreground">
          Register your establishments, including the specified time duration
          and fee.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="time_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Consultation duration
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          field.value
                            ? `${field.value}`
                            : "Select Time Duration"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Time Duration</SelectLabel>
                        {timeDurationEnum.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className={`${
                              option.value === field.value
                                ? "bg-teal-500 text-white"
                                : "hover:bg-white"
                            }`}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Consultation Fees
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter fees"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="mt-20">
            <h3 className="  text-2xl font-medium">
              Timings
              <span className="  text-lg font-bold text-red-500 p-0.5">*</span>
            </h3>
            <p className="  text-base text-muted-foreground">
              Specify the timings for your establishments during the
              registration process.
            </p>
          </div>
          <Separator />
          <div className="mb-2">
            {doctor?.associated_establishment ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.associated_establishment.map((establishment, idx) => (
                    <>
                      <div
                        key={idx}
                        className="border shadow-sm rounded-md mb-2"
                      >
                        <div className="px-6 py-6">
                          <div className="text-2xl font-bold mb-1  ">
                            {establishment.name}
                          </div>
                          <div className="text-md   text-gray-500">
                            {establishment.address?.address_line_1},{" "}
                            {establishment.address?.address_line_2},{" "}
                            {establishment.address?.city},{" "}
                            {establishment.address?.state}
                          </div>
                          <div className="text-sm text-gray-500   mb-1">
                            {doctor.owned_establishment ? doctor.full_name : ""}
                          </div>
                        </div>
                        <hr />
                        <div className="p-2">
                          {doctor.relations.map((data, _) => {
                            if (establishment.id === data.establishment_id) {
                              if (data.timings && data.timings !== null) {
                                return (
                                  <TimingsHoursForm
                                    key={_}
                                    establishmentId={
                                      establishment.id.toString() as string
                                    }
                                    onSave={handleSave}
                                    timings={
                                      convert24HrToAmPm(
                                        data.timings as any
                                      ) as any
                                    }
                                  />
                                );
                              } else {
                                return (
                                  <TimingsHoursForm
                                    key={_}
                                    establishmentId={
                                      establishment.id.toString() as string
                                    }
                                    onSave={handleSave}
                                    timings={{}}
                                  />
                                );
                              }
                            }
                          })}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <Button className="  text-base" type="submit">
            {isSaving ? "Saving..." : "Submit"}
          </Button>
        </form>
      </Form>
      {isToastVisible && <Toaster position="top-right" />}
    </div>
  );
}
