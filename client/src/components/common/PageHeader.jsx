import { Box, Typography, Button } from "@mui/material";

const PageHeader = ({ title, subtitle, actionLabel, onAction, actionIcon }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      justifyContent: "space-between",
      gap: 2,
      mb: 3,
      p: { xs: 2.5, sm: 3 },
      borderRadius: 4,
      background: "linear-gradient(135deg, rgba(21, 101, 192, 0.11) 0%, rgba(79, 179, 191, 0.15) 100%)",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      backdropFilter: "blur(8px)",
    }}
  >
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />
        <Typography variant="overline" letterSpacing={1.6} color="primary.main" fontWeight={700}>
          Fleet operations
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actionLabel && onAction && (
      <Button
        variant="contained"
        startIcon={actionIcon}
        onClick={onAction}
        sx={{ whiteSpace: "nowrap", borderRadius: 999 }}
      >
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default PageHeader;
