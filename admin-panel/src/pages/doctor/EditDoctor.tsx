import { FC, ChangeEvent, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IoIosArrowBack } from 'react-icons/io'
import Multiselect from 'multiselect-react-dropdown'
import BusinessHoursForm from './openingHours/BusinessHoursForm'
import { useGetSpecializationsQuery } from '@/services/specalizations/specializations.service'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { useNavigate, useParams } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

import {
  useEditDoctorMutation,
  useGetDoctorByIdQuery,
} from '@/services/doctors/doctor.service'
import { IDoctorEdit, IDoctorImages } from '@/interfaces/doctor.interface'
import { BusinessHours } from '@/interfaces/business.interface'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/Breadcrumb'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StateEnum } from '@/interfaces/user.interface'
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { IoInformationCircle } from 'react-icons/io5'
import ImageUploader from '../establishments/custom/ImageUploader'
import {
  convert24HrToAmPm,
  convertTimingsToTwentyFourHourFormat,
} from './custom/convert24HrToAmPm'

interface FormProps {
  avatar: File | null
  identity_proof: File | null
  medical_reg_proof: File | null
  establishment_proof: File | null
  specializations: any[]
}

interface Itimings {
  [key: string]: BusinessHours
}

const addressSchema = yup.object().shape({
  address_line_1: yup.string().notRequired(),
  address_line_2: yup.string().notRequired(),
  landmark: yup.string().notRequired(),
  city: yup.string().notRequired(),
  state: yup.string().notRequired(),
  pincode: yup.string().notRequired(),
})

const validationSchema = yup.object().shape({
  full_name: yup.string().required('Full Name is required'),
  phone: yup.string().required('Phone is required'),
  alternative_number: yup.string().optional(),
  clinic_no: yup.string().max(10).notRequired(),
  gender: yup.string().optional(),
  email: yup.string().email().optional(),
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
})

