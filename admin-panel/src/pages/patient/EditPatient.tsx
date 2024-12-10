import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { IPatientEdit } from '@/interfaces/patient.interface'
import {
  useEditPatientMutation,
  useGetPatientByIdQuery,
} from '@/services/patients/patient.service'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import Breadcrumbs from '@/components/Breadcrumb'
import { toast } from 'react-toastify'
import { StateEnum } from '@/interfaces/user.interface'

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
  email: yup.string().email().notRequired(),
  gender: yup.string().notRequired(),
  address: addressSchema.nullable(),
})

const EditPatientForm = () => {
  const { id: patientId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [EditPatient, { isLoading: isUpadating }] = useEditPatientMutation()
  const form = useForm<IPatientEdit>({
    resolver: yupResolver(validationSchema) as any,
  })

  const { data: patientData, isLoading: isPatientloading } =
    useGetPatientByIdQuery({
      id: patientId as string,
      expand: 'address',
    })

  const [avatar, setAvatar] = useState<File | null>(null)

  function isString(value: string | File | null | undefined): value is string {
    return typeof value === 'string'
  }
  const patientImg = isString(patientData?.avatar)
    ? patientData?.avatar.split('/').pop()
    : ''

  useEffect(() => {
    if (patientData) {
      Object.entries(patientData).forEach(([key, value]) => {
        if (key == 'onboarding_steps') {
          return
        }
        form.setValue(key as keyof IPatientEdit, value as any)
      })
    }
  }, [patientData, form.setValue])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setAvatar(file as File)
  }

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData()

    if (
      avatar !== null &&
      typeof avatar !== 'string' &&
      avatar instanceof File
    ) {
      data.avatar = (avatar as File) || null
    }

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'address' && value !== null) {
        if (value) formData.append(key, value as any)
      }
    }

    if (data.address && Object.values(data.address).some((value) => value)) {
      formData.append('address.address_line_1', data.address.address_line_1)
      formData.append('address.address_line_2', data.address.address_line_2)
      formData.append('address.landmark', data.address.landmark)
      formData.append('address.city', data.address.city)
      formData.append('address.state', data.address.state)
      formData.append('address.pincode', data.address.pincode)
    }

    try {
      await EditPatient({ id: patientId, data: formData }).unwrap()
      toast.success('Patient updated successfully')
      navigate('/patients')
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
  })

  const bloodGroups = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
    { label: 'Unknown', value: 'Unknown' },
  ]

  const genders = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ]

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Patients', path: '/patients' },
    { label: 'Edit Patient' },
  ]

  if (isPatientloading) {
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
      <div className="bg-white rounded-lg p-5">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Edit patient</div>
          <Link className="p-1" to="/patients/">
            <Button variant="ghost">
              <IoIosArrowBack className="mt-0.5" />
              &nbsp; Back
            </Button>
          </Link>
        </div>
        <hr />
        <Form {...form}>
          <form className="container-fluid p-6" onSubmit={onSubmit}>
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
                    {patientImg && (
                      <a
                        href={patientData?.avatar as unknown as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs"
                      >
                        Image:
                        <span className="text-blue-500 underline hover:text-blue-300">
                          {patientImg}
                        </span>
                      </a>
                    )}
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
                          defaultValue={patientData?.full_name}
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
                          defaultValue={patientData?.phone}
                          {...field}
                          disabled
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
                          defaultValue={patientData?.email}
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
                              {genders.map((option) => (
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
                          defaultValue={patientData?.secondary_phone}
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
                              ? field.value.toISOString().split('T')[0]
                              : field.value
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
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
                          defaultValue={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  field?.value
                                    ? field.value
                                    : 'Select Blood Groups'
                                }
                              />
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
                            defaultValue={patientData?.address?.address_line_1}
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
                            defaultValue={patientData?.address?.address_line_2}
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
                            defaultValue={patientData?.address?.landmark}
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
                            defaultValue={patientData?.address?.city}
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
                          <FormLabel>Pincode</FormLabel>
                          <Input
                            type="text"
                            id="pincode"
                            placeholder="Enter pincode"
                            defaultValue={patientData?.address?.pincode}
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
            <Button
              type="submit"
              disabled={isUpadating}
              className="w-full mt-8"
            >
              Update Patient
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default EditPatientForm
