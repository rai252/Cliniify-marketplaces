import { IAddress, IEstablishments } from "./establishments.interface";
import { ISpecializations } from "./specializations.interfce";

export interface IDoctor {
  id: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  gender: string;
  email: string;
  alternative_number: string,
  clinic_no: string,
  website: string;
  specializations: ISpecializations[];
  bio?: string;
  reg_no?: string;
  reg_council?: string;
  reg_year?: number;
  degree?: string;
  institute_name?: string;
  completion_year?: number;
  experience_years?: number;
  own_establishment?: boolean;
  identity_proof?: string;
  medical_reg_proof?: string;
  establishment_proof?: string;
  address?: IAddress;
  fee?: number;
  timings: string[];
  time_duration?: string;
  is_verified?: boolean;
  images: IDoctorImages[];
  relations: IRelations[];
  associated_establishment: IEstablishments[];
}

export interface IDoctorAdd {
  full_name: string;
  phone?: string;
  avatar?: string;
  gender: string;
  email: string;
  password: string;
  alternative_number: string,
  clinic_no: string,
  website: string;
  specializations: ISpecializations[];
  bio?: string;
  reg_no?: string;
  reg_council?: string;
  reg_year?: number;
  degree?: string;
  institute_name?: string;
  completion_year?: number;
  experience_years?: number;
  own_establishment?: boolean;
  identity_proof?: File | null;
  medical_reg_proof?: File | null;
  establishment_proof?: File | null;
  address?: IAddress;
  fee?: number;
  timings: string[];
  time_duration: string;
  is_verified?: boolean;
  images: IDoctorImages[];
}

export interface IDoctorEdit {
  full_name: string;
  phone?: string;
  avatar?: string;
  gender: string;
  email: string;
  alternative_number: string,
  clinic_no: string,
  website: string;
  specializations: ISpecializations[];
  bio?: string;
  reg_no?: string;
  reg_council?: string;
  reg_year?: number;
  degree?: string;
  institute_name?: string;
  completion_year?: number;
  experience_years?: number;
  own_establishment?: boolean;
  identity_proof?: File | null;
  medical_reg_proof?: File | null;
  establishment_proof?: File | null;
  address?: IAddress;
  fee?: number;
  timings: string[];
  time_duration: string;
  is_verified?: boolean;
  images: IDoctorImages[];
  relations: IRelations[];
  associated_establishment: IEstablishments[];
}

export interface IRelations{
  doctor_id: number;
  establishment_id: number;
  timings: string[];
};


export interface IDoctorCount {
  total_doctor_count: number;
  change_type: "increment" | "decrement";
  increment_or_decrement_users: number;
  percentage_users: number;
}

export interface IDoctorImages {
  id: number;
  image: string;
}
