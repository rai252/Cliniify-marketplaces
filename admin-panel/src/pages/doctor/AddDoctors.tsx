import { FC, ChangeEvent, useState } from 'react'
import { IDoctorAdd } from '@/interfaces/doctor.interface'
import { useAddDoctorMutation } from '@/services/doctors/doctor.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IoIosArrowBack } from 'react-icons/io'
import Multiselect from 'multiselect-react-dropdown'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as yup from 'yup'
import { useGetSpecializationsQuery } from '@/services/specalizations/specializations.service'
import { BusinessHours } from '@/interfaces/business.interface'
// import BusinessHoursForm from "./openingHours/BusinessHoursForm";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import Breadcrumbs from '@/components/Breadcrumb'
import { toast } from 'react-toastify'
import { StateEnum } from '@/interfaces/user.interface'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { IoInformationCircle } from 'react-icons/io5'
import ImageUploader from '../establishments/custom/ImageUploader'

interface DoctorFormProps {}

interface FormProps {
  avatar: File | null
  identity_proof: File | null
  medical_reg_proof: File | null
  establishment_proof: File | null
  specializations: any[]
  timings?: BusinessHours
}

const URL_REGEX =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm

const addressSchema = yup.object().shape({
  address_line_1: yup.string().required('House No./Street/Area is required'),
  address_line_2: yup.string().required('Locality is required'),
  landmark: yup.string().notRequired(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .min(6, 'Pincode must consist of exactly 6 characters'),
})

const validationSchema = yup.object().shape({
  full_name: yup.string().required('Full Name is required'),
  phone: yup.string().max(10).required('Phone is required'),
  alternative_number: yup.string().notRequired(),
  clinic_no: yup.string().max(10).notRequired(),
  gender: yup.string().required('Gender is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  reg_no: yup.string().notRequired(),
  reg_council: yup.string().notRequired(),
  reg_year: yup
    .number()
    .integer('Registered Year must be an integer')
    .max(
      new Date().getFullYear(),
      'Registered year must be less than or equal to the Current Year'
    )
    .notRequired(),
  degree: yup.string().notRequired(),
  institute_name: yup.string().notRequired(),
  completion_year: yup
    .number()
    .integer('Completion Year must be an integer')
    .max(
      new Date().getFullYear(),
      'Completion year must be less than or equal to the Current Year'
    )
    .notRequired(),
  experience_years: yup
    .number()
    .integer('Experience Years must be an integer')
    .notRequired(),
  own_establishment: yup.boolean().notRequired(),
  bio: yup.string().notRequired(),
  identity_proof: yup.mixed().notRequired(),
  medical_reg_proof: yup.mixed().notRequired(),
  establishment_proof: yup.mixed().notRequired(),
  address: addressSchema,
  fee: yup.number().notRequired(),
  time_duration: yup.string().notRequired(),
  website: yup.string().matches(URL_REGEX, 'Enter a valid url'),
})

const DoctorForm: FC<DoctorFormProps> = () => {
  const { data: specializationData } = useGetSpecializationsQuery([])
  const form = useForm<IDoctorAdd>({
    resolver: yupResolver(validationSchema) as any,
  })
  const [formData, setFormData] = useState<FormProps>({
    avatar: null,
    identity_proof: null,
    medical_reg_proof: null,
    establishment_proof: null,
    specializations: [],
  })

  const navigate = useNavigate()
  const [addDoctor, { isLoading }] = useAddDoctorMutation()
  const [ownEstablishment, setOwnEstablishment] = useState<boolean>(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [_, setDeletedImages] = useState<number[]>([])
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logo, setLogo] = useState<File>()

  // const handleSave = (hours: BusinessHours) => {
  //   const businessHrs: BusinessHours = {};
  //   for (const day in hours) {
  //     const dayHours = hours[day];
  //     if (Array.isArray(dayHours)) {
  //       businessHrs[day] = dayHours.filter(
  //         (hour: { start_time: string; end_time: string }) =>
  //           hour.start_time !== "" && hour.end_time !== ""
  //       );
  //     }
  //   }
  //   setFormData((prevData: any) => ({
  //     ...prevData,
  //     timings: businessHrs,
  //   }));
  // };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOwnEstablishment(e.target.checked)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files }: { name: string; files: FileList | null } = e.target
    setFormData((prevData: FormProps) => ({
      ...prevData,
      [name]: files ? files[0] : null,
    }))
  }

  const onSubmit = form.handleSubmit(async (data) => {
    data.email = data.email.toLowerCase()
    try {
      console.log(data)

      const mergeData = { ...data, ...formData }
      const form_Data: FormData = new FormData()

      if (logo && logo instanceof File) {
        form_Data.append('avatar', logo)
      }

      // if (formData.timings) {
      //   form_Data.append("timings", JSON.stringify(formData.timings));
      // }

      imageFiles.forEach((image) => {
        if (typeof image !== 'string' || image === null) {
          form_Data.append(`images`, image)
        }
      })

      for (const [key, value] of Object.entries(mergeData)) {
        if (
          mergeData.hasOwnProperty(key) &&
          key !== 'specializations' &&
          key !== 'timings' &&
          key !== 'address' &&
          key !== 'images'
        ) {
          if (
            (key === 'identity_proof' ||
              key === 'medical_reg_proof' ||
              key === 'establishment_proof' ||
              key === 'avatar') &&
            value instanceof File &&
            value !== null
          ) {
            form_Data.append(key, value as any)
          }

          if (
            (typeof value === 'string' && value.startsWith('http')) ||
            value === null
          ) {
            continue
          }

          form_Data.append(key, value as any)
        }

        form_Data.append('website', data.website)

        if (key == 'address' && data.address) {
          form_Data.append(
            'address.address_line_1',
            data.address.address_line_1
          )
          form_Data.append(
            'address.address_line_2',
            data.address.address_line_2
          )
          form_Data.append('address.landmark', data.address.landmark)
          form_Data.append('address.city', data.address.city)
          form_Data.append('address.state', data.address.state)
          form_Data.append('address.pincode', data.address.pincode)
        }
      }

      const specializationIds = formData.specializations.map(
        (specialization: any) => specialization.id
      )

      specializationIds.forEach((id) => {
        form_Data.append('specializations', id)
      })

      try {
        await addDoctor(form_Data).unwrap()

        toast.success('Doctor Added successfully')
        navigate('/doctors/')
      } catch (error: any) {
        if (error && error.data) {
          const errorData = error.data

          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              const errorMessages = errorData[field]
              console.log(errorMessages)
              if (typeof errorMessages === 'object') {
                for (const nestedField in errorMessages) {
                  if (errorMessages.hasOwnProperty(nestedField)) {
                    const nestedErrorMessages = errorMessages[nestedField]
                    console.log(nestedErrorMessages)

                    if (
                      Array.isArray(nestedErrorMessages) &&
                      nestedErrorMessages.length > 0
                    ) {
                      const errorPath = `${field}.${nestedField}`
                      form.setError(errorPath as any, {
                        message: nestedErrorMessages[0],
                      })
                      form.setFocus(errorPath as any)
                    }
                  }
                }
              }
              if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                form.setError(field as any, { message: errorMessages[0] })
                form.setFocus(field as any)
              }
            }
          }
        } else {
          toast.error('An unexpected error occurred while updating doctor.')
        }
      }
    } catch (error) {
      console.error('Error updating doctor:', error)
    }
  })

  const handleSpecializationsChange = (selectedList: any) => {
    setFormData((prevData: FormProps) => ({
      ...prevData,
      specializations: selectedList,
    }))
  }

  const timeDurationEnum = [
    { label: '10 minutes', value: '00:10' },
    { label: '15 minutes', value: '00:15' },
    { label: '20 minutes', value: '00:20' },
    { label: '30 minutes', value: '00:30' },
    { label: '45 minutes', value: '00:45' },
    { label: '1 hour', value: '01:00' },
  ]

  const GenderEnum = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ]

  const handle_File_Change = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG and PNG files are allowed.')
        e.target.value = ''
        setLogoPreview(null)
        return
      }

      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('File size should not exceed 2MB.')
        e.target.value = ''
        setLogoPreview(null)
        return
      }

      setLogo(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setLogo(undefined)
      setLogoPreview(null)
    }
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Add Doctor' },
  ]

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Add Doctors</div>
          <Link className="p-1" to="/doctors/">
            <Button variant="ghost">
              <IoIosArrowBack className="mt-0.5" />
              &nbsp; Back
            </Button>
          </Link>
        </div>
        <hr />
        <Form {...form}>
          <form className="container-fluid p-6" onSubmit={onSubmit}>
            {/* Personal Details */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Personal Details</div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3">
                  <div className="mb-4">
                    <Label
                      className="mb-2 block text-sm font-medium"
                      htmlFor="avatar"
                    >
                      Profile Image
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
                            setLogo(undefined)
                            setLogoPreview(null)
                            ;(
                              document.getElementById(
                                'logo'
                              ) as HTMLInputElement
                            ).value = ''
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 py-0.5 text-xs hover:bg-red-600 shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}
                    <div className="mb-2 mt-2">
                      <Input
                        accept=".jpg,.jpeg,.png"
                        type="file"
                        id="avatar"
                        name="avatar"
                        onChange={handle_File_Change}
                        placeholder="Upload avatar image"
                        className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {form.formState.errors.avatar && (
                      <span className="text-red-400 text-xs mt-2 block">
                        {form.formState.errors.avatar.message}
                      </span>
                    )}
                  </div>
                </div>
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
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.phone.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alternative_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternative Number</FormLabel>
                      <Input
                        type="text"
                        id="alternative_number"
                        placeholder="Enter Alternative Number"
                        {...field}
                      />
                      {form.formState.errors.alternative_number && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.alternative_number.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clinic_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Establishment/Clinic Number</FormLabel>
                      <Input
                        type="text"
                        id="clinic_no"
                        placeholder="Enter Establishment/Clinic Number"
                        {...field}
                      />
                      {form.formState.errors.clinic_no && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.clinic_no.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
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
                            {GenderEnum.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className={`${
                                  option.value === field.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'hover:bg-white'
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
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.email.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Enter Password"
                        {...field}
                      />
                      {form.formState.errors.password && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.password.message}
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
                        placeholder="Enter Website.."
                        {...field}
                      />
                      {form.formState.errors.website && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.website.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <div className="mb-2 mt-2 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <Textarea
                          id="bio"
                          placeholder="Write about yourself...."
                          rows={5}
                          {...field}
                        />
                        {form.formState.errors.bio && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.bio.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-2 mt-2 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3">
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <div className="flex mb-2">
                          <FormLabel className="text-sm">Images</FormLabel>
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
                          initialImages={[]}
                          setDeletedImages={setDeletedImages}
                          setImageFiles={setImageFiles}
                          imageFiles={imageFiles}
                        />
                        {form.formState.errors.images && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.images.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            &nbsp;
            <hr />
            &nbsp;
            {/* Educational Details Section */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">
                Educational & Specializations Details
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <Input
                        type="text"
                        id="degree"
                        placeholder="Enter degree"
                        {...field}
                      />
                      {form.formState.errors.degree && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.degree.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institute_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institute Name</FormLabel>
                      <Input
                        type="text"
                        id="institute_name"
                        placeholder="Enter institute name"
                        {...field}
                      />
                      {form.formState.errors.institute_name && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.institute_name.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="completion_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Year</FormLabel>
                      <Input
                        type="text"
                        id="completion_year"
                        placeholder="Enter completion year"
                        min="1"
                        {...field}
                      />
                      {form.formState.errors.completion_year && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.completion_year.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specializations"
                  render={() => (
                    <FormItem>
                      <FormLabel>Specializations</FormLabel>
                      <Multiselect
                        options={specializationData?.results || []}
                        selectedValues={formData.specializations}
                        onSelect={handleSpecializationsChange}
                        onRemove={handleSpecializationsChange}
                        displayValue="name"
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
            &nbsp;
            <hr />
            &nbsp;
            {/* Address Details */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Address Details</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
                <div className="mb-2">
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
                <div className="mb-2">
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
                              form.formState.errors.address?.address_line_2
                                .message
                            }
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-2">
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
                            {form.formState.errors.address?.landmark.message}
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
                          id="address.city"
                          placeholder="Enter city"
                          {...field}
                        />
                        {form.formState.errors.address?.city && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.address?.city.message}
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
                                      ? 'bg-indigo-600 text-white'
                                      : 'hover:bg-white'
                                  }`}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.address?.state && (
                    <span className="text-red-400 text-xs ">
                      {form.formState.errors.address?.state.message}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="address.pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pin Code</FormLabel>
                        <Input
                          type="text"
                          id="address.pincode"
                          placeholder="Enter pincode"
                          {...field}
                        />
                        {form.formState.errors.address?.pincode && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.address.pincode.message ||
                              ''}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            &nbsp;
            <hr />
            &nbsp;
            {/* Professional Details Section */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Professional Details</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
                <FormField
                  control={form.control}
                  name="reg_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Number</FormLabel>
                      <Input {...field} placeholder="Enter registered number" />
                      {form.formState.errors.reg_no && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.reg_no.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reg_council"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Council</FormLabel>
                      <Input
                        {...field}
                        placeholder="Enter registered council"
                      />
                      {form.formState.errors.reg_council && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.reg_council.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reg_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Year</FormLabel>
                      <Input {...field} placeholder="Enter registered year" />
                      {form.formState.errors.reg_year && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.reg_year.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience_years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Years</FormLabel>
                      <Input {...field} placeholder="Enter experience years" />
                      {form.formState.errors.experience_years && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.experience_years.message}
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
              <div className="flex">
                <div className="text-lg font-bold mb-2">
                  Documents/Certificate Details
                </div>
                <div className="ml-2 mt-2 hover:cursor-pointer">
                  <a className="my-anchor-element">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200s200-89.72 200-200S366.28 56 256 56m0 82a26 26 0 1 1-26 26a26 26 0 0 1 26-26m48 226h-88a16 16 0 0 1 0-32h28v-88h-16a16 16 0 0 1 0-32h32a16 16 0 0 1 16 16v104h28a16 16 0 0 1 0 32"
                      />
                    </svg>
                  </a>
                  {/* <Tooltip anchorSelect=".my-anchor-element" place="right">
                    Only .pdf and .doc extensions are allowed with size less
                    then 5 MB.
                  </Tooltip> */}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
                <FormField
                  control={form.control}
                  name="identity_proof"
                  render={() => (
                    <FormItem>
                      <FormLabel>Identity Proof</FormLabel>
                      <Input
                        type="file"
                        id="identity_proof"
                        name="identity_proof"
                        onChange={handleFileChange}
                      />
                      {form.formState.errors.identity_proof && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.identity_proof.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medical_reg_proof"
                  render={() => (
                    <FormItem>
                      <FormLabel>Medical Registration Proof</FormLabel>
                      <Input
                        type="file"
                        id="medical_reg_proof"
                        name="medical_reg_proof"
                        onChange={handleFileChange}
                      />
                      {form.formState.errors.medical_reg_proof && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.medical_reg_proof.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <div className="mt-8 flex items-center">
                  <input
                    type="checkbox"
                    {...form.register('own_establishment')}
                    checked={ownEstablishment}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  {form.formState.errors.own_establishment && (
                    <span className="text-red-400 text-xs ">
                      {form.formState.errors.own_establishment.message}
                    </span>
                  )}
                  <FormLabel
                    htmlFor="own_establishment"
                    className="font-medium"
                  >
                    Own Establishment
                  </FormLabel>
                </div>

                {ownEstablishment && (
                  <FormField
                    control={form.control}
                    name="establishment_proof"
                    render={() => (
                      <FormItem>
                        <FormLabel>Establishment Proof</FormLabel>
                        <Input
                          type="file"
                          id="establishment_proof"
                          name="establishment_proof"
                          onChange={handleFileChange}
                        />
                        {form.formState.errors.establishment_proof && (
                          <span className="text-red-400 text-xs ">
                            {form.formState.errors.establishment_proof.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            &nbsp;
            <hr />
            &nbsp;
            {/* Other Details Section */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">
                Establishments Details
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee</FormLabel>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        placeholder="Enter fee"
                      />
                      {form.formState.errors.fee && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.fee.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Duration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Time Duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {timeDurationEnum.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className={`${
                                  option.value === field.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'hover:bg-white'
                                }`}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.time_duration && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.time_duration.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <div className="mt-8 flex items-center">
                  <FormField
                    control={form.control}
                    name="is_verified"
                    render={() => (
                      <FormItem>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            {...form.register('is_verified')}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          &nbsp;
                          {form.watch('is_verified') ? (
                            <Badge className="rounded-md bg-green-600 hover:bg-green-600">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="rounded-md bg-red-600 hover:bg-red-600">
                              Not Verified
                            </Badge>
                          )}
                        </div>
                        {form.formState.errors.is_verified && (
                          <span className="text-red-400 text-xs">
                            {form.formState.errors.is_verified.message}
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
              {/* <div className="mb-8">
                <div className="text-lg font-bold mb-2">Business Hours</div>
                <div className="mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Set Business Hours
                    </h2>
                    <BusinessHoursForm
                      establishmentId={""}
                      onSave={handleSave}
                      timings={"" as any}
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Adding...' : 'Add Doctor'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default DoctorForm
