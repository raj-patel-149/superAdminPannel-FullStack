import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://superadminpannel-fullstack.onrender.com/api",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "user/add-user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    getuser: builder.query({
      query: ({
        status = "All",
        page = 0,
        limit = 5,
        search = "",
        trainerId,
      }) => {
        const searchParam = search.length >= 2 ? `&search=${search}` : "";
        return `user/users?trainerId=${trainerId}&status=${status}&page=${page}&limit=${limit}${searchParam}`;
      },
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `user/${id}`,
      providesTags: ["User"],
    }),
    getUserByEmail: builder.query({
      query: (email) => `user/${email}`,
      providesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "user/forgot-password",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["User"],
    }),
    acceptEmail: builder.mutation({
      query: (token) => ({
        url: `user/accept-email/${token}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: ({ email, password }) => ({
        url: "user/reset-password",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["User"],
    }),

    // admin
    addAdmin: builder.mutation({
      query: (newUser) => ({
        url: "admin/add-admin",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    getAdmin: builder.query({
      query: ({ status = "All", page = 0, limit = 5, search = "" }) => {
        const searchParam = search.length >= 2 ? `&search=${search}` : "";
        return `admin/admins?status=${status}&page=${page}&limit=${limit}${searchParam}`;
      },
      providesTags: ["User"],
    }),
    getAdminById: builder.query({
      query: (id) => `admin/${id}`,
      providesTags: ["User"],
    }),

    deleteAdmin: builder.mutation({
      query: (userId) => ({
        url: `admin/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateAdmin: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `admin/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["User"],
    }),
    // Trainer
    addTrainer: builder.mutation({
      query: (newUser) => ({
        url: "trainer/add-trainer",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    getTrainer: builder.query({
      query: ({
        status = "All",
        page = 0,
        limit = 5,
        search = "",
        adminId,
      }) => {
        const searchParam = search.length >= 2 ? `&search=${search}` : "";
        return `trainer/trainers?adminId=${adminId}&status=${status}&page=${page}&limit=${limit}${searchParam}`;
      },
      providesTags: ["User"],
    }),
    getTrainerById: builder.query({
      query: (id) => `trainer/${id}`,
      providesTags: ["User"],
    }),

    deleteTrainer: builder.mutation({
      query: (userId) => ({
        url: `trainer/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateTrainer: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `trainer/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useAddUserMutation,
  useGetuserQuery,
  useForgotPasswordMutation,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useAcceptEmailMutation,
  useResetPasswordMutation,
  useAddAdminMutation,
  useDeleteAdminMutation,
  useGetAdminQuery,
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
  useAddTrainerMutation,
  useGetTrainerQuery,
  useGetTrainerByIdQuery,
  useDeleteTrainerMutation,
  useUpdateTrainerMutation,
} = apiSlice;
