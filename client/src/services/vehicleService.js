import axiosInstance from "./axiosInstance";

export const getVehicles = (params) => axiosInstance.get("/vehicles", { params });
export const getVehicleById = (id) => axiosInstance.get(`/vehicles/${id}`);
export const createVehicle = (data) => axiosInstance.post("/vehicles", data);
export const updateVehicle = (id, data) => axiosInstance.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => axiosInstance.delete(`/vehicles/${id}`);
