import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  IEstablishmentImages,
  IEstablishments,
  establishmentcategoryEnum,
} from "@/interfaces/establishments.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import {
  Select as UISelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Breadcrumbs from "@/components/Breadcrumb";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  useEditEstablishmentMutation,
  useGetAvailableOwnerDoctorsQuery,
  useGetAvailableStaffDoctorsQuery,
  useGetEstablishmentByIdQuery,
} from "@/services/establishments/establishment.service";
import ImageUploader from "./custom/ImageUploader";
import { IDoctor } from "@/interfaces/doctor.interface";
import DoctorCard from "./custom/doctorcard";
import { BsFillInfoCircleFill, BsFillPlusCircleFill } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StateEnum } from "@/interfaces/user.interface";
import { IoInformationCircle } from "react-icons/io5";
import defaultimage from "@/assets/images/default-avatar.webp";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { useGetSpecializationsQuery } from "@/services/specalizations/specializations.service";
import Multiselect from "multiselect-react-dropdown";
import { BusinessHours } from "@/interfaces/business.interface";
import BusinessHoursForm from "../doctor/openingHours/BusinessHoursForm";
import { convert24HrToAmPm, convertTimingsToTwentyFourHourFormat } from "../doctor/custom/convert24HrToAmPm";

interface DoctorFormProps {}

interface FormProps {
  specializations: any[];
}

interface PillProps {
  text: string;
  onRemove: (text: string) => void;
}

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
  name: yup.string().required("Full Name is required"),
  establishment_category: yup
    .string()
    .required("Establishment category is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup.string().max(10),
  tagline: yup.string().notRequired(),
  contact_person: yup.string().notRequired(),
  address: addressSchema,
  owner: yup.string(),
});

const Pill: React.FC<PillProps> = ({ text, onRemove }) => {
  return (
    <div className="flex flex-row">
      <div className="bg-gray-200 px-2 py-0.5 rounded-md flex items-center">
        <span className="mr-2 text-sm">{text}</span>&nbsp;
        <button
          className="bg-transparent hover:text-red-400 text-sm hover:bg-red-300/50 hover:font-semibold mt-1 mb-1 px-1 rounded text-gray-600 cursor-pointer"
          onClick={() => onRemove(text)}
        >
          x
        </button>
      </div>
    </div>
  );
};

