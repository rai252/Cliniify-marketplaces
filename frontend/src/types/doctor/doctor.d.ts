import { TimeSlot } from "@/components/TimingInput";
import { IAddress } from "../establishment/establishment";
import { ISpecializations } from "../specializations/specializations";
import { IUser } from "../user/user";
import { IEstablishment } from "@/types/establishment/establishment";

export interface IDoctor {
  id: number;
  slug: string;
  user: IUser;
  full_name: string;
  phone: number;
  avatar: string | File | null | StaticImport;
  specializations: ISpecializations[];
  bio: string;
  email: string;
  gender: "M" | "F" | string;
  reg_no: number;
  reg_council: number;
  reg_year: number;
  degree: string;
  institute_name: string;
  completion_year: number;
  experience_years: string;
  own_establishment: true;
  identity_proof: string;
  medical_reg_proof: string;
  establishment_proof: string;
  address: IAddress;
  fee: number;
  is_verified: "true" | "false" | string;
  timings: { [day: string]: TimeSlot[] | "closed" };
  time_duration: "00:10" | "00:15" | "00:20" | "00:30" | "00:45" | "01:00";
  average_rating: number;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
  profile_completion_percentage: number;
  owned_establishment: number;
  relations: IRelations[];
  associated_establishment: IEstablishment[];
}

export interface IRelations {
  doctor_id: number;
  establishment_id: number;
  timings: string[];
  fee: string | number;
  time_duration: string;
}

export interface IDoctorList {
  count: number;
  next: null;
  preview: null;
  results: IDoctor[];
}

export interface IGetResult {
  id: number;
  doctor: number;
  establishment: number;
  is_approved: boolean;
  approved_at: string;
  requested_at: string;
  is_rejected: boolean;
  rejected_at: string;
}

export interface ITimeSlots {
  morning: string[];
  afternoon: string[];
  evening: string[];
}

export interface IOnboardingProfile {
  full_name: string;
  phone: string | number;
  email: string;
  avatar: string | File | null;
  gender: "M" | "F" | "O" | string;
  bio: string;
  experience_years: string | number;
  address: IAddress;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
}

export interface IDoctorProfile {
  full_name: string;
  phone: string | number;
  email: string;
  avatar: string | File | null;
  gender: "M" | "F" | "O" | string;
  bio: string;
  experience_years: string | number;
  address: IAddress;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
  clinic_no?: string | number;
  alternative_number?: string | number;
}

export interface IOnboardingEducation {
  specializations: ISpecializations[];
  degree: string;
  institute_name: string;
  completion_year: number;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
}

export interface IEducationSpecialization {
  specializations: ISpecializations[];
  degree: string;
  institute_name: string;
  completion_year: number;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
}

export interface IOnboardingDocuments {
  reg_no: string | number;
  reg_council: string | number;
  reg_year: string | number;
  identity_proof: string | File | null;
  medical_reg_proof: string | File | null;
  establishment_proof: string | File | null;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
}

export interface IRegistrationDocuments {
  reg_no: string | number;
  reg_council: string | number;
  reg_year: string | number;
  identity_proof: string | File | null;
  medical_reg_proof: string | File | null;
  establishment_proof: string | File | null;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
}

export interface IEstablishmentDetails {
  fee: string | number;
  time_duration: string;
  onboarding_steps: {
    per_con: boolean;
    reg_doc: boolean;
    edu_spec: boolean;
    fee_time: boolean;
  };
}

export interface IDoctorEstablishment {
  timings: string[];
  fee: string | number;
  time_duration: string;
}

export interface ITimings {
  [day: string]: { start_time: string; end_time: string }[] | string;
}
