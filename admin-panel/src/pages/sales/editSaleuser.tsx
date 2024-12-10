import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumb";
import { toast } from "react-toastify";
import { ISaleUsers } from "@/interfaces/sale.interface";
import { useEditSaleUserMutation, useGetSaleUserByIdQuery } from "@/services/sales/sale.service";

interface SaleFormProps {}

interface SaleData {
  email: string;
  is_sale: boolean;
  is_active: boolean;
  password?: string;
}

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters"),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('password'), undefined], 'Confirm passwords does not match with password')
        .min(8, "Password must be at least 8 characters")
});

const EditSaleForm: FC<SaleFormProps> = () => {
  const { id = "" } = useParams();
  const form = useForm<ISaleUsers>({
    resolver: yupResolver(validationSchema) as any,
  });
  const navigate = useNavigate();
  const [EditUser, { isLoading }] = useEditSaleUserMutation();
  const { data: userData, isLoading: isSaleUserLoading, isError: isSaleError } = useGetSaleUserByIdQuery(id);

  useEffect(() => {
    if(!isSaleUserLoading){
        form.reset({
            email: userData?.email,
            is_active: userData?.is_active,
        })
    }
  }, [userData, isSaleUserLoading])

  const onSubmit = form.handleSubmit(async (data) => {
    data.email = data.email.toLowerCase();
    data.is_sale = true;
    let sale_data: SaleData = {
      email: '',
      is_sale: false,
      is_active: false,
    };

    try {
      if (data.password) {
        if (!data.confirm_password) {
          toast.error("Please confirm your password before submitting.");
          form.setFocus("confirm_password");
          return;
        }
  
        if (data.password !== data.confirm_password) {
          toast.error("Passwords do not match. Please re-enter your passwords.");
          form.setError("password", { message: "Passwords do not match." });
          form.setError("confirm_password", { message: "Passwords do not match." });
          form.setFocus("password");
          return;
        }
      }
  
      sale_data = {
        email: data.email as string,
        is_sale: data.is_sale as boolean,
        is_active: data.is_active as boolean,
      };
  
      if (data.password) {
        sale_data.password = data.password;
      }
  
      try {
        await EditUser({ id: id, data: sale_data }).unwrap();
        toast.success("User Added successfully");
        navigate("/sales-user/");
      } catch (error: any) {
        if (error && error.data) {
          const errorData = error.data;
          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              const errorMessages = errorData[field];
              console.log(errorMessages);
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
      console.error("Error updating doctor:", error);
    }
  });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Sale Users", path: "/sales-user" },
    { label: "Edit Sale Users" },
  ];

  if (isSaleUserLoading) {
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

  if (isSaleError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 mx-auto text-red-500 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Oops! Data Fetch Failed
            </h1>
            <p className="text-gray-600">
              We couldn't retrieve your sales user data. This is likely a
              temporary issue.
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 text-sm text-red-700 flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error: Unable to fetch sales user data from the server.</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Try these steps to resolve the issue:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 pl-5 list-disc">
              <li>Check your internet connection</li>
              <li>Refresh the page</li>
              <li>Clear your browser cache</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Edit Sale User</div>
          <Link className="p-1" to="/sales-user/">
            <Button variant="ghost">
              <IoIosArrowBack className="mt-0.5" />
              &nbsp; Back
            </Button>
          </Link>
        </div>
        <hr />
        <Form {...form}>
          <form className="container-fluid p-6" onSubmit={onSubmit}>
            {/* User Details */}
            <div className="mb-2">
              <div className="text-lg font-bold mb-2">User Details</div>
              <div className="grid grid-cols-2 gap-4">
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
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <Input
                        type="password"
                        id="confirm_password"
                        placeholder="Enter confirm password"
                        {...field}
                      />
                      {form.formState.errors.confirm_password && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.confirm_password.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_active"
                  render={() => (
                    <FormItem className="mt-8">
                      <input    
                        type="checkbox"
                        {...form.register("is_active")}
                        className="px-2.5 py-1 mr-1"
                      />
                      &nbsp;
                      {form.watch("is_active") ? (
                        <Badge className="p-1 rounded-md bg-green-600 hover:bg-green-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="p-1 rounded-md bg-red-600 hover:bg-red-600">
                          Not Active
                        </Badge>
                      )}
                      {form.formState.errors.is_active && (
                        <span className="text-red-400 text-xs">
                          {form.formState.errors.is_active.message}
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
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditSaleForm;
