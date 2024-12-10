"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { any, number, z } from "zod";
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
import { Toaster, toast } from "react-hot-toast";
import { userService } from "@/services/user.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserContext } from "@/context/user";
import { IUser } from "@/types/user/user";

const passwordFormSchema = z.object({
  new_password: z.string().min(8, {
    message: "New password required.",
  }),
  confirm_password: z.string().min(8, {
    message: "confirm password required.",
  }),
});

export default function ChangePassword() {
  const [isToastVisible, setToastVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useUserContext();
  const User: IUser = user as IUser;

  console.log(user);

  type ProfileFormValues = z.infer<typeof passwordFormSchema> & {};

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsSaving(true);
      const res = await userService.changePassword(User?.id, {
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });

      toast.success("Password changed successfully!");
      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
      setIsSaving(false);
    } catch (error) {
      console.log("error:", form.formState.errors);

      setIsSaving(false);
      toast.error("Failed to update data. Please try again.");
      setToastVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="  text-2xl font-medium">Change Password</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="  text-base">New Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="focus-visible:ring-teal-500 w-96"
                    style={{
                      fontSize:
                        field.value && field.value.includes("*")
                          ? "1.25rem"
                          : "1rem",
                    }}
                    {...field}
                    minLength={8}
                  />
                </FormControl>
                <div
                  className="absolute top-2 right-3 mt-7 cursor-pointer text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="  text-base">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="focus-visible:ring-teal-500 w-96"
                    style={{
                      fontSize:
                        field.value && field.value.includes("*")
                          ? "1.25rem"
                          : "1rem",
                    }}
                    {...field}
                    minLength={8}
                  />
                </FormControl>
                <div
                  className="absolute top-2 right-3 mt-7 cursor-pointer text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="  text-base" type="submit">
            {isSaving ? "Saving..." : "Submit"}
          </Button>
        </form>
      </Form>
      {isToastVisible && <Toaster position="top-right" />}
    </div>
  );
}
