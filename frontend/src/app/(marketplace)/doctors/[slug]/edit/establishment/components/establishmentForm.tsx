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
import { Input } from "@/components/ui/input";
import {
  Select as UISelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { establishmentService } from "@/services/establishment.service";
import {
  IAvaliabledoctors,
  IEstablishment,
  IEstablishmentImages,
  ITiming,
} from "@/types/establishment/establishment";
import Select, { components } from "react-select";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import ImageUploader from "./ImageUploader";
import { IDoctor } from "@/types/doctor/doctor";
import Image from "next/image";
import { doctorService } from "@/services/doctor.service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import makeAnimated from "react-select/animated";
import { ISpecializationsResponse } from "@/types/specializations/specializations";
import { specializationsservice } from "@/services/specializations.service";
import BusinessHoursForm, {
  BusinessHours,
  TimeSlot,
} from "../../../../../../../components/TimingInput";
import moment from "moment";

interface PillProps {
  text: string;
  onRemove: (text: string) => void;
}

const establishmentFormSchema = z.object({
  name: z.string({ required_error: "Please enter your establishment name." }),
  establishment_category: z.string(),
  tagline: z.string().optional(),
  email: z.string({ required_error: "Please enter your email." }),
  phone: z.string().optional(),
  contact_person: z.string().optional(),
  summary: z.string().optional(),
  website: z.string().url(),
  specializations: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .refine((data) => data.length > 0, {
      message: "Please select at least one specialization.",
    }),
  address: z.object({
    address_line_1: z.string({ required_error: "Please enter your address." }),
    address_line_2: z.string({ required_error: "Please enter your address." }),
    landmark: z.string().optional(),
    city: z.string({ required_error: "Please enter your city." }),
    state: z.string({ required_error: "Please enter your state." }),
    pincode: z
      .string({ required_error: "Please enter your postal code." })
      .refine((val) => val.length <= 6, {
        message: "Postal code should not exceed 6 digits",
      }),
  }),
  timings: z
    .object({
      Monday: z
        .array(
          z.object({
            start_time: z.string(),
            end_time: z.string(),
          })
        )
        .optional(),
      Tuesday: z
        .array(
          z.object({
            start_time: z.string(),
            end_time: z.string(),
          })
        )
        .optional(),
      Wednesday: z
        .array(
          z.object({
            start_time: z.string(),
            end_time: z.string(),
          })
        )
        .optional(),
      Thursday: z
        .array(
          z.object({
            start_time: z.string(),
            end_time: z.string(),
          })
        )
        .optional(),
      Friday: z
        .array(
          z.object({
            start_time: z.string(),
            end_time: z.string(),
          })
        )
        .optional(),
      Saturday: z
        .array(
          z.object({
            start_time: z.string(),
            end_time: z.string(),
          })
        )
        .optional(),
      Sunday: z
        .array(
          z.object({
            start_time: z.string(),
            end_time: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
});

const Pill: React.FC<PillProps> = ({ text, onRemove }) => {
  return (
    <div className="flex flex-row">
      <div className="bg-teal-800 text-white px-3 py-1 rounded flex items-center  ">
        <span className="mr-2">{text}</span>&nbsp;
        <button
          className="bg-transparent text-white cursor-pointer text-base  "
          onClick={() => onRemove(text)}
        >
          x
        </button>
      </div>
    </div>
  );
};

export default function CreateEstablishment({
  params,
}: {
  params: { id: number; slug: string };
}) {
  const { id, slug } = params;
  const [isSaving, setIsSaving] = useState(false);
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const animatedComponents = makeAnimated();
  const [specializations, setSpecializations] = useState<
    ISpecializationsResponse["results"] | null
  >(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageData, setImageData] = useState<IEstablishmentImages[]>([]);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [timeData, setTimeData] = useState<BusinessHours>();
  const [establishmentData, setEstablishmentData] =
    useState<IEstablishment | null>(null);
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof establishmentFormSchema>>({
    resolver: zodResolver(establishmentFormSchema),
  });
  const formMethods = useForm<z.infer<typeof establishmentFormSchema>>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: establishmentData || {},
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorData = await doctorService.getDoctorDetail({ id: slug });
        if (doctorData.owned_establishment) {
          const data = await establishmentService.getEstablishmentDetail({
            id: doctorData.owned_establishment,
          });
          setEstablishmentData(data);
          for (const [key, value] of Object.entries(data)) {
            setValue(key as any, value);
            const convertedTimings = convertToBusinessHours(data.timings);
            setValue("timings", convertedTimings || {});
            setTimeData(convertedTimings || {});
          }

          setImageData(data?.establishment_images || []);
        }

        if (doctorData?.specializations?.length > 0) {
          const specializationsArray = doctorData.specializations.map(
            (spec) => ({
              value: spec.id,
              label: spec.name,
            })
          );
          setValue("specializations", specializationsArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDoctorData();
    setDoctor;
  }, [id, setValue, slug]);

  useEffect(() => {
    if (doctor?.owned_establishment) {
      establishmentService
        .getEstablishmentDetail({ id: doctor?.owned_establishment })
        .then((data) => {
          setEstablishmentData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [doctor]);

  const establishmentcategoryEnum = [
    { label: "General", value: "general" },
    { label: "Speciality", value: "speciality" },
    { label: "Multi Speciality", value: "multi-speciality" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = e.currentTarget.value.trim();
      if (trimmedValue !== "") {
        if (items.includes(trimmedValue)) {
          toast.error(`${trimmedValue} already exists in the services.`);
        } else {
          setItems((prevItems) => [...prevItems, trimmedValue]);
          setInputValue("");
        }
      }
    }
  };

  const handleRemoveItem = (item: string) => {
    setItems((prevItems) => prevItems.filter((i) => i !== item));
  };

  const [availableDoctors, setAvailableDoctors] = useState<IAvaliabledoctors>();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const specializationsData =
          await specializationsservice.getSpecializations();
        setSpecializations(specializationsData.results);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    establishmentService
      .getAvailableStaffDoctors()
      .then((doctors) => setAvailableDoctors(doctors))
      .catch((error) => console.error(error));
  }, []);

  const convertTimeSlotTo24HourFormat = (timeSlot: any) => {
    const { start_time, end_time } = timeSlot;
    const [startTime, startAmPm] = start_time.split(" ");
    const [endTime, endAmPm] = end_time.split(" ");

    const start24HourTime = moment(
      `${startTime} ${startAmPm}`,
      "hh:mm A"
    ).format("HH:mm");
    const end24HourTime = moment(`${endTime} ${endAmPm}`, "hh:mm A").format(
      "HH:mm"
    );

    return {
      start_time: start24HourTime,
      end_time: end24HourTime,
    };
  };

  const convertToBusinessHours = (timings?: {
    [key: string]: TimeSlot[];
  }): BusinessHours => {
    if (!timings) return {};

    const businessHours: BusinessHours = {};
    Object.keys(timings).forEach((day) => {
      businessHours[day as keyof BusinessHours] = timings[day];
    });
    return businessHours;
  };

  const handleSave = (hours: BusinessHours) => {
    const converted24HourFormat: BusinessHours = {};
    Object.entries(hours).forEach(([day, timeSlots]) => {
      converted24HourFormat[day] = timeSlots.map(convertTimeSlotTo24HourFormat);
    });
    setTimeData(converted24HourFormat);
  };

  const onSubmit = async (data: z.infer<typeof establishmentFormSchema>) => {
    try {
      const establishment_Data = {
        ...data,
        owner: Number(slug),
        deleted_images: [],
        logo: logoFile,
        specializations: data.specializations.map((spec) => spec.value),
      };
      const formData = new FormData();

      // Append form data fields
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      formData.append("name", establishment_Data.name);
      formData.append(
        "establishment_category",
        establishment_Data.establishment_category
      );
      if (establishment_Data.tagline)
        formData.append("tagline", establishment_Data.tagline);
      formData.append("email", establishment_Data.email);
      formData.append("summary", establishment_Data.summary || "");
      formData.append("website", establishment_Data.website);
      if (establishment_Data.phone)
        formData.append("phone", establishment_Data.phone);
      if (establishment_Data.contact_person)
        formData.append("contact_person", establishment_Data.contact_person);

      // Append address fields
      formData.append(
        "address.address_line_1",
        establishment_Data.address.address_line_1
      );
      formData.append(
        "address.address_line_2",
        establishment_Data.address.address_line_2
      );
      if (establishment_Data.address.landmark)
        formData.append(
          "address.landmark",
          establishment_Data.address.landmark
        );
      formData.append("address.city", establishment_Data.address.city);
      formData.append("address.state", establishment_Data.address.state);
      if (data.address.pincode.length > 6) {
        toast.error("Postal code should not exceed 6 digits");
        return; // Stop form submission
      }
      formData.append("timings", JSON.stringify(timeData));

      items.forEach((item) => {
        formData.append(`establishment_services`, item);
      });
      establishment_Data.specializations.forEach((specId) => {
        formData.append("specializations", specId.toString());
      });
      // Append images
      imageFiles.forEach((image) => {
        // console.log(typeof image);
        formData.append(`establishment_images`, image);
      });
      deletedImages.forEach((imageId) => {
        formData.append("deleted_images", imageId.toString());
      });

      setIsSaving(true);
      if (establishmentData) {
        // Update establishment
        formData.delete("owner");
        await establishmentService.updateEstablishment(
          { id: establishmentData.id },
          formData
        );
        toast.success("Establishment updated successfully!");
      } else {
        // Create establishment
        formData.append("owner", String(establishment_Data.owner));
        await establishmentService.createEstablishment(formData);
        toast.success("Establishment created successfully!");
      }
      router.push(`/doctors/${slug}/edit/establishments-fees-timings`);
    } catch (error) {
      toast.error("Failed to create establishment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const MultiValue = (props: any) => {
    return (
      <components.MultiValue {...props}>
        <span>{props.data.value}</span>
      </components.MultiValue>
    );
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="  text-2xl font-medium">Create Establishment</h3>
        <p className="  text-base text-muted-foreground">
          Complete your establishment details. Provide the necessary
          information.
        </p>
      </div>
      <Separator />
      <Form {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="  text-base">
                  Establishment Logo
                </FormLabel>
                <div className="flex">
                  {logoFile && (
                    <div className="mt-2">
                      <Image
                        src={URL.createObjectURL(logoFile)}
                        alt="Logo Preview"
                        className="object-cover object-top sm:h-[300px] sm:w-[350px] border-2 border-solid border-gray-300 p-1"
                        height={500}
                        width={500}
                      />
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    className="  text-base sm:w-96 ml-5 sm:mt-32"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setLogoFile(e.target.files[0]);
                      } else {
                        setLogoFile(null);
                      }
                    }}
                  />
                </div>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Establishment Name
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter establishment name"
                      {...field}
                      defaultValue={establishmentData?.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="establishment_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Establishment Type
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <UISelect
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <SelectTrigger className="w-full focus:outline-none focus:ring-none focus:ring-white">
                      <SelectValue
                        placeholder={
                          field.value
                            ? `${field.value}`
                            : "Select Establishment Type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {establishmentcategoryEnum.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            defaultValue={
                              establishmentData?.establishment_category
                            }
                            className={
                              option.value === field.value
                                ? "bg-teal-500 text-white"
                                : "hover:bg-white"
                            }
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </UISelect>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 ">
            <FormField
              control={control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Tagline</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter tagline"
                      {...field}
                      defaultValue={establishmentData?.tagline}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Email
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter email"
                      {...field}
                      defaultValue={establishmentData?.email}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter phone number"
                      {...field}
                      defaultValue={establishmentData?.phone}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Contact Name</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter contact name"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        setValue("contact_person", e.target.value);
                      }}
                      defaultValue={establishmentData?.contact_person}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              control={control}
              name="address.address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Office / Flat Number
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter your office number"
                      {...field}
                      defaultValue={establishmentData?.address?.address_line_1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address.address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Locality / Area
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter your locality"
                      {...field}
                      defaultValue={establishmentData?.address?.address_line_2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              control={control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    City
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter city"
                      {...field}
                      defaultValue={establishmentData?.address.city}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address.landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Landmark</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter your landmark"
                      {...field}
                      defaultValue={establishmentData?.address?.landmark}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              control={control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    State
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter state"
                      {...field}
                      defaultValue={establishmentData?.address?.state}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address.pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Postal Code
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter postal code"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value.length >= 6) {
                          toast.error("Postal code should not exceed 6 digits");
                        }
                      }}
                      maxLength={6}
                      defaultValue={establishmentData?.address?.pincode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              name="establishment_services"
              render={() => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Establishment Services
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <Input
                    type="text"
                    id="establishment_services"
                    placeholder="Enter Establishment Services"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="  text-base"
                  />
                  {items.length > 0 && (
                    <div className="mt-5 rounded border border-gray-300 p-2 flex flex-wrap gap-2">
                      {items.map((item, index) => (
                        <Pill
                          key={index}
                          text={item}
                          onRemove={handleRemoveItem}
                        />
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              name="available_doctors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Available Doctors
                  </FormLabel>
                  <Select
                    isMulti
                    components={{ MultiValue }}
                    styles={{
                      option: (styles) => ({
                        ...styles,
                        ":hover": {
                          backgroundColor: "white",
                          boxShadow: "none",
                          transition: "none",
                          cursor: "default",
                        },
                        ":focus": {
                          boxShadow: "none",
                          backgroundColor: "white",
                          transition: "none",
                        },
                      }),
                    }}
                    options={availableDoctors?.all_doctors.map(
                      (doctor: IDoctor) => ({
                        value: doctor.full_name,
                        label: (
                          <div className="flex items-center border shadow-xl rounded-xl hover:bg-blue-100">
                            {doctor.avatar ? (
                              <Image
                                src={doctor.avatar}
                                alt={doctor.full_name}
                                className="h-28 w-28 object-cover mr-2 rounded-xl object-top"
                                height={500}
                                width={500}
                              />
                            ) : (
                              <Image
                                src={"/images/doctor-image.webp"}
                                alt={doctor.full_name}
                                className="h-28 w-28 object-fit mr-2 rounded-xl"
                                height={500}
                                width={500}
                              />
                            )}
                            <div className="flex flex-col ml-2">
                              <p className="mr-5 font-bold">
                                {doctor.full_name}
                              </p>
                              <p className="text-gray-500">{doctor.degree}</p>
                              <p className="text-gray-500 mr-5">
                                {doctor.gender}
                              </p>
                            </div>
                          </div>
                        ),
                      })
                    )}
                    className="  text-base"
                    placeholder="Select Available Doctors"
                    {...field}
                    defaultValue={availableDoctors?.all_doctors}
                  />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 ">
            <FormField
              control={control}
              name="specializations"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Add Specialization
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    className="  text-lg"
                    options={
                      Array.isArray(specializations)
                        ? specializations.map((spec) => ({
                            value: spec.id,
                            label: spec.name,
                          }))
                        : []
                    }
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Website
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter website"
                      {...field}
                      defaultValue={establishmentData?.website}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              control={control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Summary</FormLabel>
                  <FormControl>
                    <ReactQuill
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, 5, 6, false] }],
                          ["bold", "italic", "underline", "trike"],
                          ["link", "image"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          [{ color: [] }, { background: [] }],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "trike",
                        "list",
                        "bullet",
                        "link",
                        "image",
                        "indent",
                        "color",
                        "background",
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="establishment_images"
              render={() => (
                <FormItem>
                  <FormLabel>Establisment Images</FormLabel>
                  <ImageUploader
                    initialImages={imageData as any}
                    setDeletedImages={setDeletedImages}
                    setImageFiles={setImageFiles}
                    imageFiles={imageFiles}
                  />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              control={control}
              name="timings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Establishment Timings
                  </FormLabel>
                  <FormControl>
                    <BusinessHoursForm
                      onSave={handleSave}
                      timings={timeData ?? ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-8 gap-5">
            <Button type="submit" className="  text-base" disabled={isSaving}>
              Save & Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
