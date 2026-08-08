import axiosInstance from "./axiosInstance";

export const getGeofences = () =>
  axiosInstance.get("/geofences");

export const getGeofenceById = (id) =>
  axiosInstance.get(`/geofences/${id}`);

export const createGeofence = (data) =>
  axiosInstance.post("/geofences", data);

export const updateGeofence = (id, data) =>
  axiosInstance.put(`/geofences/${id}`, data);

export const deleteGeofence = (id) =>
  axiosInstance.delete(`/geofences/${id}`);

export const toggleGeofenceStatus = (id) =>
  axiosInstance.patch(`/geofences/${id}/toggle`);