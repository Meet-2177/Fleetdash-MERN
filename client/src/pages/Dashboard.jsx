import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Stack, Divider } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import RouteIcon from "@mui/icons-material/Route";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import DashboardSkeleton from "../components/common/DashboardSkeleton";
import StatusBadge from "../components/common/StatusBadge";
import { getDashboardStats } from "../services/dashboardService";
import { formatCurrency, formatDateTime } from "../utils/formatters";

const COLORS = ["#1565C0", "#42A5F5", "#FF9800", "#4CAF50"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        setData(res.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const vehicleChartData = [
    { name: "Available", value: data?.vehicles?.available || 0 },
    { name: "On Trip", value: data?.vehicles?.onTrip || 0 },
  ];

  const tripChartData = [
    { name: "Pending", value: data?.trips?.pending || 0 },
    { name: "Active", value: data?.trips?.active || 0 },
    { name: "Completed", value: data?.trips?.completed || 0 },
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your fleet operations"
      />

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Total Vehicles" value={data?.vehicles?.total || 0} icon={DirectionsCarIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Total Drivers" value={data?.drivers?.total || 0} icon={PeopleIcon} color="#00838F" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Total Trips" value={data?.trips?.total || 0} icon={RouteIcon} color="#7B1FA2" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Active Trips" value={data?.trips?.active || 0} icon={RouteIcon} color="#0288D1" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Fuel Cost" value={formatCurrency(data?.fuel?.totalCost)} icon={LocalGasStationIcon} color="#ED6C02" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Maintenance Cost" value={formatCurrency(data?.maintenance?.totalCost)} icon={BuildIcon} color="#D32F2F" />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Vehicle Status
                </Typography>
                <Box sx={{ px: 1.2, py: 0.6, borderRadius: 999, bgcolor: "primary.main", color: "primary.contrastText", fontSize: 12, fontWeight: 600 }}>
                  Live
                </Box>
              </Stack>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={vehicleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {vehicleChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Trip Status
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={tripChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1565C0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Trips
              </Typography>
              {(data?.recentTrips || []).length === 0 ? (
                <Typography color="text.secondary">No recent trips</Typography>
              ) : (
                (data.recentTrips || []).map((trip) => (
                  <Box
                    key={trip._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">
                        {trip.source} → {trip.destination}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {trip.driver?.name} · {trip.vehicle?.vehicleNumber}
                      </Typography>
                    </Box>
                    <StatusBadge status={trip.status} />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Notifications
              </Typography>
              {(data?.notifications || []).length === 0 ? (
                <Typography color="text.secondary">No notifications</Typography>
              ) : (
                (data.notifications || []).map((n) => (
                  <Box
                    key={n._id}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <CheckCircleIcon color="primary" fontSize="small" sx={{ mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2">{n.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(n.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
