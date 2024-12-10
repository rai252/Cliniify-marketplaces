import { IAvaliableStaffdoctors, IAvaliabledoctors, IEstablishments } from "@/interfaces/establishments.interface";
import { api } from "../api";
import { ListResponse } from "../types";

export const establishmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getestablishments: builder.query<ListResponse<IEstablishments>, {}>({
      query: (params) => ({ url: "/establishments/", params }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) =>
                  ({ type: "Establishment", id } as const)
              ),
              { type: "Establishment", id: "LIST" },
            ]
          : [{ type: "Establishment", id: "LIST" }],
    }),
    // getEstablishmentCounts: builder.query({
    //   query: () => "/establishments/total_count",
    //   providesTags: (result) => (result ? [{ type: "Establishment" }] : []),
    // }),
    getSaleUsersEstablishment: builder.query<ListResponse<IEstablishments>, { sale_user_id: string }>({
      query: (params: { sale_user_id: string; }) => ({ 
        url: "/establishments/sale_list_establishment/",
        params: { ...params, sale_user_id: params.sale_user_id },
      }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) =>
                  ({ type: "Establishment", id } as const)
              ),
              { type: "Establishment", id: "LIST" },
            ]
          : [{ type: "Establishment", id: "LIST" }],
    }),
    getEstablishmentById: builder.query<IEstablishments, string>({
      query: (id) => `/establishments/${id}/`,
      providesTags: (result) =>
        result ? [{ type: "Establishment", id: result?.id }] : [],
    }),
    getAvailableStaffDoctors: builder.query<IAvaliableStaffdoctors, string>({
      query: (id) => {
        if (id === "none") {
          return "/establishments/available_staff_doctors/";
        }
        return `/establishments/available_staff_doctors/?establishment_id=${id}`;
      },
      providesTags: (result) => (result ? [{ type: "Establishment" }] : []),
    }),
    getAvailableOwnerDoctors: builder.query<IAvaliabledoctors, string | null>({
      query: (id) => {
        if (id === "none") {
          return "/establishments/available_owner_doctors/";
        }
        return `/establishments/available_owner_doctors/?establishment_id=${id}`;
      },
      providesTags: (result) => (result ? [{ type: "Establishment" }] : []),
    }),
    addEstablishment: builder.mutation({
      query: (data) => ({
        url: "/establishments/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Establishment"],
    }),
    editEstablishment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/establishments/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Establishment"],
    }),
    deleteEstablishment: builder.mutation({
      query: (id) => ({
        url: `/establishments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Establishment"],
    }),
  }),
});

export const {
  useGetestablishmentsQuery,
  useAddEstablishmentMutation,
  useDeleteEstablishmentMutation,
  useEditEstablishmentMutation,
  useGetEstablishmentByIdQuery,
  useGetAvailableStaffDoctorsQuery,
  useGetAvailableOwnerDoctorsQuery,
  useGetSaleUsersEstablishmentQuery,
} = establishmentsApi;
