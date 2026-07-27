export const STORAGE_KEYS = {
  TOKEN: "fleetdash_token",
  USER: "fleetdash_user",
  THEME: "fleetdash_theme",
};

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  DRIVER: "driver",
};

export const VEHICLE_TYPES = ["Car", "Truck", "Bus", "Bike", "Van"];
export const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric"];
export const VEHICLE_STATUSES = ["Available", "On Trip", "Maintenance"];
export const DRIVER_STATUSES = ["Available", "On Trip", "Inactive"];
export const TRIP_STATUSES = ["Pending", "Ongoing", "Completed", "Cancelled"];
export const MAINTENANCE_STATUSES = ["Pending", "Completed"];
export const NOTIFICATION_TYPES = ["Trip", "Vehicle", "Driver", "Fuel", "Maintenance", "System"];

export const STATUS_COLORS = {
  Available: "success",
  "On Trip": "info",
  Maintenance: "warning",
  Inactive: "default",
  Pending: "warning",
  Ongoing: "info",
  Completed: "success",
  Cancelled: "error",
};
