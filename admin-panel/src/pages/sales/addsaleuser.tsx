import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
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
import { useAddSaleUserMutation } from "@/services/sales/sale.service";

interface SaleFormProps {}

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('password'), undefined], 'Confirm passwords does not match with password')
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

const SaleForm: FC<SaleFormProps> = () => {
  const form = useForm<ISaleUsers>({
    resolver: yupResolver(validationSchema) as any,
  });
  const navigate = useNavigate();
  const [addUser, { isLoading }] = useAddSaleUserMutation();


  const onSubmit = form.handleSubmit(async (data) => {
    data.email = data.email.toLowerCase();
    data.is_sale = true;
    try {
        const sale_data = {
            email: data.email,
            password: data.password,
            is_sale: data.is_sale,
            is_active: data.is_active
        }
      try {
        await addUser(sale_data).unwrap();

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
    { label: "Add Sale Users" },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Add Sale User</div>
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

export default SaleForm;
