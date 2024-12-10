import { IPatient } from "@/interfaces/patient.interface";
import { api } from "../api";
import { ListResponse } from "../types";

export const patientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<ListResponse<IPatient>, {}>({
      query: (params) => ({
        url: "/patients/",
        params,
      }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) => ({ type: "Patient", id } as const)
              ),
              { type: "Patient", id: "LIST" },
            ]
          : [{ type: "Patient", id: "LIST" }],
    }),
    getPatientCounts: builder.query({
      query: () => "/patients/total_count",
      providesTags: (result) => (result ? [{ type: "Patient" }] : []),
    }),
    getPatientById: builder.query<IPatient, { id: string, expand?: string }>({
      query: ({ id, expand }) => {
        const url = `/patients/${id}/`;
        const params = new URLSearchParams();
    
        if (expand) {
          params.append('expand', expand);
        }
    
        return `${url}?${params.toString()}`;
      },
      providesTags: (result) => result ? [{ type: "Patient", id: result?.id }] : [],
    }),
    addPatient: builder.mutation({
      query: (patient) => ({
        url: "/patients/",
        method: "POST",
        body: patient,
      }),
      invalidatesTags: ["Patient"],
    }),
    editPatient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/patients/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Patient"],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patients/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useAddPatientMutation,
  useEditPatientMutation,
  useDeletePatientMutation,
  useGetPatientCountsQuery,
} = patientsApi;
