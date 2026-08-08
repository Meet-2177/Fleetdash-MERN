import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
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
        <LockIcon sx={{ fontSize: 64, color: "warning.main", mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Access Denied
        </Typography>
        <Typography color="text.secondary" mb={3}>
          You don&apos;t have permission to view this page.
        </Typography>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default Unauthorized;
