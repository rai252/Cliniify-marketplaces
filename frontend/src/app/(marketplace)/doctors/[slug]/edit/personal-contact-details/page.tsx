"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { IDoctorProfile } from "@/types/doctor/doctor";
import { doctorService } from "@/services/doctor.service";
import Image from "next/image";
import debounce from "lodash.debounce";

const profileFormSchema = z.object({
  full_name: z
    .string({
      required_error: "Please enter your full name.",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    })
    .regex(/^[A-Za-z'-. ]+$/, {
      message:
        "Name must only contain alphabetic characters, spaces, hyphens, and apostrophes.",
    }),
  address: z.object({
    address_line_1: z.string({ required_error: "Please enter your address." }),
    address_line_2: z.string({ required_error: "Please enter your address." }),
    landmark: z.string().optional(),
    city: z.string({ required_error: "Please enter your city." }),
    state: z.string({ required_error: "Please enter your state." }),
    pincode: z.string({ required_error: "Please enter your postal code." }),
  }),
  experience_years: z.string({
    required_error: "Please enter your experience.",
  }),
  gender: z.enum(["F", "M", "O"]).or(z.literal("")),
  phone: z.string().regex(/^\d{10}$/),
  email: z
    .string({
      required_error: "Please enter email address.",
    })
    .email()
    .or(z.literal("")),
  bio: z.string({
    required_error: "Please tell me about yourself.",
  }),
  avatar: z.instanceof(File).nullable().optional(),
  clinic_no: z
    .string()
    .regex(/^\d{10}$/, "Invalid phone number.")
    .or(z.literal("")),
  alternative_number: z
    .string()
    .regex(/^\d{10}$/, "Invalid phone number.")
    .or(z.literal("")),
});

interface Prediction {
  description: string;
  structured_formatting: { main_text: string };
  place_id: string;
  types: string[];
}

