import { ROLES } from "./constants";

const adminManager = [ROLES.ADMIN, ROLES.MANAGER];

export const permissions = {
  vehicles: {
    create: [ROLES.ADMIN],
    edit: adminManager,
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  drivers: {
    create: adminManager,
    edit: adminManager,
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  trips: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  fuel: {
    create: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  maintenance: {
    create: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  users: {
    view: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  notifications: {
    create: adminManager,
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  // ==========================
  // GEOFENCES
  // ==========================
  geofences: {
    create: adminManager,
    edit: adminManager,
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },
};

// ==========================
// ROLE ACCESS CHECK
// ==========================

export const canAccess = (role, module, action) => {
  const modulePerms = permissions[module];

  if (!modulePerms) {
    return false;
  }

  const allowedRoles = modulePerms[action];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(role);
};

// ==========================
// NAVIGATION ITEMS
// ==========================

export const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "Dashboard",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Vehicles",
    path: "/vehicles",
    icon: "DirectionsCar",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Drivers",
    path: "/drivers",
    icon: "People",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Trips",
    path: "/trips",
    icon: "Route",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Fuel",
    path: "/fuel",
    icon: "LocalGasStation",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Maintenance",
    path: "/maintenance",
    icon: "Build",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Reports",
    path: "/reports",
    icon: "Assessment",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Notifications",
    path: "/notifications",
    icon: "Notifications",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  {
    label: "Users",
    path: "/users",
    icon: "ManageAccounts",
    roles: [ROLES.ADMIN],
  },

  // ==========================
  // LIVE MAP
  // ==========================

  {
    label: "Live Map",
    path: "/live-map",
    icon: "Map",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },

  // ==========================
  // GEOFENCES
  // ==========================

  {
    label: "Geofences",
    path: "/geofences",
    icon: "LocationOn",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
  },
];