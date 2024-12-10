import { IDoctor } from "../doctor/doctor";
import { IPatient } from "../patient/patient";

export interface IUser {
    id: number
    full_name: string
    gender: string
    email: string
    phone: string
    avatar: string
    user_type: string
    patient_id: IPatient
    doctor_id: IDoctor
}

export interface IChangePassword {
    new_password: string
    confirm_password: string
}

