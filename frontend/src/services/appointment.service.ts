import { IAppointment, IAppointmentList, IAppointmentDetail, IAppointmentUpdate } from "@/types/appointment/appointment";
import { APIService } from "../services/api.service";

class AppointmentService extends APIService {
    async bookAppointment(appointmentData: IAppointment): Promise<number> {
        try {
            const response = await this.post('/api/appointments/', appointmentData);
            return response?.data?.id || 0;
        } catch (error: any) {
            throw (error.response?.data as any) || error.message || 'Unknown error';
        }
    }

    async rescheduleAppointment(appointmentid: number, appointmentData: IAppointmentUpdate): Promise<number> {
        try {
            const response = await this.put(`/api/appointments/${appointmentid}/`, appointmentData);
            return response?.data?.id || 0;
        } catch (error: any) {
            throw (error.response?.data as any) || error.message || 'Unknown error';
        }
    }

    async getAppointmentList(params: any = {}): Promise<IAppointmentList> {
        return this.get('/api/appointments/', { params })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async getAppointmentDetail(params: any = {}): Promise<IAppointmentDetail> {
        const { appointmentid } = params;

        return this.get(`/api/appointments/${appointmentid}/`, { params })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async UpdateAppointmentStatus(appointmentId: string, data: Partial<IAppointmentDetail>): Promise<IAppointmentDetail> {
        return this.patch(`/api/appointments/${appointmentId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async cancelAppointment(appointmentId: string, data: Partial<IAppointmentDetail>): Promise<IAppointmentDetail> {
        return this.patch(`/api/appointments/${appointmentId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}

export const appointmentService = new AppointmentService();