import { IAddress } from "./establishments.interface";

export interface IPatient {
  id: number;
  full_name: string;
  slug: string;
  avatar?: File | string;
  phone?: string;
  email: string;
  gender: string;
  secondary_phone?: string;
  date_of_birth?: Date;
  age?: number;
  blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  address?: IAddress;
}

export interface IPatientAdd {
  full_name: string;
  avatar?: File | string;
  phone?: string;
  email: string;
  password: string;
  gender: string;
  secondary_phone?: string;
  date_of_birth?: Date;
  blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  address?: IAddress;
}

export interface IPatientEdit {
  full_name: string;
  avatar?: File | string;
  phone?: string;
  email: string;
  gender: string;
  secondary_phone?: string;
  date_of_birth?: Date;
  blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  address?: IAddress;
}

export interface IPatientCount {
  total_patients_count: number;
  change_type: "increment" | "decrement";
  change_from_last_month: number;
  percentage_change: number;
}
