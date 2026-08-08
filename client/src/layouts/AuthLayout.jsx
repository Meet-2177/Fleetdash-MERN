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
      background: "linear-gradient(135deg, #0f172a 0%, #312e81 45%, #4f46e5 100%)",
      p: 2,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 36%)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.12)",
        bottom: -100,
        left: -90,
        filter: "blur(4px)",
      }}
    />
    <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Box sx={{ display: "inline-flex", p: 1.4, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.16)", mb: 1.5 }}>
          <DirectionsCarFilledIcon sx={{ fontSize: 40, color: "#fff" }} />
        </Box>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
          FleetDash
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.86)" }}>
          Enterprise Fleet Management System
        </Typography>
      </Box>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, boxShadow: "0 24px 60px rgba(2, 6, 23, 0.24)", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.96)" }}>
        <Outlet />
      </Paper>
    </Container>
  </Box>
);

export default AuthLayout;
