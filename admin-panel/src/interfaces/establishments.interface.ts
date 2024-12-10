import { IDoctor } from "./doctor.interface";
import { ISpecializations } from "./specializations.interfce";

export interface IAddress {
    address_line_1: string;
    address_line_2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    latitude: string;
    longitude: string;
}

export interface IEstablishments {
    id: number;
    name: string;
    slug: string;
    establishment_category: string;
    tagline: string;
    email: string;
    phone: string;
    contact_person: string;
    address?: IAddress | null;
    establishment_images: IEstablishmentImages[];
    establishment_services: IEstablishmentServices[];
    owner: string;
    staffs: number[];
    logo: File | string | null;
    summary: string;
    specializations: ISpecializations[];
    website: string;
    is_owner: boolean;
    timings: string[];
}

export interface IEstablishmentImages{
    id: number;
    image?: File[] | string[] | null;
}

export interface IEstablishmentServices{
    id: number;
    name?: string[];
}

export interface IAddEstablishments {
    name: string;
    establishment_category: string;
    tagline: string;
    email: string;
    phone: string;
    contact_person: string;
    address?: IAddress | null;
    establishment_images: File[] | string[];
    establishment_services: string[];
    owner: string;
    staffs: number[];
    logo: File | string | null;
    summary: string;
    specializations: ISpecializations[];
    website: string;
    timings: string[];
}

export interface IAvaliabledoctors{
    existing_doctors: IDoctor[] | [];
    available_doctors: IDoctor[] | []
}

export interface IAvaliableStaffdoctors{
    existing_doctors: IDoctor[] | [];
    available_doctors: IDoctor[] | [];
    all_doctors: IDoctor[] | [];
}

export const establishmentcategoryEnum = [
    { label: "General", value: "general" },
    { label: "Speciality", value: "speciality" },
    { label: "Multi Speciality", value: "multi-speciality" },
  ];