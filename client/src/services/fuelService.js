import axiosInstance from "./axiosInstance";

export const getFuelEntries = () => axiosInstance.get("/fuel");
export const getFuelById = (id) => axiosInstance.get(`/fuel/${id}`);
export const addFuel = (data) => axiosInstance.post("/fuel", data);
export const deleteFuel = (id) => axiosInstance.delete(`/fuel/${id}`);
