"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster, toast } from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/user";
import { IUser } from "@/types/user/user";
import { patientService } from "@/services/patient.service";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  deleting_reason: z
    .enum([
      "I have another account",
      "I don't find this useful",
      "Other reasons",
    ])
    .optional(),
});

export default function DeleteAccount({
  params: { patientid },
}: {
  params: { patientid: number };
}) {
  const router = useRouter();
  const { user } = useUserContext();
  const User: IUser = user as IUser;
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });
  const [isReasonSelected, setIsReasonSelected] = useState(false);
  const [isOtherReasonSelected, setIsOtherReasonSelected] = useState(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    try {
      await patientService.deletePatient({
        patientid,
        reason: data.deleting_reason,
      });
      toast.success("Account deleted successfully!");
      router.push(`/`);
    } catch (error) {
      toast.error("Account was not deleting! Please try again.");
    }
  };

  const handleRadioChange = (value: string) => {
    setIsReasonSelected(true);
    form.setValue("deleting_reason", value);

    if (value === "Other reasons") {
      setIsOtherReasonSelected(true);
    } else {
      setIsOtherReasonSelected(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-medium mb-3  ">Delete account</h3>
      <Separator />
      <p className="text-base mt-4  ">
        Are you sure? This will permanently delete your account.
      </p>
      <p className="text-base  ">
        Once the deletion process begins, you won&apos;t be able to reactivate
        your account or retrieve any data or information.
      </p>
      <Separator />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="  text-teal-700 text-xl">
            Delete my account
          </AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-5"
              >
                <FormField
                  control={form.control}
                  name="deleting_reason"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Reason for deletion</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            handleRadioChange(value);
                          }}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="I have another account" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              I have another account
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="I don't find this useful" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              I don&apos;t find this useful
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Other reasons" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Other reasons
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isOtherReasonSelected && (
                  <FormField
                    control={form.control}
                    name="other_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify your reason</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your reason"
                            {...field}
                            className="w-[500px]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" disabled={!isReasonSelected}>
                      Delete account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm account deletion</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Your account and all
                        associated data will be permanently deleted.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <DialogTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogTrigger>
                      <Button
                        variant="destructive"
                        onClick={form.handleSubmit(onSubmit)}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}