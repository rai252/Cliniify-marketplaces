// search.service.ts

import { APIService } from "../services/api.service";
import { ISearchResponse, ISuggestion } from "@/types/search/search";

class SearchService extends APIService {
  async getSearch(params: any = {}): Promise<ISearchResponse> {
    return this.get("/api/search/", { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getSuggestions(params: any = {}): Promise<ISuggestion[]> {
    return this.get("/api/suggestions/", { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export const searchService = new SearchService();
