import { Box, Container, Paper, Typography } from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #42A5F5 100%)",
      p: 2,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at top right, rgba(255,255,255,0.18) 0%, transparent 35%)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.12)",
        bottom: -80,
        left: -60,
        filter: "blur(4px)",
      }}
    />
    <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <DirectionsCarFilledIcon sx={{ fontSize: 48, color: "#fff", mb: 1 }} />
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
          FleetDash
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.86)" }}>
          Enterprise Fleet Management System
        </Typography>
      </Box>
      <Paper elevation={10} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, boxShadow: "0 16px 40px rgba(0, 0, 0, 0.16)" }}>
        <Outlet />
      </Paper>
    </Container>
  </Box>
);

export default AuthLayout;
