import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { FaPhone, FaUser } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";

// Define the schema for form validation
const formSchema = z.object({
  full_name: z.string().min(2, { message: "Full Name is required." }),
  phone: z
    .string()
    .length(10, { message: "Mobile number must be 10 digits long." })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits." }),
  register_type: z.enum(["patient", "doctor"]),
  terms_and_privacy: z.boolean().refine((v) => v === true, {
    message: "You must agree to the terms and privacy policy.",
  }),
});

// Define prop types for the RegistrationForm
interface RegistrationFormProps {
  setIsDoctorRegistration: React.Dispatch<React.SetStateAction<boolean>>;
}

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
        className={`w-full px-4 py-3 pt-5 pb-2 text-base text-sm border rounded-lg transition-all duration-200 ${
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

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  setIsDoctorRegistration,
}) => {
  const [registerType, setRegisterType] = useState<"patient" | "doctor">(
    "patient"
  );
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      register_type: "patient",
      terms_and_privacy: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSaving(true);
    try {
      const resData = await authService.register(data);
      toast.success(resData?.message || "Registration successful!");
      form.reset();
    } catch (error: any) {
      if (error?.phone) {
        form.setError("phone", { message: error.phone });
      } else {
        toast.error(error?.detail || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  });

  const handleTypeChange = (type: "patient" | "doctor") => {
    setRegisterType(type);
    form.setValue("register_type", type);
    setIsDoctorRegistration(type === "doctor");
  };

  return (
    <div className="w-full font-Inter max-w-md mx-auto rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-gray-700 font-semibold">
          {registerType === "patient" ? "Patient Register" : "Doctor Register"}
        </h2>
        <button
          type="button"
          onClick={() =>
            handleTypeChange(registerType === "doctor" ? "patient" : "doctor")
          }
          className="text-teal-500 hover:text-teal-600 text-sm font-medium"
        >
          {registerType === "doctor" ? "Not a Doctor?" : "Are you a Doctor?"}
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="full_name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    label="Full Name"
                    icon={<FaUser />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Phone */}
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
          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="terms_and_privacy"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-3">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="mt-[-18px]"
                    />
                  </FormControl>
                  <label className="text-sm text-gray-800">
                    By registering, you agree to our{" "}
                    <Link href="/terms" className="text-teal-600 underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-teal-600 underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit */}
          <Button type="submit" className="w-full">
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
