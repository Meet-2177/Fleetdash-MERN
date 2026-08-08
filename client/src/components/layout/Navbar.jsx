import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getNotifications } from "../../services/notificationService";

const Navbar = ({ drawerWidth, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await getNotifications();
        const unread = (data.notifications || []).filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch {
        /* ignore */
      }
    };
    fetchUnread();
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 0.6 }}>
        <IconButton
          color="primary"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" }, border: "1px solid", borderColor: "divider" }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome back,
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {user?.name}
          </Typography>
        </Box>

        <IconButton
          color="primary"
          onClick={() => navigate("/notifications")}
          sx={{ mr: 1, border: "1px solid", borderColor: "divider" }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <IconButton onClick={handleMenuOpen} sx={{ border: "1px solid", borderColor: "divider", p: 0.6 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 14 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem disabled>
            <Box>
              <Typography variant="subtitle2">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role?.toUpperCase()}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