const EditEstablishmentForm: FC<DoctorFormProps> = () => {
  const { id: establishmentId } = useParams<{ id: string }>();
  const [value, setValue] = useState<string>("");
  const { data: specializationData } = useGetSpecializationsQuery([]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logo, setLogo] = useState<File>();
  const [editEstablishment, { isLoading: isUpdating }] =
    useEditEstablishmentMutation();
  const form = useForm<IEstablishments>({
    resolver: yupResolver(validationSchema) as any,
  });
  const [form_Data, setFormData] = useState<FormProps>({
    specializations: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageData, setImageData] = useState<IEstablishmentImages[]>([]);
  const navigate = useNavigate();
  const { data: doctor_list } = useGetAvailableOwnerDoctorsQuery(
    establishmentId as string
  );
  const [timings, setTimings] = useState<BusinessHours>();

  const {
    data: staff_list,
    isError: stafflisterror,
    isLoading: isloadingAvaiableStaffDoctors,
  } = useGetAvailableStaffDoctorsQuery(establishmentId as string);

  const [inputValue, setInputValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const { data: establishment, isLoading: isLoadingEstablishment } =
    useGetEstablishmentByIdQuery(establishmentId as string);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);

  useEffect(() => {
    if (establishment) {
      const serviceNames = establishment.establishment_services
        ? establishment.establishment_services.map((service) => service.name)
        : [];

      setItems(serviceNames as any[]);
      setImageData(establishment?.establishment_images || []);
      setValue(establishment?.summary || "");

      form.reset({
        name: establishment?.name || "",
        establishment_category: establishment?.establishment_category || "",
        tagline: establishment?.tagline || "",
        email: establishment?.email || "",
        phone: establishment?.phone || "",
        contact_person: establishment?.contact_person || "",
        summary: establishment?.summary || "",
        website: establishment?.website || "",
        logo: establishment?.logo || "",
        specializations: establishment?.specializations || "",
        address: {
          address_line_1: establishment?.address?.address_line_1 || "",
          address_line_2: establishment?.address?.address_line_2 || "",
          landmark: establishment?.address?.landmark || "",
          city: establishment?.address?.city || "",
          state: establishment?.address?.state || "",
          pincode: establishment?.address?.pincode || "",
        },
      });
    }
  }, [establishment, form]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = e.currentTarget.value.trim();
      if (trimmedValue !== "") {
        if (items.includes(trimmedValue.toLowerCase())) {
          toast.error(`${trimmedValue} already exists in the list.`);
        } else {
          setItems((prevItems) => [...prevItems, trimmedValue]);
          setInputValue("");
        }
      }
    }
  };

  const handleSave = (hours: BusinessHours) => {
    const businessHrs: BusinessHours = {};
    for (const day in hours) {
      const dayHours = hours[day];
      if (Array.isArray(dayHours)) {
        businessHrs[day] = dayHours.filter(
          (hour: { start_time: string; end_time: string }) =>
            hour.start_time !== '' && hour.end_time !== ''
        );
      }
    }
  
    setTimings(businessHrs);
  };

  const handleRemoveItem = (item: string) => {
    setItems((prevItems) => prevItems.filter((i) => i !== item));
  };

  const onSubmit = form.handleSubmit(async (data) => {    
    data.email = data.email.toLowerCase();
    try {
      const formData = new FormData();

      if (data.staffs) {
        const staffIds = data.staffs
          .filter((staff: any) => staff.value !== undefined)
          .map((staff: any) => staff.value);
        data.staffs = staffIds;

        staffIds.forEach((staffId: number) => {
          formData.append("staffs", staffId.toString());
        });
      }

      imageFiles.forEach((image) => {
        if (typeof image !== "string" || image === null) {
          formData.append(`establishment_images`, image);
        }
      });

      const convertedTimings = convertTimingsToTwentyFourHourFormat(timings as BusinessHours);

      formData.append("timings", JSON.stringify(convertedTimings));

      items.forEach((item) => {
        formData.append(`establishment_services`, item);
      });

      if (logo && logo instanceof File) {
        formData.append("logo", logo);
      }

      const specializationIds = form_Data.specializations.map(
        (specialization: any) => specialization.id
      );

      specializationIds.forEach((id) => {
        formData.append("specializations", id);
      });

      deletedImages.forEach((imageId) => {
        formData.append("deleted_images", imageId.toString());
      });

      (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
        if (
          key !== "establishment_images" &&
          key !== "establishment_services" &&
          key !== "address" &&
          key !== "staffs" &&
          key !== "logo" &&
          key !== "specializations"
        ) {
          formData.append(key, data[key] as any);
        }
        // Handle address fields separately
        if (key === "address" && data.address) {
          formData.append(
            "address.address_line_1",
            data.address.address_line_1
          );
          formData.append(
            "address.address_line_2",
            data.address.address_line_2
          );
          formData.append("address.landmark", data.address.landmark);
          formData.append("address.city", data.address.city);
          formData.append("address.state", data.address.state);
          formData.append("address.pincode", data.address.pincode);
        }
      });
      // Submit the formData
      try {
        await editEstablishment({
          id: establishmentId,
          data: formData,
        }).unwrap();
        toast.success("Establishment Updated successfully");
        navigate("/establishments/");
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
    } catch (error) {
      console.error("Error adding establishment:", error);
    }
  });

  const handleSpecializationsChange = (selectedList: any) => {
    setFormData((prevData: FormProps) => ({
      ...prevData,
      specializations: selectedList,
    }));
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG and PNG files are allowed.");
        e.target.value = ""; // Clear the file input
        setLogoPreview(null); // Clear any existing preview
        return;
      }

      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error("File size should not exceed 2MB.");
        e.target.value = ""; // Clear the file input
        setLogoPreview(null); // Clear any existing preview
        return;
      }

      setLogo(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogo(undefined);
      setLogoPreview(null); // Clear the preview if no file is selected
    }
  };


  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Establishments", path: "/establishments/" },
    { label: "Edit Establishment" },
  ];

  if (isLoadingEstablishment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 24 24"
          >
            <ellipse cx="12" cy="5" fill="#4f46e5" rx="4" ry="4">
              <animate
                id="svgSpinnersBouncingBall0"
                fill="freeze"
                attributeName="cy"
                begin="0;svgSpinnersBouncingBall2.end"
                calcMode="spline"
                dur="0.375s"
                keySplines=".33,0,.66,.33"
                values="5;20"
              />
              <animate
                attributeName="rx"
                begin="svgSpinnersBouncingBall0.end"
                calcMode="spline"
                dur="0.05s"
                keySplines=".33,0,.66,.33;.33,.66,.66,1"
                values="4;4.8;4"
              />
              <animate
                attributeName="ry"
                begin="svgSpinnersBouncingBall0.end"
                calcMode="spline"
                dur="0.05s"
                keySplines=".33,0,.66,.33;.33,.66,.66,1"
                values="4;3;4"
              />
              <animate
                id="svgSpinnersBouncingBall1"
                attributeName="cy"
                begin="svgSpinnersBouncingBall0.end"
                calcMode="spline"
                dur="0.025s"
                keySplines=".33,0,.66,.33"
                values="20;20.5"
              />
              <animate
                id="svgSpinnersBouncingBall2"
                attributeName="cy"
                begin="svgSpinnersBouncingBall1.end"
                calcMode="spline"
                dur="0.4s"
                keySplines=".33,.66,.66,1"
                values="20.5;5"
              />
            </ellipse>
          </svg>
          {/* <div className="w-12 h-12 rounded-full absolute border-8 border-dashed border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-8 border-dashed border-teal-400 border-t-transparent"></div> */}
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Edit Establishment</div>
          <Link className="p-1" to="/establishments/">
            <Button variant="ghost">
              <IoIosArrowBack className="mt-0.5" />
              &nbsp; Back
            </Button>
          </Link>
        </div>
        <hr />
        <Form {...form}>
          <form className="container-fluid p-6" onSubmit={onSubmit}>
            <div className="mb-6">
              <div className="text-lg font-bold mb-4">Basic Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3">
                  <div className="mb-4">
                    <Label
                      className="mb-2 block text-sm font-medium"
                      htmlFor="logo"
                    >
                      Logo
                    </Label>
                    {logoPreview ? (
                      <div className="relative w-24 h-24">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogo(undefined);
                            setLogoPreview(null);
                            (
                              document.getElementById(
                                "logo"
                              ) as HTMLInputElement
                            ).value = "";
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 py-0.5 text-xs hover:bg-red-600 shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ) : establishment?.logo ? (
                      <div className="relative w-24 h-24">
                        <img
                          src={establishment.logo as string}
                          alt="Current Logo"
                          className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-sm"
                        />
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 text-xs shadow">
                          Current
                        </span>
                      </div>
                    ) : null}
                    <div className="mb-2 mt-2">
                      <Input
                        accept=".jpg,.jpeg,.png"
                        type="file"
                        id="logo"
                        name="logo"
                        onChange={handleFileChange}
                        placeholder="Upload logo image"
                        className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {form.formState.errors.logo && (
                      <span className="text-red-400 text-xs mt-2 block">
                        {form.formState.errors.logo.message}
                      </span>
                    )}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Establishment Name</FormLabel>
                      <Input
                        type="text"
                        id="name"
                        placeholder="Enter establishment name"
                        {...field}
                      />
                      {form.formState.errors.name && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.name.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <Input
                        type="text"
                        id="tagline"
                        placeholder="Enter Tagline"
                        {...field}
                      />
                      {form.formState.errors.tagline && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.tagline.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
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
                      {form.formState.errors.phone && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.phone.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishment_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Establishment Category</FormLabel>
                      <UISelect
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {establishmentcategoryEnum.map((option) => (
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
                      </UISelect>
                      {form.formState.errors.establishment_category && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.establishment_category.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="text"
                        id="email"
                        placeholder="Enter Email Address"
                        {...field}
                      />
                      {form.formState.errors.email && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.email.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <Input
                        type="text"
                        id="contact_person"
                        placeholder="Enter Contact Person"
                        {...field}
                      />
                      {form.formState.errors.contact_person && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.contact_person.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <Input
                        type="text"
                        id="website"
                        placeholder="Enter Website URL"
                        {...field}
                      />
                      {form.formState.errors.website && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.website.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specializations"
                  render={({ field: { value } }) => (
                    <FormItem>
                      <FormLabel>Specializations</FormLabel>
                      <Multiselect
                        options={specializationData?.results || []}
                        selectedValues={value}
                        onSelect={handleSpecializationsChange}
                        onRemove={handleSpecializationsChange}
                        displayValue="name"
                        style={{
                          chips: {
                            background: '#6366f1',
                            border: 'none',
                            'border-radius': '5px'

                          },
                        }}
                      />
                      {form.formState.errors.specializations && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.specializations.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Establishment Services */}
              <div>
                <FormField
                  control={form.control}
                  name="establishment_services"
                  render={() => (
                    <FormItem>
                      <FormLabel>Establishment Services</FormLabel>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          id="establishment_services"
                          placeholder="Enter service, press Enter"
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (inputValue.trim() !== "") {
                              if (
                                !items.includes(inputValue.trim().toLowerCase())
                              ) {
                                setItems((prev) => [
                                  ...prev,
                                  inputValue.trim(),
                                ]);
                                setInputValue("");
                              } else {
                                toast.error(
                                  `${inputValue.trim()} already exists.`
                                );
                              }
                            }
                          }}
                          className="bg-indigo-500 hover:bg-indigo-600"
                        >
                          <BsFillPlusCircleFill className="mr-2" /> Add
                        </Button>
                      </div>
                      {items.length > 0 && (
                        <div className="mt-3 rounded border border-gray-300 p-2 flex flex-wrap gap-2">
                          {items.map((item, index) => (
                            <Pill
                              key={index}
                              text={item}
                              onRemove={handleRemoveItem}
                            />
                          ))}
                        </div>
                      )}
                      {form.formState.errors.establishment_services && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.establishment_services.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              {/* Establishment Images */}
              <div>
                <FormField
                  control={form.control}
                  name="establishment_images"
                  render={() => (
                    <FormItem>
                      <div className="flex mb-2">
                        <FormLabel className="text-sm">
                          Establishment Images
                        </FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <IoInformationCircle className="text-gray-500 ml-2 mb-2 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>
                                <strong>Note:</strong>
                                <ul className="list-disc p-1 text-xs">
                                  <li>Maximum 5 images allowed.</li>
                                  <li>Max size: 2MB each</li>
                                </ul>
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <ImageUploader
                        initialImages={imageData as any}
                        setDeletedImages={setDeletedImages}
                        setImageFiles={setImageFiles}
                        imageFiles={imageFiles}
                      />
                      {form.formState.errors.establishment_images && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.establishment_images.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Summary */}
            <div className="mb-6">
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <ReactQuill
                      theme="snow"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                        field.onChange(newValue);
                      }}
                      className="bg-white mb-4 h-[200px] md:h-[300px]"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ["bold", "italic", "underline", "strike"],
                          ["link", "blockquote", "code-block", "image"],
                          [{ list: "ordered" }, { list: "bullet" }],
                        ],
                      }}
                    />
                    {form.formState.errors.summary && (
                      <span className="text-red-400 text-xs">
                        {form.formState.errors.summary.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />
            </div>
            &nbsp;
            <hr />
            &nbsp;
            {/* Add the Owner */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Establishment Owner</div>
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex mb-1">
                      <FormLabel className="text-sm">Select Owner</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoInformationCircle className="text-gray-500 ml-2 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>
                              <strong>Note:</strong> Selecting another doctor
                              will replace the existing owner of the
                              establishment.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <UISelect
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue
                            placeholder={`${doctor_list?.existing_doctors?.[0]?.full_name}`}
                          >
                            {field.value ? (
                              <span>
                                {
                                  doctor_list?.available_doctors?.find(
                                    (doctor: IDoctor) =>
                                      doctor.id.toString() === field.value
                                  )?.full_name
                                }
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                Select doctor
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {doctor_list?.existing_doctors?.map(
                            (doctor: IDoctor) => (
                              <SelectItem
                                key={doctor.id}
                                value={doctor.id} // Ensure the value is a string
                                className={`${
                                  doctor.id.toString() === field.value
                                    ? "bg-indigo-600 text-white"
                                    : "hover:bg-white"
                                }`}
                              >
                                <div className="flex items-center">
                                  <img
                                    className="w-[100px] h-[100px] border border-gray-300 rounded-md mr-2 object-cover object-center"
                                    src={doctor.avatar || defaultimage}
                                    alt={doctor.full_name}
                                  />
                                  <div className="flex flex-col p-2">
                                    <span className="font-bold">
                                      {doctor.full_name}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {doctor.degree}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {doctor?.address?.city}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {doctor.gender === "M"
                                        ? "Male"
                                        : "Female"}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          )}
                          {doctor_list?.available_doctors?.map(
                            (doctor: IDoctor) => (
                              <SelectItem
                                key={doctor.id}
                                value={doctor.id} // Ensure the value is a string
                                className={`${
                                  doctor.id.toString() === field.value
                                    ? "bg-indigo-600 text-white"
                                    : "hover:bg-white"
                                }`}
                              >
                                <div className="flex items-center">
                                  <img
                                    className="w-[100px] h-[100px] border border-gray-300 rounded-md mr-2 object-cover object-center"
                                    src={doctor.avatar || defaultimage}
                                    alt={doctor.full_name}
                                  />
                                  <div className="flex flex-col p-2">
                                    <span className="font-bold">
                                      {doctor.full_name}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {doctor.degree}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {doctor?.address?.city}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {doctor.gender === "M"
                                        ? "Male"
                                        : "Female"}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </UISelect>
                    <span className="text-xs text-gray-500">
                      <strong>Current Owner:</strong>{" "}
                      {doctor_list?.existing_doctors?.[0]?.full_name || "None"}
                      <br />
                    </span>
                    {form.formState.errors.owner && (
                      <span className="text-red-400 text-xs">
                        {form.formState.errors.owner.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />
            </div>
            &nbsp;
            <hr />
            &nbsp;
            {/* Add the Staffs */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Establishment Staffs</div>
              <FormField
                name="staffs"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="text-sm mr-2">
                        Add Staff
                        {/* <span className="text-lg font-bold text-red-500 p-0.5">
                          {" "}
                          *{" "}
                        </span> */}
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <BsFillInfoCircleFill className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>
                              Add staff members to this establishment. You can
                              add multiple staff members.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select
                      defaultValue={staff_list?.existing_doctors.map(
                        (doctor: IDoctor) => ({
                          value: doctor.id,
                          label: doctor.full_name,
                        })
                      )}
                      isMulti
                      options={staff_list?.available_doctors.map(
                        (doctor: IDoctor) => ({
                          value: doctor.id,
                          label: doctor.full_name,
                          dataDoctor: doctor,
                        })
                      )}
                      className="text-sm"
                      placeholder="Select Available Doctors"
                      {...field}
                      components={{
                        Option: (props) => (
                          <DoctorCard
                            doctor={props.data.dataDoctor}
                            isLoading={isloadingAvaiableStaffDoctors}
                            isError={stafflisterror}
                            {...props.innerProps}
                          />
                        ),
                      }}
                    />
                    {form.formState.errors.staffs && (
                      <span className="text-red-400 text-xs">
                        {form.formState.errors.staffs.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />
            </div>
            &nbsp;
            <hr />
            &nbsp;
            {/* Address Details section */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Address Details</div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.address_line_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House No./Street/Area</FormLabel>
                      <Input
                        type="text"
                        id="address_line_1"
                        placeholder="Enter Address line 1"
                        {...field}
                      />
                      {form.formState.errors.address?.address_line_1 && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.address.address_line_1.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.address_line_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locality</FormLabel>
                      <Input
                        type="text"
                        id="address_line_2"
                        placeholder="Enter Address line 2"
                        {...field}
                      />
                      {form.formState.errors.address?.address_line_2 && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.address.address_line_2.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Landmark</FormLabel>
                      <Input
                        type="text"
                        id="landmark"
                        placeholder="Enter landmark"
                        required={false}
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
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <UISelect
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
                      </UISelect>
                      {form.formState.errors.address?.state && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.address.state.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin Code</FormLabel>
                      <Input
                        type="text"
                        id="pincode"
                        placeholder="Enter pincode"
                        {...field}
                      />
                      {form.formState.errors.address?.pincode && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.address.pincode.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            &nbsp;
            <hr />
            &nbsp;
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Timings</div>
              <BusinessHoursForm
                establishmentId={"" as string}
                onSave={handleSave}
                timings={establishment?.timings ? convert24HrToAmPm(establishment?.timings as any) as any : ""}
              />
            </div>
            &nbsp;
            <hr />
            &nbsp;
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? "Updating..." : "Update Establishment"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditEstablishmentForm;
