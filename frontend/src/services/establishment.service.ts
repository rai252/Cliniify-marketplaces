import { IDoctor, IGetResult } from "@/types/doctor/doctor";
import { APIService } from "../services/api.service";
import {
  IAvaliabledoctors,
  IEstablishment,
  searchResponse,
} from "../types/establishment/establishment";

class EstablishmentService extends APIService {
  async getEstablishments(params: any = {}): Promise<IEstablishment[]> {
    return this.get("/api/establishments/", { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createEstablishment(data: FormData): Promise<IEstablishment> {
    return this.post("/api/establishments/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getEstablishmentDetail(params: any = {}): Promise<IEstablishment> {
    const { id } = params;
    return this.get(`/api/establishments/${id}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getAvailableStaffDoctors(
    id: string = "none"
  ): Promise<IAvaliabledoctors> {
    let endpoint = "/api/establishments/available_staff_doctors/";
    if (id !== "none") {
      endpoint += `?establishment_id=${id}`;
    }
    return this.get(endpoint)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateEstablishment(
    params: any = {},
    Data: FormData
  ): Promise<IEstablishment> {
    const { id } = params;
    return this.put(`/api/establishments/${id}/`, Data, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async partialUpdateEstablishment(
    params: any = {},
    Data: Partial<IEstablishment>
  ): Promise<IEstablishment> {
    const { id } = params;
    return this.patch(`/api/establishments/${id}/`, Data, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteEstablishment(params: any = {}): Promise<any> {
    const { id } = params;
    return this.delete(`/api/establishments/${id}/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
  async getEstablishmentById(slug: string): Promise<IEstablishment> {
    return this.get(`/api/establishments/${slug}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getAvailableOwnerDoctors(): Promise<IAvaliabledoctors> {
    return this.get("/api/establishments/available_owner_doctors/")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
  async acceptOnboardRequest(id: number): Promise<any> {
    return this.patch(
      `/api/establishments/onboard-requests/accept-request/?establishment_request_id=${id}`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getOnboardRequest(): Promise<IGetResult> {
    return this.get(`/api/establishments/onboard-requests/get-request/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async rejectOnboardRequest(id: number): Promise<any> {
    return this.patch(
      `/api/establishments/onboard-requests/reject-request/?establishment_request_id=${id}`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async searchEstablishment(params: any = {}): Promise<searchResponse> {
    return this.get(
      "/api/establishments/onboard-requests/search-establishment/",
      { params }
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async sendOnboardRequest(data: any): Promise<any> {
    return this.post("/api/establishments/onboard-requests/send-request/", data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getSaleListEstablishment(): Promise<IEstablishment[]> {
    return this.get("/api/establishments/sale_list_establishment/")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export const establishmentService = new EstablishmentService();
