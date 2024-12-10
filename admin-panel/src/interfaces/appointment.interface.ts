export interface IAppointmentCount {
  total_appointment_count: number;
  change_type: "increment" | "decrement";
  change_from_last_month: number;
  percentage_change: number;
}
