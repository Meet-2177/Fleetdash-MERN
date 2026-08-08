import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import RouteIcon from "@mui/icons-material/Route";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import BuildIcon from "@mui/icons-material/Build";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { navItems } from "../../utils/rolePermissions";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const iconMap = {
  Dashboard: DashboardIcon,
  DirectionsCar: DirectionsCarIcon,
  People: PeopleIcon,
  Route: RouteIcon,
  LocalGasStation: LocalGasStationIcon,
  Build: BuildIcon,
  Assessment: AssessmentIcon,
  Notifications: NotificationsIcon,
  ManageAccounts: ManageAccountsIcon,

  // New
  Map: MapIcon,
  LocationOn: LocationOnIcon,
};

const SidebarContent = ({ onNavigate }) => {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "transparent" }}>
      <Toolbar sx={{ px: 2, py: 2.2, gap: 1.2, background: "linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(15,118,110,0.12) 100%)" }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: "primary.main", color: "primary.contrastText", display: "flex" }}>
          <DirectionsCarFilledIcon />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            FleetDash
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Operations center
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {filteredNav.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={onNavigate}
              sx={{
                mb: 0.6,
                borderRadius: 2.2,
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "primary.contrastText" : "text.primary",
                boxShadow: isActive ? "0 12px 24px rgba(79, 70, 229, 0.18)" : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isActive ? "primary.dark" : "action.hover",
                  transform: "translateX(2px)",
                },
                "& .MuiListItemIcon-root": {
                  color: isActive ? "primary.contrastText" : "primary.main",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.6}>
            Fleet Management
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Live overview
            </Typography>
            <Chip label="v1.0" size="small" color="primary" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Sidebar = ({ drawerWidth, mobileOpen, onClose, isMobile }) => (
  <>
    {isMobile ? (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", border: "none" },
        }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>
    ) : (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,247,255,0.96) 100%)",
            borderRight: "1px solid rgba(148, 163, 184, 0.22)",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    )}
  </>
);

export default Sidebar;
