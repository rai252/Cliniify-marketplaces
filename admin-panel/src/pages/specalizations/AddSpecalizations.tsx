import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import Breadcrumbs from "@/components/Breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useAddSpecializationMutation } from "@/services/specalizations/specializations.service";

interface FormProps {}

const validationSchema = z.object({
  name: z.string().min(4),
});

export const SpecalizationForm: FC<FormProps> = () => {
  const navigate = useNavigate();
  const [addSpec, { isLoading }] = useAddSpecializationMutation();
  type SpecFormValues = z.infer<typeof validationSchema>;

  const form = useForm<SpecFormValues>({
    resolver: zodResolver(validationSchema) as any,
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let mergeData = { ...data };

      const form_Data: FormData = new FormData();

      for (const [key, value] of Object.entries(mergeData)) {
        form_Data.append(key, value as any);
      }

      try {
        await addSpec(form_Data).unwrap();

        toast.success("Specialization added successfully");
        navigate("/specalizations");
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
    { label: "Specializations", path: "/specalizations" },
    { label: "Add Specalization" },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Add Specialization</div>
          <Link className="p-1" to="/specalizations">
            <Button variant="ghost">
              <IoIosArrowBack className="mt-0.5" />
              &nbsp; Back
            </Button>
          </Link>
        </div>
        <hr />
        <Form {...form}>
          <form className="container-fluid p-6" onSubmit={onSubmit}>
            <div className="mb-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input
                        type="text"
                        id="name"
                        placeholder="Enter Specialization Name...."
                        {...field}
                      />
                      {form.formState.errors.name && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.name.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button className="w-full mt-8" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Specialization"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
