"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { doctorService } from "@/services/doctor.service";
import { IEducationSpecialization } from "@/types/doctor/doctor";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ISpecializationsResponse } from "@/types/specializations/specializations";
import { specializationsservice } from "@/services/specializations.service";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  degree: z.string({
    required_error: "Please enter degree.",
  }),
  institute_name: z.string({
    required_error: "Please enter institue name.",
  }),
  completion_year: z.string({
    required_error: "Please enter your completion year.",
  }),
  specializations: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .refine((data) => data.length > 0, {
      message: "Please select at least one specialization.",
    }),
});

export default function DoctorEducationPage({
  params,
}: {
  params: { id: number; slug: string };
}) {
  const { id, slug } = params;
  const router = useRouter();
  const [doctor, setDoctor] = useState<IEducationSpecialization | null>(null);
  const [specializations, setSpecializations] = useState<
    ISpecializationsResponse["results"] | null
  >(null);
  const [isToastVisible, setToastVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const completionYearRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorData = await doctorService.getDetailsEducation({
          id: slug,
        });
        setDoctor(doctorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDoctorData();
  }, [id]);

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      degree: "",
      institute_name: "",
      completion_year: "",
      specializations: [],
    },
  });

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const specializationsData =
          await specializationsservice.getSpecializations();
        setSpecializations(specializationsData.results);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    form.setValue("degree", doctor?.degree || "");
    form.setValue("institute_name", doctor?.institute_name || "");

    const completionYearValue =
      doctor?.completion_year !== undefined && doctor.completion_year !== null
        ? doctor.completion_year.toString()
        : "";

    form.setValue("completion_year", completionYearValue);

    if (specializations?.length && doctor?.specializations.length) {
      const specializationsArray = doctor?.specializations.map((spac) => ({
        value: spac.id,
        label: spac.name,
      }));

      form.setValue("specializations", specializationsArray);
    }
  }, [doctor, specializations]);

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSaving(true);
      const currentYear = new Date().getFullYear();
      if (Number(data.completion_year) > currentYear) {
        form.setError("completion_year", {
          message: "Completion year cannot be greater than the current year.",
        });
        completionYearRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
      const onbording_steps: any = doctor?.onboarding_steps;
      onbording_steps["edu_spec"] = true;

      const specializationIds = data.specializations.map((spec) => spec.value);

      const completionYear =
        typeof data.completion_year === "number"
          ? data.completion_year
          : parseInt(data.completion_year, 10);

      const res = await doctorService.updateEducation(
        { id: params.slug },
        {
          degree: data.degree,
          institute_name: data.institute_name,
          completion_year: completionYear,
          specializations: specializationIds as any,
          onboarding_steps: onbording_steps,
        }
      );

      router.push(`/doctors/${slug}/edit/registration-documents`);

      toast.success("Data updated successfully!");
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
      setIsSaving(false);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.exception
      ) {
        const errorMessage =
          error.response.data.exception.experience_years[0].message;
        toast.error(errorMessage);
      } else {
        toast.error(
          "The value provided for experience years does not seem accurate, as your level of experience appears to surpass the degree completion year."
        );
      }
      setIsSaving(false);

      setToastVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  const animatedComponents = makeAnimated();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="  text-2xl font-medium">Education</h3>
        <p className="  text-base text-muted-foreground">
          Update your education details.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Degree
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="  text-base"
                      placeholder="Your Degree"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institute_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Institute Name
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="  text-base"
                      placeholder="Enter institute name"
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
              name="completion_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Completion Year
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="  text-base"
                      placeholder="Enter your completion year"
                      {...field}
                      ref={completionYearRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="mt-20">
            <h3 className="  text-2xl font-medium">Specialization*</h3>
            <p className="  text-base text-muted-foreground">
              Select your Specialization.
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="specializations"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="  text-base">
                    Add Specialization
                    <span className="  text-lg font-bold text-red-500 p-0.5">
                      *
                    </span>
                  </FormLabel>
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    className="  text-lg"
                    options={
                      Array.isArray(specializations)
                        ? specializations.map((spec) => ({
                            value: spec.id,
                            label: spec.name,
                          }))
                        : []
                    }
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="  text-base" type="submit">
            {isSaving ? "Saving..." : "Save & Next"}
          </Button>
        </form>
      </Form>
      {isToastVisible && <Toaster position="top-right" />}
    </div>
  );
}
