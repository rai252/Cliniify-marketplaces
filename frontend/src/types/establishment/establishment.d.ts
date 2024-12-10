import { TimeSlot } from "@/components/TimingInput";
import { IDoctor } from "../doctor/doctor";
import { IDoctor } from "../search/establishment";
import { ISpecializations } from "../specializations/specializations";

export interface IEstablishment {
  id: number;
  slug: string;
  name: string;
  tagline?: string;
  summary?: string;
  website?: string;
  logo: File[] | string | null | undefined;
  email: string;
  phone?: string;
  contact_person?: string;
  address: IAddress;
  establishment_category: string;
  establishment_images: IEstablishmentImage[];
  establishment_services: IEstablishmentService[];
  doctors: IDoctorInEstablishment[];
  owner: number;
  staffs: int[];
  deleted_images: [];
  associated_doctors?: IDoctor[];
  fee_range?: string;
  average_establishment_rating?: number;
  timings?: { [key: string]: TimeSlot[] } | undefined;
  specializations: ISpecializations[];
}

export interface searchResponse {
  message: string;
  suggestions: ISearchResult[];
}

export interface ISearchResult {
  id: number;
  name: string;
  city: string;
  owner: number;
}

export interface IDoctorInEstablishment {
  establishment: number;
  is_owner: boolean;
  timings: ITiming;
}

export interface IEstablishmentImages {
  id: number;
  image?: File[] | string[] | null;
}

export interface IEstablishmentService {
  id: number;
  name: string;
}

export interface IDoctorEstablishment {
  id: number;
  name: string;
}

export interface ITimingSlot {
  start_time: string;
  end_time: string;
}

export interface ITiming {
  Monday?: ITimingSlot[];
  Tuesday?: ITimingSlot[];
  Wednesday?: ITimingSlot[];
  Thursday?: ITimingSlot[];
  Friday?: ITimingSlot[];
  Saturday?: ITimingSlot[];
  Sunday?: ITimingSlot[];
}

export interface IAddress {
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IAvaliabledoctors {
  existing_doctors: IDoctor[] | [];
  available_doctors: IDoctor[] | [];
  all_doctors: IDoctor[] | [];
}
