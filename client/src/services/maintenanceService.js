import axiosInstance from "./axiosInstance";

export const getMaintenances = () => axiosInstance.get("/maintenance");
export const getMaintenanceById = (id) => axiosInstance.get(`/maintenance/${id}`);
export const addMaintenance = (data) => axiosInstance.post("/maintenance", data);
export const deleteMaintenance = (id) => axiosInstance.delete(`/maintenance/${id}`);
