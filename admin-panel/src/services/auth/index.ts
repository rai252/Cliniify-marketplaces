import { api } from '../api'

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: '/users/auth/login/',
        method: 'POST',
        body: payload,
      }),
    }),
    sendOtp: builder.mutation({
      query: (payload) => ({
        url: '/users/auth/send-otp/',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
})

export const { useLoginMutation, useSendOtpMutation } = authApi
