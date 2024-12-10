import { APIService } from "../services/api.service";
import {
    ISpecializationsResponse
} from "../types/specializations/specializations";

class SpecializationsService extends APIService {
    async getSpecializations(): Promise<ISpecializationsResponse> {
        return this.get('/api/specializations/')
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}

export const specializationsservice = new SpecializationsService();