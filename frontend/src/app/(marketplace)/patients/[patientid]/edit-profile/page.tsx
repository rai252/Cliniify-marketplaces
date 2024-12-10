"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Toaster, toast } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { IPatient } from "@/types/patient/patient";
import { userService } from "@/services/user.service";
import { patientService } from "@/services/patient.service";
import { useUserContext } from "@/context/user";
import { Progress } from "@/components/ui/progress";
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
  gender: z.enum(["F", "M", "O"]).or(z.literal("")),
  blood_group: z.string({
    required_error: "Please select blood group.",
  }),
  age: z
    .string({
      required_error: "Please enter your age number.",
    })
    .or(z.number()),
  date_of_birth: z
    .string({
      required_error: "Please select date of birth.",
    })
    .or(z.number()),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Mobile number is not valid.")
    .or(z.literal("")),
  secondary_phone: z
    .string()
    .regex(/^\d{10}$/, "Mobile number is not valid.")
    .or(z.literal("")),
  email: z
    .string({
      required_error: "Please enter email address.",
    })
    .email()
    .or(z.literal("")),
  avatar: z.instanceof(File).nullable(),
});

interface Prediction {
  description: string;
  structured_formatting: { main_text: string };
  place_id: string;
  types: string[];
}

export default function Profile({ params }: { params: { patientid: number } }) {
  const { patientid } = params;
  const [isToastVisible, setToastVisible] = useState(false);
  const { user, setUser } = useUserContext();
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [patientProfile, setPatientProfile] = useState<IPatient | null>(null);
  const [Profile, setProfile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Prediction[] | null>(null);
  const [showSuggestionDropdown, setShowSuggestionDropdown] =
    useState<boolean>(false);
  const phoneRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getcurrentUser();
        setUser(userData);

        const profileData = await patientService.getProfileCount({
          patientid,
        });

        setPatientProfile(profileData);

        if (userData?.patient_id) {
          const patientData = await patientService.getPatient({
            patientid: userData.patient_id,
            expand: "address",
          });
          setPatient(patientData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [patientid, setUser]);

  type ProfileFormValues = z.infer<typeof profileFormSchema> & {
    avatar: File | null;
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      secondary_phone: "",
      email: "",
      gender: "",
      date_of_birth: "",
      age: "",
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
  const dateOfBirth = form.watch("date_of_birth");

  const GenderEnum = [
    { label: "Female", value: "F" },
    { label: "Male", value: "M" },
    { label: "Other", value: "O" },
  ];

  const getLabelByValue = (value: string): string => {
    const selectedOption = GenderEnum.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : "";
  };

  const BloodGroupEnum = [
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "A1+", value: "A1+" },
    { label: "A1-", value: "A1-" },
    { label: "A1B+", value: "A1B+" },
    { label: "A1B-", value: "A1B-" },
  ];

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
    { label: "Puducherry", value: "Puducherry" },
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
    if (patient) {
      form.setValue("full_name", patient.full_name || "");
      form.setValue("phone", (patient.phone as any) || "");
      form.setValue("secondary_phone", patient.secondary_phone || "");
      form.setValue("email", patient.email || "");
      form.setValue("gender", (patient.gender as any) || "");
      form.setValue("age", patient.age || "");
      form.setValue("blood_group", patient.blood_group || "");
      form.setValue("date_of_birth", patient.date_of_birth || "");
      if (patient?.address) {
        form.setValue(
          "address.address_line_1",
          patient?.address.address_line_1 || ""
        );
        form.setValue(
          "address.address_line_2",
          patient?.address.address_line_2 || ""
        );
        form.setValue("address.landmark", patient?.address.landmark || "");
        form.setValue("address.city", patient?.address.city || "");
        form.setValue("address.state", patient?.address.state || "");
        form.setValue("address.pincode", patient?.address.pincode || "");
      }

      const identityProofValue =
        patient.avatar instanceof File || patient.avatar === null
          ? patient.avatar
          : null;
      form.setValue("avatar", identityProofValue);
    } else {
      form.reset({
        full_name: "",
        phone: "",
        secondary_phone: "",
        email: "",
        gender: "",
        age: "",
        blood_group: "",
        date_of_birth: "",
        address: {
          address_line_1: "",
          address_line_2: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
        },
        avatar: null,
      });
    }
  }, [patient, form]);

  useEffect(() => {
    if (patient?.avatar && typeof patient?.avatar === "string") {
      setAvatarPreview(patient?.avatar);
    }
  }, [patient]);

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today <
      new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (dateOfBirth) {
      form.setValue("age", calculateAge(String(dateOfBirth)));
    }
  }, [dateOfBirth, form]);

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("phone", data.phone as any);
      formData.append("secondary_phone", data.secondary_phone as any);
      formData.append("email", data.email);
      if (data.gender) formData.append("gender", data.gender);
      formData.append("age", data.age as any);
      formData.append("blood_group", data.blood_group);
      formData.append("date_of_birth", data.date_of_birth as any);

      // Handle address data
      if (data.address) {
        for (const [key, value] of Object.entries(data.address)) {
          if (value) formData.append(`address.${key}`, value);
        }
      }

      if (Profile) {
        formData.append("avatar", Profile);
      }

      const res = await patientService.updatePatient(patientid, formData);

      const updatedProfileData = await patientService.getProfileCount({
        patientid,
      });
      setPatientProfile(updatedProfileData);

      if (Profile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(Profile);
      }

      toast.success("Data updated successfully!");
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
      setIsSaving(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => issue.message);
        toast.error(
          `Please fill in the required fields: ${errorMessages.join(", ")}`
        );
      }
      form.setError("phone", {
        message: "Patient with this phone number already exists.",
      });
      form.setError("address.address_line_1", {
        message: "This field may not be blank.",
      });
      form.setError("address.address_line_2", {
        message: "This field may not be blank.",
      });
      form.setError("address.city", {
        message: "This field may not be blank.",
      });
      form.setError("address.pincode", {
        message: "This field may not be blank.",
      });
      form.setError("address.state", {
        message: "This field may not be blank.",
      });

      if (phoneRef.current) {
        phoneRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }); // scroll to the phone field
      }
      setIsSaving(false);
      toast.error("Failed to update data. Please try again.");
      setToastVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setProfile(selectedFile || null);
    if (selectedFile) {
      const fileName = selectedFile.name;
      localStorage.setItem("avatarFileName", fileName);

      const fileUrl = URL.createObjectURL(selectedFile);
      setAvatarPreview(fileUrl);
      setAvatarFileName(fileName);
    } else {
      localStorage.removeItem("avatarFileName");
    }
  };

  useEffect(() => {
    const storedFileName = localStorage.getItem("avatarFileName");
    if (storedFileName) {
      setAvatarFileName(storedFileName);
    }
  }, []);

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
    <div className="main-section bg-slate-50 min-h-screen flex flex-col justify-between">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <div className="update-form-container mt-10 mb-10 flex-grow">
        <div className="flex flex-col mt-5 container mx-auto">
          <div className="p-4 w-full">
            <Card>
              <CardContent className="items-center">
                <div className="mb-6 pb-4 border-b border-gray-300">
                  <div className="flex justify-between items-center mt-5">
                    <div className="left-section w-4/5">
                      <div className="space-y-0.5">
                        <h2 className="  text-3xl tracking-tight">
                          My Account
                        </h2>
                      </div>
                    </div>
                    <div className="right-section w-1/5">
                      <div className="space-y-0.5">
                        <h2 className="  text-xl tracking-tight mb-3 font-medium">
                          <span className="  text-teal-600 text-2xl font-semibold mr-2">
                            {patientProfile?.profile_completion_percentage}%
                          </span>{" "}
                          Profile Complete
                        </h2>
                      </div>
                      <Progress
                        value={patientProfile?.profile_completion_percentage}
                        className="h-3"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="  text-2xl font-medium">Personal Details</h3>
                  </div>
                  <Separator />
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <div className="flex flex-col sm:flex-row md:item-start xl:items-center">
                        <label htmlFor="fileUpload" className="cursor-pointer">
                          <div className="w-[200px] h-[250px] overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                            <Image
                              src={avatarPreview || "/images/doctor-image.webp"}
                              alt="Patient Profile"
                              className="object-cover object-top w-full h-full border-2 border-solid border-gray-300 p-1"
                              width={300}
                              height={300}
                            />
                          </div>
                        </label>
                        <div>
                          <FormControl>
                            <Input
                              id="fileUpload"
                              type="file"
                              accept="image/*"
                              className="cursor-pointer"
                              onChange={handleFileChange}
                            />
                          </FormControl>
                          <FormDescription className="  text-base mt-2">
                            {avatarFileName
                              ? `Selected Profile: ${avatarFileName}`
                              : "Upload your profile photo."}
                          </FormDescription>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                                  type="text"
                                  className="  text-base"
                                  placeholder="Enter contact number"
                                  {...field}
                                  maxLength={10}
                                  ref={phoneRef}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    field.onChange(value);
                                  }}
                                  disabled
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
                          name="secondary_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                Alternative Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="  text-base"
                                  placeholder="Enter contact number"
                                  {...field}
                                  minLength={10}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="  text-base"
                                  placeholder="Enter email address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="blood_group"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                Blood Group
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
                                        : "Select Blood Group"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>
                                      Select Blood Group:
                                    </SelectLabel>
                                    {BloodGroupEnum.map((option) => (
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
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                Gender
                              </FormLabel>
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
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                Date of Birth
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="  text-base"
                                  placeholder="Enter your date of birth"
                                  max={new Date().toISOString().split("T")[0]}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">Age</FormLabel>
                              <FormControl>
                                <Input
                                  className="  text-base"
                                  placeholder="Your Age"
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
                              <FormLabel className="  text-base">
                                Locality / Area
                              </FormLabel>
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
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="address.landmark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                Landmark
                              </FormLabel>
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                City
                              </FormLabel>
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
                              {results &&
                                results.length > 0 &&
                                showSuggestionDropdown && (
                                  <div className="autocomplete-dropdown-container absolute bg-white border border-gray-300 mt-2 rounded z-20 shadow-md w-72">
                                    {results.map((prediction: Prediction) => (
                                      <div
                                        key={prediction.place_id}
                                        onClick={() =>
                                          handleSuggestionClick(
                                            prediction,
                                            field
                                          )
                                        }
                                        className="suggestion-item cursor-pointer hover:bg-gray-100 p-3"
                                      >
                                        <strong className="  text-base font-medium">
                                          {
                                            prediction.structured_formatting
                                              .main_text
                                          }
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="address.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="  text-base">
                                State
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
                                        : "Select State"
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
                              <FormLabel className="  text-base">
                                Pincode
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  className="  text-base"
                                  placeholder="Enter pincode"
                                  {...field}
                                  maxLength={6}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (e.target.value.length >= 6) {
                                      toast.error(
                                        "Postal code should not exceed 6 digits"
                                      );
                                    }
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        className="  text-base"
                        type="submit"
                        onClick={() => setToastVisible(false)}
                      >
                        {isSaving ? "Saving..." : "Submit"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {isToastVisible && <Toaster position="top-right" />}
    </div>
  );
}
