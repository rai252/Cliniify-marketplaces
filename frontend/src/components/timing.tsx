import { useEffect, useState, FC, ChangeEvent } from "react";
import { FaCopy, FaTrash, FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface BusinessHours {
  [day: string]: TimeSlot[];
}

interface BusinessHoursFormProps {
  onSave: (hours: BusinessHours, establishmentId: string) => void;
  timings: BusinessHours | "";
  establishmentId: string;
}

const BusinessHoursForm: FC<BusinessHoursFormProps> = ({
  onSave,
  timings,
  establishmentId,
}) => {
  const initialBusinessHours: BusinessHours = {
    Monday: [{ start_time: " AM", end_time: " PM" }],
    Tuesday: [{ start_time: " AM", end_time: " PM" }],
    Wednesday: [{ start_time: " AM", end_time: " PM" }],
    Thursday: [{ start_time: " AM", end_time: " PM" }],
    Friday: [{ start_time: " AM", end_time: " PM" }],
    Saturday: [{ start_time: " AM", end_time: " PM" }],
    Sunday: [{ start_time: " AM", end_time: " PM" }],
  };

  const sortedBusinessHours =
    typeof timings === "object" ? sortBusinessHours(timings) : timings;

  const [businessHours, setBusinessHours] = useState<BusinessHours>(
    sortedBusinessHours || initialBusinessHours
  );

  const [openDays, setOpenDays] = useState<{ [day: string]: boolean }>(
    getOpenDays(timings)
  );

  useEffect(() => {
    const updatedBusinessHours = { ...businessHours };
    Object.keys(updatedBusinessHours).forEach((day) => {
      if (!openDays[day]) {
        updatedBusinessHours[day] = [];
      }
    });
    onSave(updatedBusinessHours, establishmentId);
  }, [businessHours, openDays]);

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
          const paddedHour = e.target.value.padStart(2, "0");
          updatedTime = `${paddedHour}:${minutes} ${ampm || ""}`;
        } else if (inputType === "minute") {
          const paddedMinute = e.target.value.padStart(2, "0");
          updatedTime = `${hours}:${paddedMinute} ${ampm || ""}`;
        } else if (inputType === "ampm") {
          const newAmpm =
            e.target.value === "AM" || e.target.value === "PM"
              ? e.target.value
              : "";
          updatedTime = `${hours}:${minutes} ${newAmpm}`;
        }

        const updatedHour = { ...hour, [field]: updatedTime };
        return updatedHour;
      } else {
        return hour;
      }
    });

    setBusinessHours(updatedHours);
    onSave(updatedHours, establishmentId);
  };

  const addTimeSlot = (day: string) => {
    const updatedHours: BusinessHours = JSON.parse(
      JSON.stringify(businessHours)
    );

    if (!updatedHours[day]) {
      updatedHours[day] = [];
    }

    updatedHours[day].push({ start_time: " AM", end_time: " PM" });
    setBusinessHours(updatedHours);
  };

  const removeTimeSlot = (day: string, index: number) => {
    const newTimeSlot = businessHours[day].filter((_, indx) => indx !== index);
    setBusinessHours({ ...businessHours, [day]: newTimeSlot });
  };

  const toggleDay = (day: string) => {
    setOpenDays({ ...openDays, [day]: !openDays[day] });
    if (openDays[day]) {
      setBusinessHours({ ...businessHours, [day]: [] });
    }
  };

  const copyTimeSlot = (day: string) => {
    const updatedHours: BusinessHours = JSON.parse(
      JSON.stringify(businessHours)
    );
    for (const key in updatedHours) updatedHours[key] = updatedHours[day];
    setBusinessHours(updatedHours);

    const newopenDays = openDays;
    for (const key in newopenDays) newopenDays[key] = true;
    setOpenDays(newopenDays);
  };

  const weekdaysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <>
      {Object.entries(businessHours)
        .sort(
          ([dayA], [dayB]) =>
            weekdaysOrder.indexOf(dayA) - weekdaysOrder.indexOf(dayB)
        )
        .map(([day, hours]) => (
          <Card key={day} className="mb-4">
            <CardHeader>
              <div className="flex items-center">
                <label className="block mr-2">{day}</label>
                <input
                  type="checkbox"
                  checked={openDays[day]}
                  onChange={() => toggleDay(day)}
                  className="mr-2"
                />
              </div>
            </CardHeader>
            {openDays[day] && hours && (
              <CardContent>
                {hours.map((timeSlot: any, slotIndex: number) => (
                  <div
                    key={slotIndex}
                    className="flex flex-wrap items-center mb-2"
                  >
                    <Input
                      type="number"
                      value={parseInt(timeSlot.start_time.split(":")[0])}
                      min="1"
                      max="12"
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          day,
                          slotIndex,
                          "start_time",
                          "hour"
                        )
                      }
                      className="form-input w-16 mr-2 px-2 py-1 border border-gray-300 rounded-l focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <span className="mx-1 text-gray-500">:</span>
                    <Input
                      type="number"
                      value={parseInt(timeSlot.start_time.split(":")[1])}
                      min="0"
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
                        handleInputChange(
                          e,
                          day,
                          slotIndex,
                          "end_time",
                          "minute"
                        )
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
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(day, slotIndex)}
                      className="text-gray-500 hover:text-red-500 focus:outline-none ml-2"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => addTimeSlot(day)}
                  className="bg-teal-600 hover:bg-teal-500 hover:text-white text-white px-4 py-2 rounded mr-3"
                >
                  <FaPlus />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => copyTimeSlot(day)}
                  className="bg-blue-600 hover:bg-blue-500 hover:text-white text-white px-4 py-2 rounded ml-auto"
                >
                  <FaCopy />
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
    </>
  );
};

export default BusinessHoursForm;

const sortBusinessHours = (timings: BusinessHours): BusinessHours => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedTimings = Object.fromEntries(
    Object.entries(timings).sort(
      ([day1], [day2]) => daysOfWeek.indexOf(day1) - daysOfWeek.indexOf(day2)
    )
  );

  return sortedTimings;
};

const getOpenDays = (
  timings: BusinessHours | ""
): { [day: string]: boolean } => {
  const defaultOpenDays: { [day: string]: boolean } = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };

  if (timings && typeof timings === "object") {
    Object.keys(timings).forEach((day) => {
      if (timings[day].length > 0) {
        defaultOpenDays[day] = true;
      }
    });
  }

  return defaultOpenDays;
};
