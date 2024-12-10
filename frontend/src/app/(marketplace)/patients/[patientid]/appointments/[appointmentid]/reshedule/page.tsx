"use client";
import React, { useState, useEffect } from "react";
import { IAppointmentDetail } from "@/types/appointment/appointment";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { IDoctor } from "@/types/doctor/doctor";
import { ITimeSlots } from "@/types/doctor/doctor";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

export default function AppointmentDetail({
  params,
}: {
  params: { appointmentid: number };
}) {
  const appointmentid = params?.appointmentid;
  const router = useRouter();
  const [appointmentData, setAppointmentData] =
    useState<IAppointmentDetail | null>(null);
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [Resechduledreason, setResechduledreason] = useState<
    string | undefined
  >(undefined);
  const [timeSlots, setTimeSlots] = useState<ITimeSlots | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const appointmentData = await appointmentService.getAppointmentDetail({
          appointmentid,
          expand: "doctor",
        });

        if (appointmentData && appointmentData.doctor) {
          const { doctor } = appointmentData;
          const currentDate = new Date();
          const timeSlotsData: ITimeSlots = await doctorService.getTimeSlots({
            id: doctor.id,
            currentDate: currentDate.toISOString().split("T")[0],
          });

          setTimeSlots(timeSlotsData);

          setAppointmentData(appointmentData);
          setDoctor(doctor);
        } else {
          console.error(
            "Doctor information not found in the appointment data."
          );
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchAppointmentData();
  }, [appointmentid, currentDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setCurrentDate(selectedDate);
  };

  const handleTimeSlotSelect = (selectedTimeSlot: string) => {
    setSelectedTimeSlot(selectedTimeSlot);
  };

  const handleSubmit = async () => {
    try {
      if (appointmentData && selectedTimeSlot) {
        const updatePayload = {
          id: appointmentData.id,
          doctor: doctor?.id,
          date: currentDate.toISOString().split("T")[0],
          start_time: selectedTimeSlot,
          is_rescheduled: true,
          reschedule_reason: Resechduledreason,
        };

        await appointmentService.rescheduleAppointment(
          appointmentid,
          updatePayload
        );

        router.back();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const renderTimeSlots = (
    slots: string[] | undefined,
    onSelect: (slot: string) => void
  ) => {
    if (!slots || slots.length === 0) {
      return (
        <p className="text-base font-semibold text-red-500">
          No available time slots.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-5 gap-2 pt-2 text-center">
        {slots.map((slot, index) => (
          <div
            key={index}
            onClick={() => onSelect(slot)}
            className={`  text-sm transition-colors duration-300 ease-in-out border border-gray-300 text-black p-2 rounded-md ${
              selectedTimeSlot === slot
                ? "bg-teal-700 text-white"
                : "bg-white-200 hover:bg-teal-600 hover:text-white cursor-pointer"
            }`}
          >
            {dayjs(`2000-01-01 ${slot}`, "HH:mm").format("h:mm A")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="main-section bg-slate-50 min-h-screen flex flex-col justify-between">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-10 sm:py-10 lg:py-10"></div>
        </div>
      </div>
      <div className="reshedule-container mt-10 flex-grow">
        <div className="container sm:w-1/3 border rounded-md p-6 bg-white">
          <div className="p-4 flex justify-between items-center bg-slate-100">
            <h2 className="text-base font-semibold">Reshedule Appointment</h2>
            <p className="text-base font-semibold text-teal-600 mt-2 sm:mb-2">
              ₹{doctor?.fee} Fees
            </p>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold mb-2">Choose Date :</h2>
              <input
                type="date"
                className="  border p-2 w-full"
                value={currentDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                min={new Date().toJSON().slice(0, 10)}
              />
            </div>
            <div className="rounded-md">
              <h2 className="text-base font-semibold mb-4 border-b">
                Available Time Slots :
              </h2>
              <div className="flex flex-col space-y-4">
                {!timeSlots ||
                (!timeSlots.morning &&
                  !timeSlots.afternoon &&
                  !timeSlots.evening) ? (
                  <p className="text-base font-semibold text-red-500">
                    No available time slots.
                  </p>
                ) : (
                  <>
                    {timeSlots.morning && (
                      <div className="pb-2">
                        <p className="text-gray-500 text-sm font-semibold">
                          Morning
                        </p>
                        {renderTimeSlots(
                          timeSlots.morning,
                          handleTimeSlotSelect
                        )}
                      </div>
                    )}
                    {timeSlots.afternoon && (
                      <div className="pb-2">
                        <p className="text-gray-500 text-sm font-semibold">
                          Afternoon
                        </p>
                        {renderTimeSlots(
                          timeSlots.afternoon,
                          handleTimeSlotSelect
                        )}
                      </div>
                    )}
                    {timeSlots.evening && (
                      <div className="pb-2">
                        <p className="text-gray-500 text-sm font-semibold">
                          Evening
                        </p>
                        {renderTimeSlots(
                          timeSlots.evening,
                          handleTimeSlotSelect
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              <Label
                className="  text-base"
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                Reason for reshedule?
              </Label>
              <Textarea
                value={Resechduledreason}
                className=" "
                onChange={(e) => setResechduledreason(e.target.value)}
                placeholder="Enter your reshedule reason here..."
                style={{
                  width: "100%",
                  height: "100px",
                  margin: "10px 0",
                  padding: "10px",
                  fontSize: "0.9em",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />

              <Button
                className="w-full   text-base bg-teal-700 hover:bg-teal-600"
                style={{ marginTop: "20px" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
