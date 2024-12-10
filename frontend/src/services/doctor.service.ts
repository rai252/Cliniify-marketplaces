import { APIService } from "../services/api.service";
import {
  IDoctor,
  ITimeSlots,
  IEstablishmentDetails,
  IEducationSpecialization,
  IDoctorProfile,
  IRegistrationDocuments,
  IDoctorEstablishment,
  ITimings,
  IDoctorList,
  IOnboardingProfile,
  IOnboardingEducation,
  IOnboardingDocuments,
} from "../types/doctor/doctor";

class DoctorService extends APIService {
  async getDoctors(params: any = {}): Promise<IDoctor[]> {
    return this.get("/api/doctors/", { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getDoctorsList(params: any = {}): Promise<IDoctorList> {
    return this.get("/api/doctors/", { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getDoctorDetail(
    params: any = {},
    expand: string = ""
  ): Promise<IDoctor> {
    const { id } = params;
    return this.get(`/api/doctors/${id}/?expand=${expand}`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getTimeSlots(params: any = {}): Promise<ITimeSlots> {
    const { id } = params;
    return this.get(`/api/doctors/${id}/time_slots/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getDetails(
    params: any = {},
    expand: string = ""
  ): Promise<IOnboardingProfile> {
    const { id } = params;
    return this.get(`/api/doctors/${id}/?expand=${expand}`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateDoctorDetails(params: any = {}, Data: FormData): Promise<number> {
    const { id } = params;
    try {
      const response = await this.put(`/api/doctors/${id}/`, Data, {
        params,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response?.data;
    } catch (error: any) {
      throw (error.response?.data as any) || error.message || "Unknown error";
    }
  }

  async getDetailsEducation(params: any = {}): Promise<IOnboardingEducation> {
    const { id } = params;

    return this.get(`/api/doctors/${id}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateEducation(
    params: any = {},
    Data: IEducationSpecialization
  ): Promise<number> {
    const { id } = params;
    try {
      const response = await this.put(`/api/doctors/${id}/`, Data, { params });
      return response?.data?.id || 0;
    } catch (error: any) {
      throw (error.response?.data as any) || error.message || "Unknown error";
    }
  }

  async getDetailsDocuments(params: any = {}): Promise<IOnboardingDocuments> {
    const { id } = params;

    return this.get(`/api/doctors/${id}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateRegistrationDocuments(
    params: any = {},
    Data: IRegistrationDocuments
  ): Promise<number> {
    const { id } = params;

    try {
      const response = await this.put(`/api/doctors/${id}/`, Data, {
        params,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response?.data?.id || 0;
    } catch (error: any) {
      throw (error.response?.data as any) || error.message || "Unknown error";
    }
  }

  async getDetailsTimings(params: any = {}): Promise<IEstablishmentDetails> {
    const { id } = params;

    return this.get(`/api/doctors/${id}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateEstablishment(
    params: any,
    data: IDoctorEstablishment
  ): Promise<any> {
    const { id } = params;
    return this.put(`/api/doctors/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error.response.data;
      });
  }

  async updateTimings(params: any = {}, Data: ITimings): Promise<number> {
    const { id } = params;
    try {
      const response = await this.put(`/api/doctors/${id}/`, Data, { params });
      return response?.data?.id || 0;
    } catch (error: any) {
      throw (error.response?.data as any) || error.message || "Unknown error";
    }
  }

  async getProfileCount(params: any = {}): Promise<IDoctor> {
    const { id } = params;
    return this.get(`/api/doctors/${id}/profile_completion/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteDoctor(params: any = {}): Promise<IDoctor> {
    const { id } = params;
    return this.delete(`/api/doctors/${id}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export const doctorService = new DoctorService();
