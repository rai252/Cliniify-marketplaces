import { IUser } from "../user/user";

export interface IPatient {
  id: number;
  user: IUser;
  full_name: string;
  phone: number;
  secondary_phone: string;
  date_of_birth: number;
  age: number;
  gender: string;
  blood_group: string;
  address: any;
  avatar: string | File | null;
  email: string;
  deleting_reason: string | null;
  profile_completion_percentage: number;
}

export interface IUpdatePatient {
  full_name?: string;
  email?: string;
  phone?: string | number;
  secondary_phone?: string | number;
  date_of_birth?: Date | string | number;
  age?: string | number;
  gender?: string;
  blood_group?: string;
  address?: any;
  avatar?: File | null;
}

export interface IUpdateAvatar {
  id: number;
  full_name: string;
  secondary_phone: string;
  date_of_birth: number;
  age: number;
  gender: string;
  blood_group: string;
  address: any;
  avatar: string | File | null;
}
