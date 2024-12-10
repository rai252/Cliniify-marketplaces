"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { FaPhone } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

// Define the schema for form validation
const formSchema = z.object({
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .length(10, { message: "Mobile number must be exactly 10 digits." })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits." }),
});

type FormData = z.infer<typeof formSchema>;

// FloatingLabelInput Component for consistent input styling
const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    icon?: React.ReactNode;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, icon, error, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        className={`w-full px-4 py-3 pt-5 pb-2 text-base border rounded-lg transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-teal-500"
        } focus:outline-none focus:ring-2 focus:border-transparent peer placeholder-transparent`}
        placeholder={label}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFocused || props.value
            ? "top-2 text-xs text-gray-500"
            : "top-1/2 -translate-y-1/2 text-gray-400"
        }`}
      >
        {label}
      </label>
      {icon && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-300">
          {icon}
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";

// Main SendOtp Component
const SendOtp = () => {
  const [isSaving, setIsSaving] = useState(false);
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsSaving(true);
      await authService.sendOtp({ phone: data.phone });
      toast.success("An OTP has been sent to your mobile number.");
      searchParams.set("phone", data.phone);
      router.push(`/login?${searchParams.toString()}`);
    } catch (error: any) {
      if (error?.detail) {
        toast.error(error?.detail);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <div className="w-full font-Inter max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    label="Mobile Number"
                    type="text"
                    icon={<FaPhone />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="font-Inter text-base text-sm w-full mt-5 rounded-lg"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 text-sm animate-spin" />
            ) : (
              "Get OTP"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SendOtp;
