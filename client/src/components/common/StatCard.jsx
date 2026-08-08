import { Card, CardContent, Box, Typography, Skeleton } from "@mui/material";

const StatCard = ({ title, value, icon: Icon, color = "#1565C0", loading }) => {
  const resolvedColor = color.startsWith("#") ? color : "#1565C0";

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(245,249,255,0.96) 100%)",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 18px 36px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      <CardContent sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: -16,
            right: -16,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${resolvedColor}25 0%, transparent 70%)`,
          }}
        />
        {loading ? (
          <>
            <Skeleton width="60%" />
            <Skeleton width="40%" height={40} sx={{ mt: 1 }} />
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {value}
              </Typography>
            </Box>
            {Icon && (
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  bgcolor: `${resolvedColor}16`,
                  color: resolvedColor,
                  display: "flex",
                }}
              >
                <Icon />
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
