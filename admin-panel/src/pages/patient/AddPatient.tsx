import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { IPatientAdd } from "@/interfaces/patient.interface";
import { useAddPatientMutation } from "@/services/patients/patient.service";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Breadcrumbs from "@/components/Breadcrumb";
import { toast } from "react-toastify";
import { StateEnum } from "@/interfaces/user.interface";

const addressSchema = yup.object().shape({
  address_line_1: yup.string().required("House No./Street/Area is required"),
  address_line_2: yup.string().required("Locality is required"),
  landmark: yup.string().notRequired(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .min(6, "Pincode must consist of exactly 6 characters"),
});

const validationSchema = yup.object().shape({
  full_name: yup.string().required("Full Name is required"),
  avatar: yup.mixed().notRequired(),
  phone: yup.string(),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  gender: yup
    .string()
    .oneOf(["M", "F", "O"], "Invalid gender")
    .required("Gender is required"),
  secondary_phone: yup.string().notRequired(),
  date_of_birth: yup.date().notRequired(),
  blood_group: yup
    .string()
    .oneOf(
      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
      "Invalid blood group"
    )
    .notRequired(),
  address: addressSchema,
});

const PatientForm = () => {
  const navigate = useNavigate();
  const [addPatient, { isLoading }] = useAddPatientMutation();
  const form = useForm<IPatientAdd>({
    resolver: yupResolver(validationSchema) as any,
  });

  const [avatar, setAvatar] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatar(file as any);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    data.email = data.email.toLowerCase();
    let date_of_birth: string = "";
    if (data.date_of_birth instanceof Date) {
      const date = data.date_of_birth;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      date_of_birth = formattedDate;
    }

    let mergeData = {};
    if (avatar !== null && typeof avatar !== "string") {
      mergeData = { ...data, date_of_birth: date_of_birth, avatar: avatar };
    } else {
      mergeData = { ...data, date_of_birth: date_of_birth };
    }

    const form_Data = new FormData();
    for (const [key, value] of Object.entries(mergeData)) {
      if (key !== "address") {
        form_Data.append(key, value as any);
      } else if (data.address) {
        // Append address fields separately
        form_Data.append("address.address_line_1", data.address.address_line_1);
        form_Data.append("address.address_line_2", data.address.address_line_2);
        form_Data.append("address.landmark", data.address.landmark);
        form_Data.append("address.city", data.address.city);
        form_Data.append("address.state", data.address.state);
        form_Data.append("address.pincode", data.address.pincode);
      }
    }

    try {
      await addPatient(form_Data).unwrap();
      toast.success("Patient added successfully");
      navigate("/patients");
    } catch (error: any) {
      if (error && error.data) {
        const errorData = error.data;

        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            const errorMessages = errorData[field];
            console.log(errorMessages);
            if (typeof errorMessages === "object") {
              for (const nestedField in errorMessages) {
                if (errorMessages.hasOwnProperty(nestedField)) {
                  const nestedErrorMessages = errorMessages[nestedField];
                  console.log(nestedErrorMessages);

                  if (
                    Array.isArray(nestedErrorMessages) &&
                    nestedErrorMessages.length > 0
                  ) {
                    const errorPath = `${field}.${nestedField}`;
                    form.setError(errorPath as any, {
                      message: nestedErrorMessages[0],
                    });
                    form.setFocus(errorPath as any);
                  }
                }
              }
            }
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              form.setError(field as any, { message: errorMessages[0] });
              form.setFocus(field as any);
            }
          }
        }
      } else {
        toast.error("An unexpected error occurred while updating doctor.");
      }
    }
  });

  const bloodGroups = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "Unknown", value: "Unknown" },
  ];

  const genders = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" },
  ];

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Patients", path: "/patients" },
    { label: "Add Patient" },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="bg-white rounded-lg p-5">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Add patient</div>
          <Link className="p-1" to="/patients/">
            <Button variant="ghost">
              <IoIosArrowBack className="mt-0.5" />
              &nbsp; Back
            </Button>
          </Link>
        </div>
        <hr />
        <Form {...form}>
          <form className="container-fluid p-6" onSubmit={handleSubmit}>
            <div>
              <div className="text-lg font-bold mb-2">Personal Details</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="mb-4">
                    <Label htmlFor="avatar">Profile Image</Label>
                    <Input
                      accept="image/*"
                      type="file"
                      id="avatar"
                      name="avatar"
                      onChange={handleFileChange}
                      placeholder="Upload profile image"
                    />
                    {form.formState.errors.avatar && (
                      <span className="text-red-400 text-xs ">
                        {form.formState.errors.avatar.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          type="text"
                          id="full_name"
                          placeholder="Enter full name"
                          {...field}
                        />
                        {form.formState.errors.full_name && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.full_name.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          type="text"
                          id="phone"
                          placeholder="Enter phone"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Enter email"
                          {...field}
                        />
                        {form.formState.errors.email && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.email.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          id="password"
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {genders.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className={`${
                                    option.value === field.value
                                      ? "bg-indigo-600 text-white"
                                      : "hover:bg-white"
                                  }`}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.gender && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.gender.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="secondary_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Phone</FormLabel>
                        <Input
                          type="text"
                          id="secondary_phone"
                          placeholder="Enter secondary phone"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <Input
                          type="date"
                          id="date_of_birth"
                          placeholder="Enter date of birth"
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="blood_group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Blood Groups" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {bloodGroups.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className={`${
                                    option.value === field.value
                                      ? "bg-indigo-600 text-white"
                                      : "hover:bg-white"
                                  }`}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.blood_group && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.blood_group.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <hr className="mt-1 mb-1" />
              <div>
                <div className="text-lg font-bold mb-2">Address Details</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="address.address_line_1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House No./Street/Area</FormLabel>
                          <Input
                            type="text"
                            id="address.address_line_1"
                            placeholder="Enter House No./Street/Area"
                            {...field}
                          />
                          {form.formState.errors.address?.address_line_1 && (
                            <span className="text-red-400 text-xs ">
                              {
                                form.formState.errors.address.address_line_1
                                  .message
                              }
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="address.address_line_2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locality</FormLabel>
                          <Input
                            type="text"
                            id="address.address_line_2"
                            placeholder="Enter Locality"
                            {...field}
                          />
                          {form.formState.errors.address?.address_line_2 && (
                            <span className="text-red-400 text-xs ">
                              {
                                form.formState.errors.address.address_line_2
                                  .message
                              }
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="address.landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Landmark</FormLabel>
                          <Input
                            type="text"
                            id="address.landmark"
                            placeholder="Enter Landmark"
                            {...field}
                          />
                          {form.formState.errors.address?.landmark && (
                            <span className="text-red-400 text-xs ">
                              {form.formState.errors.address.landmark.message}
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Input
                            type="text"
                            id="city"
                            placeholder="Enter city"
                            {...field}
                          />
                          {form.formState.errors.address?.city && (
                            <span className="text-red-400 text-xs ">
                              {form.formState.errors.address.city.message}
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {StateEnum.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className={`${
                                      option.value === field.value
                                        ? "bg-indigo-600 text-white"
                                        : "hover:bg-white"
                                    }`}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {form.formState.errors.address?.state && (
                            <span className="text-red-400 text-xs ">
                              {form.formState.errors.address.state.message}
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="address.pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <Input
                            type="text"
                            id="pincode"
                            placeholder="Enter pincode"
                            {...field}
                          />
                          {form.formState.errors.address && (
                            <span className="text-red-400 text-xs ">
                              {form.formState.errors.address.message}
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full mt-8">
              Add Patient
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PatientForm;
