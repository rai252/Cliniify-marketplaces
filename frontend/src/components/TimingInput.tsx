import { useEffect, useState, FC, ChangeEvent } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoClose, IoAdd } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { MdOutlineEditNote } from "react-icons/md";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface BusinessHours {
  [day: string]: TimeSlot[];
}

interface BusinessHoursFormProps {
  onSave: (hours: BusinessHours) => void;
  timings: BusinessHours | "";
}

const BusinessHoursForm: FC<BusinessHoursFormProps> = ({ onSave, timings }) => {
  const initialBusinessHours: BusinessHours = {
    Monday: [{ start_time: " AM", end_time: " PM" }],
    Tuesday: [{ start_time: " AM", end_time: " PM" }],
    Wednesday: [{ start_time: " AM", end_time: " PM" }],
    Thursday: [{ start_time: " AM", end_time: " PM" }],
    Friday: [{ start_time: " AM", end_time: " PM" }],
    Saturday: [{ start_time: " AM", end_time: " PM" }],
    Sunday: [{ start_time: " AM", end_time: " PM" }],
  };

  const [businessHours, setBusinessHours] = useState<BusinessHours>(
    timings || initialBusinessHours
  );

  useEffect(() => {
    if (timings && JSON.stringify(timings) !== JSON.stringify(businessHours)) {
      setBusinessHours(timings || initialBusinessHours);
    }
  }, [timings]);

  useEffect(() => {
    onSave(businessHours);
  }, [businessHours]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    day: string,
    index: number,
    field: "start_time" | "end_time",
    inputType: "hour" | "minute" | "ampm"
  ) => {
    const updatedHours: BusinessHours = { ...businessHours };

    updatedHours[day] = updatedHours[day].map((hour, i) => {
      if (i === index) {
        const [timeWithoutAmPm, ampm] = hour[field].split(" ");
        const [hours, minutes] = timeWithoutAmPm.split(":");

        let updatedTime;
        if (inputType === "hour") {
          updatedTime = `${e.target.value.padStart(2, "0")}:${minutes} ${
            ampm || ""
          }`;
        } else if (inputType === "minute") {
          updatedTime = `${hours}:${e.target.value.padStart(2, "0")} ${
            ampm || ""
          }`;
        } else if (inputType === "ampm") {
          const [timeWithoutAmPm, ampm] = hour[field].split(" ");
          const [hours, minutes] = timeWithoutAmPm.split(":");
          updatedTime = `${hours}:${minutes} ${e.target.value}`;
        }

        const updatedHour = { ...hour, [field]: updatedTime };
        return updatedHour;
      } else {
        return hour;
      }
    });

    setBusinessHours(updatedHours);
  };

  const addTimeSlot = (day: string) => {
    const updatedHours: BusinessHours = { ...businessHours };
    updatedHours[day].push({ start_time: " AM", end_time: " PM" });
    setBusinessHours(updatedHours);
  };

  const removeTimeSlot = (day: string, index: number) => {
    const updatedHours: BusinessHours = { ...businessHours };
    updatedHours[day] = updatedHours[day].filter((_, i) => i !== index);
    setBusinessHours(updatedHours);
  };

  const toggleDay = (day: string) => {
    const updatedHours: BusinessHours = { ...businessHours };
    if (updatedHours[day].length === 0) {
      updatedHours[day].push({ start_time: "", end_time: "" });
    } else {
      updatedHours[day] = [];
    }
    setBusinessHours(updatedHours);
  };

  const copyTimeSlot = (day: string) => {
    const dayHours = businessHours[day];
    const updatedHours: BusinessHours = Object.fromEntries(
      Object.entries(businessHours).map(([key]) => [key, [...dayHours]])
    );
    setBusinessHours(updatedHours);
  };

  return (
    <>
      {Object.entries(businessHours).map(([day, hours]) => (
        <Card key={day} className="mb-4">
          <CardHeader>
            <div className="sm:flex sm:items-center">
              <label className="block mr-2">{day}</label>
              <input
                type="checkbox"
                checked={hours.length > 0}
                onChange={() => toggleDay(day)}
                className="mr-2"
              />
              <Badge
                className={
                  hours.length > 0
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }
              >
                {hours.length > 0 ? "Open" : "Closed"}
              </Badge>
            </div>
          </CardHeader>
          {hours.length > 0 && (
            <CardContent>
              {hours.map((timeSlot, slotIndex) => (
                <div
                  key={slotIndex}
                  className="flex flex-wrap items-center mb-2"
                >
                  <Input
                    type="number"
                    value={parseInt(timeSlot.start_time.split(":")[0])}
                    min="01"
                    max="12"
                    onChange={(e) =>
                      handleInputChange(e, day, slotIndex, "start_time", "hour")
                    }
                    className="form-input w-16 mr-2 px-2 py-1 border border-gray-300 rounded-l focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="mx-1 text-gray-500">:</span>
                  <Input
                    type="number"
                    value={parseInt(timeSlot.start_time.split(":")[1])}
                    min="00"
                    max="59"
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        day,
                        slotIndex,
                        "start_time",
                        "minute"
                      )
                    }
                    className="form-input w-16 mr-2 px-2 py-1 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="w-16">
                    <Select
                      value={timeSlot.start_time.includes("AM") ? "AM" : "PM"}
                      onValueChange={(value) =>
                        handleInputChange(
                          {
                            target: { value },
                          } as React.ChangeEvent<HTMLSelectElement>,
                          day,
                          slotIndex,
                          "start_time",
                          "ampm"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="mx-2 text-gray-500">to</span>
                  <Input
                    type="number"
                    value={parseInt(timeSlot.end_time.split(":")[0])}
                    min="1"
                    max="12"
                    onChange={(e) =>
                      handleInputChange(e, day, slotIndex, "end_time", "hour")
                    }
                    className="form-input w-16 mr-2 px-2 py-1 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="mx-1 text-gray-500">:</span>
                  <Input
                    type="number"
                    value={parseInt(timeSlot.end_time.split(":")[1])}
                    min="0"
                    max="59"
                    onChange={(e) =>
                      handleInputChange(e, day, slotIndex, "end_time", "minute")
                    }
                    className="form-input w-16 mr-2 px-2 py-1 border border-gray-300 rounded-r focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="w-16">
                    <Select
                      value={timeSlot.end_time.includes("AM") ? "AM" : "PM"}
                      onValueChange={(value) =>
                        handleInputChange(
                          {
                            target: { value },
                          } as React.ChangeEvent<HTMLSelectElement>,
                          day,
                          slotIndex,
                          "end_time",
                          "ampm"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeTimeSlot(day, slotIndex)}
                    className="text-red-500 px-2 py-1 rounded"
                  >
                    <IoClose className="text-lg" />
                  </Button>
                </div>
              ))}
              <div className="grid sm:flex grid-cols-1 gap-2 justify-start mt-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => addTimeSlot(day)}
                  className="flex bg-blue-500 text-white hover:text-black px-4 py-2 rounded"
                >
                  <IoAdd className="text-lg" />
                  <span>Add Time Slot</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => copyTimeSlot(day)}
                  className="flex bg-indigo-500 text-white hover:text-black px-4 py-2 rounded ml-2"
                >
                  <MdOutlineEditNote className="text-lg" />
                  <span>Copy to all other days</span>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </>
  );
};

export default BusinessHoursForm;
