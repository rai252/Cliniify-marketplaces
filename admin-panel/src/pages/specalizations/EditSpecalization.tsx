import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import Breadcrumbs from "@/components/Breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  useEditSpecializationMutation,
  useGetSpecializationQuery,
} from "@/services/specalizations/specializations.service";

interface FormProps {}

const validationSchema = z.object({
  name: z.string().min(4),
});

export const EditspecalizationsForm: FC<FormProps> = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [updateSpec, { isLoading }] = useEditSpecializationMutation();

  const { data: specData, isLoading: isSpecLoading } =
    useGetSpecializationQuery(id);

  useEffect(() => {
    if (!isSpecLoading) {
      form.reset({
        name: specData?.name,
      });
    }
  }, [specData, isSpecLoading]);

  type SpecFormValues = z.infer<typeof validationSchema> & {
    image: File | null;
  };
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
        await updateSpec({ id, data: form_Data }).unwrap();

        toast.success("Specialization updated successfully");
        navigate("/specalizations");
      } catch (error: any) {
        toast.error("An unexpected error occurred while updating blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Specializations", path: "/specalizations" },
    { label: "Edit Specialization" },
  ];

  if (isSpecLoading) {
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
          <div className="text-xl font-bold">Edit Specialization</div>
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
                        placeholder="Enter specializations name..."
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
              {isLoading ? "Saving..." : "Update Specialization"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
