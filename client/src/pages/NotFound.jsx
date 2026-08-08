import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
        background: "linear-gradient(135deg, #f7f9ff 0%, #eef4ff 100%)",
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
          border: "1px solid",
          borderColor: "divider",
          maxWidth: 480,
          width: "100%",
        }}
      >
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
        <Typography variant="h3" fontWeight={700}>
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          Page not found
        </Typography>
        <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
