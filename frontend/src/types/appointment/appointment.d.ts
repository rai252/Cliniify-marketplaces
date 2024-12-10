import { IDoctor } from "../doctor/doctor";
import { IPatient } from "../patient/patient";

export interface IAppointment {
  doctor: number;
  patient: number;
  date: string;
  start_time: string;
  message: string;
}

export interface IAppointmentList {
  count: number;
  next: string | null;
  previous: string | null;
  loading?: boolean;
  results: {
    id: number;
    doctor: IDoctor;
    patient: IPatient;
    date: string;
    start_time: string;
    end_time: string;
    status:
      | "pending"
      | "confirmed"
      | "rejected"
      | "rescheduled"
      | "cancelled"
      | "completed";
    message: string;
  }[];
}

export interface IAppointmentDetail {
  id: number;
  doctor: IDoctor;
  patient: IPatient;
  date: string;
  start_time: string;
  end_time: string;
  status:
    | "pending"
    | "confirmed"
    | "rejected"
    | "rescheduled"
    | "cancelled"
    | "completed";
  message: string;
}

interface IAppointmentUpdate extends Partial<IAppointmentDetail> {
  id: number;
  doctor: number | undefined;
  date?: string;
  start_time?: string;
  is_rescheduled: boolean;
  reschedule_reason?: string | "";
}
