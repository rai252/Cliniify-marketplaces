"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { userService } from "@/services/user.service";
import { useUserContext } from "@/context/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const formSchema = z.object({
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be 6 digits"),
});
type FormData = z.infer<typeof formSchema>;

const VerifyOtp = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [countdown, setCountdown] = useState(120);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });
  const router = useRouter();
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params);
  const phone = params.get("phone") as string;
  const next = params.get("next");
  const { setUser } = useUserContext();

  const otp = form.watch("otp");

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        setIsSaving(true);
        await authService.login({
          phone: phone,
          otp: data.otp,
          login_type: "CM",
        });
        const userData = await userService.getcurrentUser();
        setUser(userData);

        if (next) {
          toast.success("Login successfully!");
          router.push(next);
          return;
        }

        if (userData.doctor_id) {
          toast.success("Doctor login successfully!");
          router.push(
            `/doctors/${userData.doctor_id}/edit/personal-contact-details/`
          );
        } else {
          toast.success("Patient login successfully!");
          router.push(`/`);
        }
      } catch (error: any) {
        if (error?.detail) {
          toast.error(error?.detail);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } finally {
        setIsSaving(false);
      }
    },
    [next, phone, router, setUser]
  );

  const resendOTP = async () => {
    try {
      await authService.sendOtp({ phone });
      toast.success("A new OTP has been sent to your phone number.");
      setIsResendDisabled(true);
      setIsCountdownActive(true);
      setCountdown(120);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let intervalId = null;

    if (isCountdownActive) {
      intervalId = setInterval(() => {
        setCountdown((currentCountdown) => {
          if (currentCountdown <= 1) {
            setIsCountdownActive(false);
            setIsResendDisabled(false);
            return 0;
          } else {
            return currentCountdown - 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCountdownActive]);

  useEffect(() => {
    if (otp && otp.length === 6) {
      onSubmit({ otp });
    }
  }, [onSubmit, otp]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4 text-sm ml-10">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    render={({ slots }) => (
                      <InputOTPGroup className="gap-5">
                        {slots.map((slot, index) => (
                          <React.Fragment key={index}>
                            <InputOTPSlot
                              className="rounded-md border"
                              {...slot}
                            />
                          </React.Fragment>
                        ))}{" "}
                      </InputOTPGroup>
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 text-teal-600 text-sm flex justify-between items-center">
          <div className="text-teal-600">
            <span
              onClick={!isResendDisabled ? resendOTP : undefined}
              className={`font-Inter text-sm cursor-pointer  ${
                isResendDisabled
                  ? "text-gray-500"
                  : "text-teal-600 hover:text-teal-500 font-medium"
              }`}
            >
              {isResendDisabled ? (
                <>
                  Resend OTP in{" "}
                  <span className="font-Inter text-teal-700 font-medium">
                    {formatCountdown(countdown)}
                  </span>
                </>
              ) : (
                "Resend OTP?"
              )}
            </span>
          </div>
          <button
            onClick={() => {
              searchParams.delete("phone");
              router.push(`/login?${searchParams.toString()}`);
            }}
            className="text-sm font-medium  hover:underline cursor-pointer"
          >
            Change Mobile No.
          </button>
        </div>
        <Button type="submit" className="w-full mt-5">
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Verify OTP & Login"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default VerifyOtp;
