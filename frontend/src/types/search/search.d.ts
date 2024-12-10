import { ISpecializations } from "../specializations/specializations";

export interface IAddress {
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string | null;
  longitude: string | null;
}

export interface IDoctor {
  services: any;
  id: number;
  type: "doctor";
  full_name: string;
  slug: string;
  bio: string;
  gender: "M" | "F" | string;
  email: string;
  phone: string;
  avatar: string | null;
  specializations: string[];
  address: IAddress;
  experience_years: number;
  fee: number;
  is_verified: boolean;
  average_rating: number;
  is_owner?: boolean;
}

export interface IEstablishment {
  id: number;
  type: "establishment";
  name: string;
  slug: string;
  logo: File[] | string | null | undefined;
  establishment_category: string | null;
  specializations: string[];
  tagline: string | null;
  summary: string | null;
  website: string | null;
  email: string;
  phone: string;
  contact_person: string | null;
  fee_range: string | null;
  address: IAddress;
  timings: string | null;
  associated_doctors: IDoctor[];
  average_doctors_rating: number;
  doctor_count: number;
}

export type ISearchResult = IDoctor | IEstablishment;

export interface ISearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISearchResult[];
}

export interface ISuggestion {
  category: string;
  suggestion: string;
}
