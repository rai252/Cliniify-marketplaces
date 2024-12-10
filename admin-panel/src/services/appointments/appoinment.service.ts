import { api } from "../api";

export const appointmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentCounts: builder.query({
      query: () => "/appointments/total_count",
      providesTags: (result) => (result ? [{ type: "Appointment" }] : []),
    }),
  }),
});

export const { useGetAppointmentCountsQuery } = appointmentApi;
