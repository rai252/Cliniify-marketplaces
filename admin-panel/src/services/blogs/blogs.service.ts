import { api } from "../api";
import { ListResponse } from "../types";
import { IBlogPost } from "@/interfaces/blog.interface";

export const BlogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<ListResponse<IBlogPost>, {}>({
      query: (params) => ({ url: "/blogs/", params }),
      providesTags: (result: any) =>
        result
          ? [
              ...(result.results ?? []).map(
                ({ id }: { id: string }) => ({ type: "Blog", id } as const)
              ),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),
    getBlogCounts: builder.query({
      query: () => "/blogs/total_count",
      providesTags: (result) => (result ? [{ type: "Blog" }] : []),
    }),
    getBlogById: builder.query<IBlogPost, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result) =>
        result ? [{ type: "Blog", id: result?.id }] : [],
    }),
    addBlog: builder.mutation({
      query: (data) => ({
        url: "/blogs/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),
    editBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useGetBlogByIdQuery,
  useGetBlogCountsQuery,
  useGetBlogsQuery,
} = BlogApi;
