import { useEffect, useState, FC, ChangeEvent } from "react";
import { BsCopy } from "react-icons/bs";
import { IoAdd, IoClose } from "react-icons/io5";

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

  const sortedBusinessHours = typeof timings === "object" ? sortBusinessHours(timings) : timings;

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
  }, [businessHours, openDays, onSave, establishmentId]);

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
        const [timeWithoutAmPm, ampm] = hour[field].split(' ');
        const [hours, minutes] = timeWithoutAmPm.split(':');

        let updatedTime;
        if (inputType === 'hour') {
          const paddedHour = e.target.value.padStart(2, '0');
          updatedTime = `${paddedHour}:${minutes} ${ampm || ''}`;
        } else if (inputType === 'minute') {
          const paddedMinute = e.target.value.padStart(2, '0');
          updatedTime = `${hours}:${paddedMinute} ${ampm || ''}`;
        } else if (inputType === 'ampm') {
          const newAmpm = e.target.value === 'AM' || e.target.value === 'PM' ? e.target.value : '';
          updatedTime = `${hours}:${minutes} ${newAmpm}`;
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

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {Object.entries(businessHours).map(([day, hours]) => (
          <div key={day} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-gray-800">{day}</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={openDays[day]}
                  onChange={() => toggleDay(day)}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
            </div>
            {openDays[day] && hours && (
              <div>
                {Array.isArray(hours) &&
                  hours.map((timeSlot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center mb-2">
                      <input
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
                      <input
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
                      <select
                        value={timeSlot.start_time.includes("AM") ? "AM" : "PM"}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            day,
                            slotIndex,
                            "start_time",
                            "ampm"
                          )
                        }
                        className="form-select w-20 mr-4 px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option selected value="--">
                          --
                        </option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                      <span className="mx-2 text-gray-500">to</span>
                      <input
                        type="number"
                        value={parseInt(timeSlot.end_time.split(":")[0])}
                        min="1"
                        max="12"
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            day,
                            slotIndex,
                            "end_time",
                            "hour"
                          )
                        }
                        className="form-input w-16 mr-2 px-2 py-1 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="mx-1 text-gray-500">:</span>
                      <input
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
                      <select
                        value={timeSlot.end_time.includes("AM") ? "AM" : "PM"}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            day,
                            slotIndex,
                            "end_time",
                            "ampm"
                          )
                        }
                        className="form-select w-20 mr-2 px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option selected disabled value="--">
                          --
                        </option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(day, slotIndex)}
                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                      >
                        <IoClose className="text-lg" />
                      </button>
                    </div>
                  ))}
                <div className="flex items-center mt-4">
                  <button
                    type="button"
                    onClick={() => addTimeSlot(day)}
                    className="flex items-center px-1 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Add Time Slot"
                  >
                    <IoAdd className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyTimeSlot(day)}
                    className="flex items-center px-1 py-1 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Copy Time Slot"
                  >
                    <BsCopy className="text-lg" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
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