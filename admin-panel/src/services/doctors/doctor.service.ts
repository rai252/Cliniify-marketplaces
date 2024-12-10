import { IDoctor } from "@/interfaces/doctor.interface";
import { api } from "../api";
import { ListResponse } from "../types";

export const doctorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<ListResponse<IDoctor>, {}>({
      query: (params) => ({ url: "/doctors/", params }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) => ({ type: "Doctor", id } as const)
              ),
              { type: "Doctor", id: "LIST" },
            ]
          : [{ type: "Doctor", id: "LIST" }],
    }),
    getSaleUsersDoctor: builder.query<ListResponse<IDoctor>,{ sale_user_id: string }>({
      query: (params: { sale_user_id: string; }) => ({
        url: "doctors/sale_list_doctor/",
        params: { ...params, sale_user_id: params.sale_user_id },
      }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) => ({ type: "Doctor", id } as const)
              ),
              { type: "Doctor", id: "LIST" },
            ]
          : [{ type: "Doctor", id: "LIST" }],
    }),
    getDoctorCounts: builder.query({
      query: () => "/doctors/total_count",
      providesTags: (result) => (result ? [{ type: "Doctor" }] : []),
    }),
    getDoctorById: builder.query<IDoctor, { id: string, expand?: string }>({
      query: ({ id, expand }) => {
        const url = `/doctors/${id}/`;
        const params = new URLSearchParams();
    
        if (expand) {
          params.append('expand', expand);
        }
    
        return `${url}?${params.toString()}`;
      },
      providesTags: (result) => result ? [{ type: "Doctor", id: result?.id }] : [],
    }),
    addDoctor: builder.mutation({
      query: (data) => ({
        url: "/doctors/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Doctor"],
    }),
    editDoctor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/doctors/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Doctor"],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useAddDoctorMutation,
  useEditDoctorMutation,
  useDeleteDoctorMutation,
  useGetDoctorCountsQuery,
  useGetSaleUsersDoctorQuery,
} = doctorsApi;
