import axiosInstance from "./axiosInstance";

export const getTrips = () => axiosInstance.get("/trips");
export const getTripById = (id) => axiosInstance.get(`/trips/${id}`);
export const createTrip = (data) => axiosInstance.post("/trips", data);
export const updateTrip = (id, data) => axiosInstance.put(`/trips/${id}`, data);
export const deleteTrip = (id) => axiosInstance.delete(`/trips/${id}`);
