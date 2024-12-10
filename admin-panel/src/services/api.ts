// import { store } from "@/store/store";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import {
  deleteRefreshToken,
  deleteToken,
  persistToken,
  readRefreshToken,
  readToken,
} from "./localStorage.service";

const baseUrl: string =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// console.log(import.meta.env.VITE_API_URL);


const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const accessToken = readToken();

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithTokenRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    !result.meta?.request.url.includes("auth")
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = readRefreshToken();
        const refreshResult = await baseQuery(
          {
            url: "/token/refresh/",
            method: "POST",
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const accessToken = (refreshResult.data as any).access;
          persistToken(accessToken);
          result = await baseQuery(args, api, extraOptions);
        } else {
          deleteToken();
          deleteRefreshToken();
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTokenRefresh,
  tagTypes: ["Doctor", "Specializations", "Patient", "Appointment", "Blog", "Establishment", "Saleuser"],
  endpoints: (builder) => ({
    search: builder.query<any, any>({
      query: (params) => ({
        url: "/search",
        params,
      }),
    }),
  }),
});

export const { useSearchQuery } = api;
