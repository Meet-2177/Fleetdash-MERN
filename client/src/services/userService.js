import axiosInstance from "./axiosInstance";

export const getProfile = () => axiosInstance.get("/users/profile");
export const updateProfile = (data) => axiosInstance.put("/users/profile", data);
export const changePassword = (data) => axiosInstance.put("/users/change-password", data);
export const getUsers = () => axiosInstance.get("/users");
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);
