import axiosInstance from "./axiosInstance";

export const getDashboardReport = () => axiosInstance.get("/reports/dashboard");
export const getFuelAnalysis = () => axiosInstance.get("/reports/fuel-analysis");
export const getTripAnalysis = () => axiosInstance.get("/reports/trip-analysis");