const EditDoctorForm: FC = () => {
  const { id: doctorId } = useParams<{ id: string }>()
  const { data: specializationData } = useGetSpecializationsQuery([])
  const [editDoctor, { isLoading: isUpdating }] = useEditDoctorMutation()
  const form = useForm<IDoctorEdit>({
    resolver: yupResolver(validationSchema) as any,
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageData, setImageData] = useState<IDoctorImages[]>([])
  const [deletedImages, setDeletedImages] = useState<number[]>([])
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logo, setLogo] = useState<File>()

  const { data: doctorData, isLoading } = useGetDoctorByIdQuery({
    id: doctorId as string,
    expand: 'address',
  })
  const [ownEstablishment, setOwnEstablishment] = useState<boolean>(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormProps>({
    avatar: null,
    identity_proof: null,
    medical_reg_proof: null,
    establishment_proof: null,
    specializations: [],
  })

  const [timings, setTimings] = useState<Itimings[]>()

  useEffect(() => {
    if (doctorData) {
      setImageData(doctorData?.images || [])

      form.reset({
        full_name: doctorData?.full_name || '',
        phone: doctorData?.phone || '',
        alternative_number: doctorData.alternative_number || '',
        clinic_no: doctorData.clinic_no || '',
        gender: doctorData?.gender || '',
        email: doctorData?.email || '',
        specializations: doctorData?.specializations || [],
        bio: doctorData?.bio || '',
        reg_no: doctorData?.reg_no || '',
        reg_council: doctorData?.reg_council || '',
        reg_year: doctorData?.reg_year || 0,
        degree: doctorData?.degree || '',
        institute_name: doctorData?.institute_name || '',
        completion_year: doctorData?.completion_year || 0,
        experience_years: doctorData?.experience_years || 0,
        own_establishment: doctorData?.own_establishment || false,
        avatar: doctorData?.avatar || '',
        address: {
          address_line_1: doctorData?.address?.address_line_1 || '',
          address_line_2: doctorData?.address?.address_line_2 || '',
          landmark: doctorData?.address?.landmark || '',
          city: doctorData?.address?.city || '',
          state: doctorData?.address?.state || '',
          pincode: doctorData?.address?.pincode || '',
        },
        fee: doctorData?.fee || 0,
        timings: doctorData?.timings || [],
        time_duration: doctorData?.time_duration || '',
        is_verified: doctorData?.is_verified || false,
        website: doctorData?.website || '',
      })
    }
  }, [doctorData, form])

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOwnEstablishment(e.target.checked)
  }

  const handleSave = (hours: BusinessHours, establishmentId: string) => {
    const businessHrs: BusinessHours = {}
    for (const day in hours) {
      const dayHours = hours[day]
      if (Array.isArray(dayHours)) {
        businessHrs[day] = dayHours.filter(
          (hour: { start_time: string; end_time: string }) =>
            hour.start_time !== '' && hour.end_time !== ''
        )
      }
    }

    setTimings(
      (prevTimings) =>
        ({
          ...prevTimings,
          [establishmentId]: businessHrs as BusinessHours,
        } as any)
    )
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files }: { name: string; files: FileList | null } = e.target
    setFormData((prevData: FormProps) => ({
      ...prevData,
      [name]: files ? files[0] : null,
    }))
  }

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

      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        toast.error('File size should not exceed 2MB.')
        e.target.value = '' // Clear the file input
        setLogoPreview(null) // Clear any existing preview
        return
      }

      setLogo(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setLogo(undefined)
      setLogoPreview(null) // Clear the preview if no file is selected
    }
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

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Edit Doctor' },
  ]

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const mergeData = { ...data, ...formData }
      const form_Data: FormData = new FormData()

      // if (formData.timings) {
      //   form_Data.append("timings", JSON.stringify(formData.timings));
      // }
      let relations = []
      if (timings) {
        for (const establishmentId in timings) {
          const convertedTimings = convertTimingsToTwentyFourHourFormat(
            timings[establishmentId] as any
          )
          const relation = {
            doctor: doctorData?.id,
            establishment: establishmentId,
            timings: convertedTimings,
          }
          relations.push(relation)
        }
      }
      form_Data.append('relations', JSON.stringify(relations))

      if (data.website) {
        form_Data.append('website', data.website)
      }

      if (logo && logo instanceof File) {
        form_Data.append('avatar', logo)
      }

      imageFiles.forEach((image) => {
        if (typeof image !== 'string' || image === null) {
          form_Data.append(`images`, image)
        }
      })

      deletedImages.forEach((imageId) => {
        form_Data.append('deleted_images', imageId.toString())
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
            // continue;
          }

          if (
            (typeof value === 'string' && value.startsWith('http')) ||
            value === null
          ) {
            continue
          }

          if (value) form_Data.append(key, value as any)
        }

        if (
          key == 'address' &&
          data.address &&
          Object.values(data.address).some((value) => value)
        ) {
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
        await editDoctor({
          id: doctorId,
          data: form_Data,
        }).unwrap()

        toast.success('Doctor updated successfully')
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

  if (isLoading) {
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
    )
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Edit Doctor Details</div>
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
                    ) : doctorData?.avatar ? (
                      <div className="relative w-24 h-24">
                        <img
                          src={doctorData?.avatar as string}
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
                        id="avatar"
                        name="avatar"
                        onChange={handle_File_Change}
                        placeholder="Upload logo image"
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
                        defaultValue={doctorData?.full_name}
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
                        defaultValue={doctorData?.phone}
                        {...field}
                        disabled
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
                        defaultValue={doctorData?.alternative_number}
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
                        defaultValue={doctorData?.clinic_no}
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
                            {/* <SelectValue placeholder="Select gender" /> */}
                            <SelectValue
                              placeholder={
                                field.value === 'M'
                                  ? 'Male'
                                  : field.value === 'F'
                                  ? 'Female'
                                  : field.value === 'O'
                                  ? 'Other'
                                  : 'Select gender'
                              }
                            />
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
                        defaultValue={doctorData?.email}
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
                          defaultValue={doctorData?.bio}
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
                          initialImages={imageData as any}
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
              <div className="text-lg font-bold mb-2">Educational Details</div>
              <div className="grid grid-cols-2 gap-4">
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
                        defaultValue={doctorData?.degree}
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
                        defaultValue={doctorData?.institute_name}
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
                        type="number"
                        id="completion_year"
                        placeholder="Enter completion year"
                        defaultValue={doctorData?.completion_year}
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
                  render={({ field: { value } }) => (
                    <FormItem>
                      <FormLabel>Specializations</FormLabel>
                      <Multiselect
                        options={specializationData?.results || []}
                        selectedValues={value}
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
            {/* Address Details Section */}
            <div className="mb-2">
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
                          defaultValue={doctorData?.address?.address_line_1}
                          {...field}
                        />
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
                          defaultValue={doctorData?.address?.address_line_2}
                          {...field}
                        />
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
                          defaultValue={doctorData?.address?.landmark}
                          {...field}
                        />
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
                          defaultValue={doctorData?.address?.city}
                          {...field}
                        />
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
                          id="pincode"
                          placeholder="Enter pincode"
                          defaultValue={doctorData?.address?.pincode}
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
            </div>
            &nbsp;
            <hr />
            &nbsp;
            {/* Professional Details Section */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">Professional Details</div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reg_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Number</FormLabel>
                      <Input
                        {...field}
                        placeholder="Enter registered number"
                        defaultValue={doctorData?.reg_no}
                      />
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
                        defaultValue={doctorData?.reg_council}
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
                      <Input
                        {...field}
                        placeholder="Enter registered year"
                        defaultValue={doctorData?.reg_year}
                      />
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
                      <Input
                        {...field}
                        placeholder="Enter experience years"
                        defaultValue={doctorData?.experience_years}
                      />
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
                  <Tooltip anchorSelect=".my-anchor-element" place="right">
                    Only .pdf and .doc extensions are allowed with size less
                    then 5 MB.
                  </Tooltip>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    defaultValue={
                      doctorData?.own_establishment ? 'true' : 'false'
                    }
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  {form.formState.errors.own_establishment && (
                    <span className="text-red-400 text-xs ">
                      {form.formState.errors.own_establishment.message}
                    </span>
                  )}
                  <FormLabel
                    htmlFor="own_establishment"
                    className="font-medium text-gray-700"
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee</FormLabel>
                      <Input
                        {...field}
                        placeholder="Enter fee"
                        defaultValue={doctorData?.fee}
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

                <FormField
                  control={form.control}
                  name="is_verified"
                  render={() => (
                    <FormItem>
                      <input
                        type="checkbox"
                        {...form.register('is_verified')}
                        defaultChecked={doctorData?.is_verified}
                        className="px-2.5 py-0.5"
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
            {/* Opening Hours Section */}
            <div className="mb-2">
              {doctorData?.associated_establishment ? (
                <>
                  <div className="text-lg font-bold mb-2">Timings</div>
                  {doctorData.associated_establishment.map(
                    (establishment, idx) => (
                      <>
                        <div
                          key={idx}
                          className="border shadow-sm rounded-md mb-2"
                        >
                          <div className="px-6 py-6">
                            <div className="text-md font-bold mb-1">
                              {establishment.name}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              {establishment.address?.address_line_1},{' '}
                              {establishment.address?.address_line_2},{' '}
                              {establishment.address?.city},{' '}
                              {establishment.address?.state}
                            </div>
                            <div className="text-xs text-gray-400 mb-1">
                              {establishment.is_owner
                                ? doctorData.full_name
                                : ''}
                            </div>
                          </div>
                          <hr />
                          <div className="p-2">
                            {doctorData.relations.map((data) => {
                              if (establishment.id === data.establishment_id) {
                                if (data.timings && data.timings !== null) {
                                  return (
                                    <BusinessHoursForm
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
                                  )
                                } else {
                                  return (
                                    <BusinessHoursForm
                                      establishmentId={
                                        establishment.id.toString() as string
                                      }
                                      onSave={handleSave}
                                      timings={''}
                                    />
                                  )
                                }
                              }
                            })}
                          </div>
                        </div>
                      </>
                    )
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? 'Updating...' : 'Update Doctor'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default EditDoctorForm
