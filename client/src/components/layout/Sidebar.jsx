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
};

const SidebarContent = ({ onNavigate }) => {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2, gap: 1 }}>
        <DirectionsCarFilledIcon color="primary" />
        <Typography variant="h6" fontWeight={700} color="primary">
          FleetDash
        </Typography>
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
                mb: 0.5,
                borderRadius: 2,
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "primary.contrastText" : "text.primary",
                "&:hover": {
                  bgcolor: isActive ? "primary.dark" : "action.hover",
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
        <Typography variant="caption" color="text.secondary">
          Fleet Management v1.0
        </Typography>
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
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
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
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    )}
  </>
);

export default Sidebar;
