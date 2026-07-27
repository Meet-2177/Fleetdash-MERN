import axiosInstance from "./axiosInstance";

export const getDrivers = () => axiosInstance.get("/drivers");
export const getDriverById = (id) => axiosInstance.get(`/drivers/${id}`);
export const createDriver = (data) => axiosInstance.post("/drivers", data);
export const updateDriver = (id, data) => axiosInstance.put(`/drivers/${id}`, data);
export const deleteDriver = (id) => axiosInstance.delete(`/drivers/${id}`);
export const assignVehicle = (id, vehicleId) =>
  axiosInstance.put(`/drivers/${id}/assign-vehicle`, { vehicleId });
export const uploadDriverPhoto = (id, formData) =>
  axiosInstance.put(`/drivers/${id}/upload-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
