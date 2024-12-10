import { api } from "../api";
import { ISpecializations } from "@/interfaces/specializations.interfce";
import { ListResponse } from "../types";

export const specializationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpecializations: builder.query<ListResponse<ISpecializations>, {}>({
      query: (params) => ({
        url: "/specializations/",
        params,
      }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) => ({ type: "Specializations", id } as const)
              ),
              { type: "Specializations", id: "LIST" },
            ]
          : [{ type: "Specializations", id: "LIST" }],
    }),
    getSpecialization: builder.query<ISpecializations, string>({
      query: (id) => `specializations/${id}/`,
      providesTags: (result) =>
        result ? [{ type: "Specializations", id: result?.id }] : [],
    }),
    addSpecialization: builder.mutation({
      query: (data) => ({
        url: "/specializations/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Specializations", id: "LIST" }],
    }),
    editSpecialization: builder.mutation({
      query: ({ id, data }) => ({
        url: `/specializations/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specializations"],
    }),
    deleteSpecialization: builder.mutation({
      query: (id: any) => ({
        url: `/specializations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specializations"]
    }),
  }),
});

export const {
  useGetSpecializationsQuery,
  useGetSpecializationQuery,
  useAddSpecializationMutation,
  useEditSpecializationMutation,
  useDeleteSpecializationMutation,
} = specializationsApi;
