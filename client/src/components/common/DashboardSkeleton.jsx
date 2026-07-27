import { Grid, Skeleton, Card, CardContent } from "@mui/material";

const DashboardSkeleton = () => (
  <Grid container spacing={3}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Skeleton width="60%" />
            <Skeleton width="40%" height={40} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    ))}
    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Skeleton height={300} />
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Skeleton height={300} />
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default DashboardSkeleton;
