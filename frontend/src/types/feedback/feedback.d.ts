import { IDoctor } from "../doctor/doctor";
import { IPatient } from "../patient/patient";

export interface IFeedback {
    id: number
    doctor: IDoctor
    patient: IPatient
    rating: number
    comment: string
    comment_at: string
    reply: string
    reply_at: string
}

export interface IFeedbackList {
    count: number
    next: string | null
    previous: string | null
    loading?: boolean
    results: IFeedback[]
}

export interface IFeedbackPost {
    id: number
    doctor: IDoctor | number
    patient: IPatient | number
    rating: number
    comment: string
    comment_at: string
}

export interface IUpdateFeedback {
    doctor: IDoctor
    patient: IPatient
    rating: number
    comment: string
}

export interface IDoctorReplyPost {
    doctor: number
    patient: number
    rating: number
    comment: string
    reply: string
    reply_at: string
}

export interface IDoctorReplyUpdate {
    doctor: number
    patient: number
    rating: number
    comment: string
    reply: string
    reply_at: string
}
