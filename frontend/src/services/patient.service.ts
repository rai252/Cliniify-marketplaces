import { APIService } from "../services/api.service";
import { IPatient, IUpdatePatient } from "../types/patient/patient";

class PatientService extends APIService {
  async getPatient(params: any = {}): Promise<IPatient> {
    const { patientid } = params;

    return this.get(`/api/patients/${patientid}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updatePatient(
    patientid: number,
    patientData: FormData
  ): Promise<number> {
    try {
      const response = await this.put(
        `/api/patients/${patientid}/`,
        patientData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response?.data?.id || 0;
    } catch (error: any) {
      throw (error.response?.data as any) || error.message || "Unknown error";
    }
  }

  async getProfileCount(params: any = {}): Promise<IPatient> {
    const { patientid } = params;
    return this.get(`/api/patients/${patientid}/profile_completion/`, {
      params,
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deletePatient(params: any = {}): Promise<IPatient> {
    const { patientid } = params;
    return this.delete(`/api/patients/${patientid}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export const patientService = new PatientService();
