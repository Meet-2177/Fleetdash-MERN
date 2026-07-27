import { Box, Typography, Button } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

const EmptyState = ({ title = "No data found", message, actionLabel, onAction }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 6,
      px: 2,
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        mx: "auto",
        mb: 2,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <InboxIcon sx={{ fontSize: 32 }} />
    </Box>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {message && (
      <Typography variant="body2" color="text.secondary" mb={2}>
        {message}
      </Typography>
    )}
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
