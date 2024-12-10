import { BusinessHours } from "@/components/TimingInput";
import { format } from "date-fns";

export const convertTo12HourFormat = (time: string): string => {
  const [hourString, minuteString] = time.split(":");
  let hour = parseInt(hourString);
  const minute = parseInt(minuteString);

  const period = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  if (hour > 12) hour -= 12;

  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = minuteString.padStart(2, "0");
  return `${formattedHour}:${formattedMinute} ${period}`;
};

const convertTo24HourFormat = (time: string): string => {
  const [timeWithoutPeriod, period] = time.split(" ");
  const [hourString, minuteString] = timeWithoutPeriod.split(":");
  let hour = parseInt(hourString);
  const minute = parseInt(minuteString);

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = minute.toString().padStart(2, "0");
  return `${formattedHour}:${formattedMinute}`;
};

export const convert24HrToAmPm = (timings: BusinessHours): BusinessHours => {
  const converted: BusinessHours = {};

  for (const [day, timeSlots] of Object.entries(timings)) {
    converted[day] = (timeSlots as any).map(
      (timeSlot: { start_time: string; end_time: string }) => {
        const { start_time, end_time } = timeSlot;

        const convertTime = (time: string): string => {
          const [hours, minutes] = time.split(":");
          const hourInt = parseInt(hours, 10);
          const ampm = hourInt >= 12 ? "PM" : "AM";
          const hour = hourInt % 12 || 12;
          return `${hour.toString().padStart(2, "0")}:${minutes} ${ampm}`;
        };

        return {
          start_time: convertTime(start_time),
          end_time: convertTime(end_time),
        };
      }
    );
  }

  return converted;
};

const convertTimeToTwentyFourHourFormat = (timeString: string): string => {
  // const [_, _] = timeString.split(':');
  const date = new Date(`2000-01-01 ${timeString}`);
  return format(date, "HH:mm");
};

export const convertTimingsToTwentyFourHourFormat = (
  timings: BusinessHours
): BusinessHours => {
  const convertedTimings: BusinessHours = {};

  for (const day in timings) {
    const dayHours = timings[day];
    if (Array.isArray(dayHours)) {
      convertedTimings[day] = dayHours
        .filter(
          (hour: { start_time: string; end_time: string }) =>
            hour.start_time !== "" && hour.end_time !== ""
        )
        .map((hour) => ({
          start_time: convertTimeToTwentyFourHourFormat(hour.start_time),
          end_time: convertTimeToTwentyFourHourFormat(hour.end_time),
        }));
    }
  }

  return convertedTimings;
};