export default function PersonalContactDetails({
  params,
}: {
  params: { id: number; slug: string };
}) {
  const router = useRouter();
  const { id, slug } = params;
  const [doctor, setDoctor] = useState<IDoctorProfile | null>(null);
  const [Profile, setProfile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Prediction[] | null>(null);
  const [showSuggestionDropdown, setShowSuggestionDropdown] =
    useState<boolean>(false);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const experienceYearsRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorData = await doctorService.getDetails({
          id: slug,
          expand: "address",
        });
        setDoctor(doctorData);
        console.log("data:", doctorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDoctorData();
  }, [slug]);

  type ProfileFormValues = z.infer<typeof profileFormSchema> & {
    avatar: File | null;
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      gender: "",
      experience_years: "",
      bio: "",
      clinic_no: "",
      alternative_number: "",
      address: {
        address_line_1: "",
        address_line_2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
      },
      avatar: null,
    },
  });

  const GenderEnum = [
    { label: "Female", value: "F" },
    { label: "Male", value: "M" },
    { label: "Other", value: "O" },
  ];

  const getLabelByValue = (value: string): string => {
    const selectedOption = GenderEnum.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : "";
  };

  const StateEnum = [
    {
      label: "Andaman and Nicobar Islands",
      value: "Andaman and Nicobar Islands",
    },
    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chandigarh", value: "Chandigarh" },
    { label: "Chhattisgarh", value: "Chhattisgarh" },
    {
      label: "Dadra and Nagar Haveli and Daman and Diu",
      value: "Dadra and Nagar Haveli and Daman and Diu",
    },
    { label: "Delhi", value: "Delhi" },
    { label: "Goa", value: "Goa" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Haryana", value: "Haryana" },
    { label: "Himachal Pradesh", value: "Himachal Pradesh" },
    { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Kerala", value: "Kerala" },
    { label: "Ladakh", value: "Ladakh" },
    { label: "Lakshadweep", value: "Lakshadweep" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Manipur", value: "Manipur" },
    { label: "Meghalaya", value: "Meghalaya" },
    { label: "Mizoram", value: "Mizoram" },
    { label: "Nagaland", value: "Nagaland" },
    { label: "Odisha", value: "Odisha" },
    { label: "Pondicherry", value: "Pondicherry" },
    { label: "Punjab", value: "Punjab" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Sikkim", value: "Sikkim" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Telangana", value: "Telangana" },
    { label: "Tripura", value: "Tripura" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "West Bengal", value: "West Bengal" },
  ];

  useEffect(() => {
    form.setValue("full_name", doctor?.full_name || "");
    form.setValue("phone", (doctor?.phone || "").toString());
    form.setValue("email", doctor?.email || "");
    form.setValue("gender", (doctor?.gender as any) || "");
    form.setValue(
      "experience_years",
      (doctor?.experience_years || "").toString()
    );
    form.setValue("bio", doctor?.bio || "");
    if (doctor?.address) {
      form.setValue(
        "address.address_line_1",
        doctor?.address.address_line_1 || ""
      );
      form.setValue(
        "address.address_line_2",
        doctor?.address.address_line_2 || ""
      );
      form.setValue("address.landmark", doctor?.address.landmark || "");
      form.setValue("address.city", doctor?.address.city || "");
      form.setValue("address.state", doctor?.address.state || "");
      form.setValue("address.pincode", doctor?.address.pincode || "");
      form.setValue("clinic_no", (doctor.clinic_no || "").toString());
      form.setValue(
        "alternative_number",
        (doctor.alternative_number || "").toString()
      );
    }
    const identityProofValue =
      doctor?.avatar instanceof File || doctor?.avatar === null
        ? doctor?.avatar
        : null;

    form.setValue("avatar", identityProofValue);
  }, [doctor, form]);

  useEffect(() => {
    if (doctor?.avatar && typeof doctor.avatar === "string") {
      setAvatarPreview(doctor.avatar);
    }
  }, [doctor]);

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSaving(true);
      const educationData = await doctorService.getDetailsEducation({
        id: slug,
      });
      const currentYear = new Date().getFullYear();
      const maxExperienceYears = currentYear - educationData.completion_year;
      if (Number(data.experience_years) > maxExperienceYears) {
        form.setError("experience_years", {
          message: `Experience years should not exceed ${maxExperienceYears}.`,
        });
        // Scroll to the experience years field
        experienceYearsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      const onbording_steps: any = doctor?.onboarding_steps;
      onbording_steps["per_con"] = true;

      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      if (data.gender) formData.append("gender", data.gender);
      formData.append("experience_years", data.experience_years);
      formData.append("bio", data.bio);
      formData.append("clinic_no", data.clinic_no || "");
      formData.append("alternative_number", data.alternative_number || "");
      if (Profile) {
        formData.append("avatar", Profile);
      }
      formData.append("onboarding_steps", JSON.stringify(onbording_steps));

      // Address
      if (data.address) {
        for (const [key, value] of Object.entries(data.address)) {
          if (value) {
            formData.append(`address.${key}`, value);
          }
        }
      }

      const res = await doctorService.updateDoctorDetails(
        { id: slug },
        formData
      );

      if (Profile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(Profile);
      }
      router.push(`/doctors/${slug}/edit/education-specialization`);
      toast.success("Data updated successfully!");
      setIsSaving(false);
    } catch (error: any) {
      if (error?.detail) {
        toast.error(error.detail);
      } else if (error) {
        for (const [key, value] of Object.entries(error)) {
          if (typeof value === "object") {
            for (const [key2, value2] of Object.entries(value as object)) {
              form.setError(`${key}.${key2}` as any, { message: value2 });
            }
            continue;
          }

          form.setError(key as any, { message: value as string });
        }
      }
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

  const handleLocationChange = debounce(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchTerm(value.trim());

      if (value.trim() !== "") {
        const apiUrl = `/api/location?query=${encodeURIComponent(
          value.trim()
        )}`;

        fetch(apiUrl)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Network response was not ok");
            }
          })
          .then((data) => {
            const localityResults = data.predictions.filter(
              (prediction: Prediction) => prediction.types.includes("locality")
            );
            setResults(localityResults);
            setShowSuggestionDropdown(localityResults.length > 0);
          })
          .catch((error) => console.error("Error fetching data:", error));
      } else {
        setResults(null);
        setShowSuggestionDropdown(false);
      }
    },
    500
  );

  const handleSuggestionClick = (prediction: Prediction, field: any) => {
    if (prediction.types && prediction.types.includes("locality")) {
      const location = prediction.structured_formatting?.main_text || "";
      setSearchTerm(location.trim());
      field.onChange({ target: { value: location.trim() } });
    }
    setResults(null);
    setShowSuggestionDropdown(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="  text-2xl font-medium">Personal Details*</h3>
        <p className="  text-base text-muted-foreground">
          Update your account details. Specify your preferences.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col sm:flex-row md:item-start xl:items-center">
            <label htmlFor="file" className="cursor-pointer">
              <div className="w-[200px] h-[250px] overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                <Image
                  src={avatarPreview || "/images/doctor-image.webp"}
                  alt="Doctor Profile"
                  className="object-cover object-top w-full h-full border-2 border-solid border-gray-300 p-1"
                  width={300}
                  height={300}
                />
              </div>
            </label>
            <div>
              <FormControl>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    setProfile(selectedFile || null);
                    if (selectedFile) {
                      const fileName = selectedFile.name;
                      setAvatarPreview(fileName);
                      setAvatarPreview(URL.createObjectURL(selectedFile));
                    }
                  }}
                />
              </FormControl>
              <FormDescription className="  text-base mt-2">
                {avatarPreview
                  ? `Selected Profile: ${getFileNameFromUrl(avatarPreview)}`
                  : "Upload your profile photo."}
              </FormDescription>
            </div>
          </div>
          <div className="bio">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormLabel className="  text-base">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="  text-base resize-none"
                        {...field}
                        maxLength={250}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <div className="text-end   text-sm font-medium mt-2">
                    {field.value.length} / 250
                  </div>
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Full Name
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="  text-base"
                      placeholder="Your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Contact Number
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      className="  text-base"
                      placeholder="Enter contact number"
                      {...field}
                      maxLength={10}
                      ref={phoneRef}
                      disabled
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.phone?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="  text-base"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          field.value
                            ? getLabelByValue(field.value as string)
                            : "Select Gender"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Gender:</SelectLabel>
                        {GenderEnum.map((option) => (
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
                  {form.formState.errors["gender"] && (
                    <FormMessage>
                      {form.formState.errors["gender"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Years of Experience
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter your experience"
                      {...field}
                      ref={experienceYearsRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    House / Flat Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter your house number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Locality / Area</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter your locality"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Landmark</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter your landmark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.city"
              rules={{ required: "City is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">City</FormLabel>
                  <FormControl>
                    <Input
                      className="  peer h-10 w-60 sm:w-full outline-none text-base font-medium text-gray-700 pr-2 placeholder-gray-500"
                      type="text"
                      value={field.value || searchTerm}
                      onChange={(e) => {
                        handleLocationChange(e);
                        field.onChange(e);
                      }}
                      placeholder="Select City"
                    />
                  </FormControl>
                  {results && results.length > 0 && showSuggestionDropdown && (
                    <div className="autocomplete-dropdown-container absolute bg-white border border-gray-300 mt-2 rounded z-20 shadow-md w-72">
                      {results.map((prediction: Prediction) => (
                        <div
                          key={prediction.place_id}
                          onClick={() =>
                            handleSuggestionClick(prediction, field)
                          }
                          className="suggestion-item cursor-pointer hover:bg-gray-100 p-3"
                        >
                          <strong className="  text-base font-medium">
                            {prediction.structured_formatting.main_text}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          field.value ? `${field.value}` : "Select State"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select State:</SelectLabel>
                        {StateEnum.map((option) => (
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
              name="address.pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Pincode</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter pincode"
                      {...field}
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinic_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">Clinic Number</FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter clinic number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternative_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Alternative Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="  text-base"
                      placeholder="Enter alternative number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"></div>
          <Button className="  text-base" type="submit">
            {isSaving ? "Saving..." : "Save & Next"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
