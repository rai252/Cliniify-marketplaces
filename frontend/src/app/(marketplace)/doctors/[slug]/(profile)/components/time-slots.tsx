"use client";
import React, { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ITimeSlots, IDoctor } from "@/types/doctor/doctor";
import { IUser } from "@/types/user/user";
import { IEstablishment } from "@/types/establishment/establishment"; // Add this import
import dayjs from "dayjs";
import { doctorService } from "@/services/doctor.service";
import { userService } from "@/services/user.service";
import { establishmentService } from "@/services/establishment.service"; // Add this import
import { BusinessHours } from "@/components/TimingInput";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export default function AppointmentBooking() {
  const { slug } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [timeSlots, setTimeSlots] = useState<ITimeSlots | null>(null);
  const [establishments, setEstablishments] = useState<IEstablishment[]>([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [establishmentTimings, setEstablishmentTimings] = useState<{
    [key: string]: BusinessHours;
  }>({});
  const pathname = usePathname();

  useEffect(() => {
    const fetchDataAndRedirect = async () => {
      setLoading(true);
      try {
        const doctorData = await doctorService.getDoctorDetail({ id: slug });
        setDoctor(doctorData);

        const establishmentData = await Promise.all(
          doctorData.associated_establishment.map((est) =>
            establishmentService.getEstablishmentDetail({ id: est.id })
          )
        );
        setEstablishments(establishmentData);

        const timeSlotData = await doctorService.getTimeSlots({
          id: slug,
          date: currentDate.toISOString().split("T")[0],
        });
        if (timeSlotData["morning"]) {
          setTimeSlots(timeSlotData);
        }

        const userData = await userService.getcurrentUser({ id: slug });
        setUser(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAndRedirect();
  }, [slug, currentDate, selectedEstablishment]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setCurrentDate(selectedDate);
  };

  const handleTimeSlotSelect = (slot: string) => {
    if (!user?.patient_id) {
      const redirectUrl = `/login?next=${pathname}`;
      router.push(redirectUrl);
    } else {
      const appointmentUrl = `/patients/${
        user?.patient_id
      }/appointments/book/?d=${doctor?.id}&date=${formatDate(
        currentDate
      )}&timeSlot=${encodeURIComponent(slot)}&fee=${
        doctor?.fee
      }&est=${selectedEstablishment}`;
      router.push(appointmentUrl);
    }
  };

  const handleEstablishmentChange = async (value: string) => {
    setSelectedEstablishment(value);

    try {
      const timeSlotData: any = await doctorService.getTimeSlots({
        id: slug,
        date: currentDate.toISOString().split("T")[0],
        establishmentId: value,
      });
      setTimeSlots(timeSlotData[value]);
    } catch (error) {
      console.log(error);
      setTimeSlots(null);
    }
  };

  const renderTimeSlots = (
    slots: ITimeSlots | null,
    onSelect: (slot: string) => void
  ) => {
    if (
      !slots ||
      (!slots.morning?.length &&
        !slots.afternoon?.length &&
        !slots.evening?.length)
    ) {
      return (
        <p className="  text-base font-semibold text-red-500">
          No available time slots.
        </p>
      );
    }

    const isDoctor = user?.doctor_id !== undefined;

    const renderSlots = (timeSlotArray: string[], period: string) => (
      <div className="pb-2">
        <p className="  text-base font-semibold">{period}</p>
        <div className="grid grid-cols-4 gap-2 pt-2">
          {timeSlotArray.map((slot, index) => (
            <div
              key={index}
              onClick={() => !isDoctor && onSelect(slot)}
              className={`  ${
                !isDoctor
                  ? "bg-white-200 text-xs sm:text-sm hover:bg-teal-600 hover:text-white cursor-pointer rounded-md text-center"
                  : "bg-white-200 text-xs sm:text-sm text-center"
              } transition-colors duration-300 ease-in-out border border-gray-300 text-black p-2`}
              style={isDoctor ? { pointerEvents: "none" } : {}}
            >
              {dayjs(`2000-01-01 ${slot}`, "HH:mm").format("h:mm A")}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="text-gray-500">
        {slots.morning?.length > 0 && renderSlots(slots.morning, "Morning")}
        {slots.afternoon?.length > 0 &&
          renderSlots(slots.afternoon, "Afternoon")}
        {slots.evening?.length > 0 && renderSlots(slots.evening, "Evening")}
      </div>
    );
  };

  return (
    <div className="w-full h-full sm:w-1/3 mt-5 sm:ml-5 border rounded-md overflow-hidden">
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <h2 className="  text-base font-semibold mb-0">Book Appointment</h2>
        <p className="  text-base font-semibold text-teal-600 mb-0 sm:mb-2">
          ₹{doctor?.fee} Fees
        </p>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-gray-700 text-base font-semibold mb-2">
            Choose Establishment :
          </h2>
          <Select
            value={selectedEstablishment}
            onValueChange={handleEstablishmentChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Establishment" />
            </SelectTrigger>
            <SelectContent>
              {establishments.map((est) => (
                <SelectItem key={est.id} value={est.id.toString()}>
                  {est.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <h2 className="text-gray-700 text-base font-semibold mb-2">
            Choose Date :
          </h2>
          <Input
            type="date"
            className="  border p-2 w-full"
            value={currentDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            min={new Date().toJSON().slice(0, 10)}
          />
        </div>
        <div className="rounded-md">
          <h2 className="text-base text-gray-700 font-semibold mb-4 border-b">
            Please select a time slot that is available for you :
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {renderTimeSlots(timeSlots, handleTimeSlotSelect)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
