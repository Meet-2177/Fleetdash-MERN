import axiosInstance from "./axiosInstance";

export const getNotifications = () => axiosInstance.get("/notifications");
export const createNotification = (data) => axiosInstance.post("/notifications", data);
export const markAsRead = (id) => axiosInstance.put(`/notifications/${id}/read`);
export const deleteNotification = (id) => axiosInstance.delete(`/notifications/${id}`);
