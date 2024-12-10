import { ISaleUsers } from "@/interfaces/sale.interface";
import { api } from "../api";
import { ListResponse } from "../types";

export const SaleUsersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSaleUsers: builder.query<ListResponse<ISaleUsers>, {}>({
      query: (params) => ({ url: "/users/sale_user_list/", params }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) =>
                  ({ type: "Saleuser", id } as const)
              ),
              { type: "Saleuser", id: "LIST" },
            ]
          : [{ type: "Saleuser", id: "LIST" }],
    }),
    getSaleUserById: builder.query<ISaleUsers, string>({
      query: (id) => `/users/${id}/`,
      providesTags: (result) =>
        result ? [{ type: "Saleuser", id: result?.id }] : [],
    }),
    addSaleUser: builder.mutation({
      query: (data) => ({
        url: "/users/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Saleuser"],
    }),
    editSaleUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Saleuser"],
    }),
    deleteSaleUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Saleuser"],
    }),
  }),
});

export const {
    useGetSaleUsersQuery,
    useGetSaleUserByIdQuery,
    useAddSaleUserMutation,
    useEditSaleUserMutation,
    useDeleteSaleUserMutation,
} = SaleUsersApi;
