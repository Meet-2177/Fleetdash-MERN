import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, Stack } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import RouteIcon from "@mui/icons-material/Route";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import BuildIcon from "@mui/icons-material/Build";
import {
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
import {
  getDashboardReport,
  getFuelAnalysis,
  getTripAnalysis,
} from "../services/reportService";
import { formatCurrency } from "../utils/formatters";

const Reports = () => {
  const [dashboard, setDashboard] = useState(null);
  const [fuelReport, setFuelReport] = useState([]);
  const [tripReport, setTripReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [dashRes, fuelRes, tripRes] = await Promise.all([
          getDashboardReport(),
          getFuelAnalysis(),
          getTripAnalysis(),
        ]);
        setDashboard(dashRes.data.dashboard);
        setFuelReport(fuelRes.data.report || []);
        setTripReport(tripRes.data.report || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const fuelChartData = fuelReport.map((r) => ({
    name: r._id,
    cost: r.totalFuelCost,
    liters: r.totalLiters,
  }));

  const tripChartData = tripReport.map((r) => ({
    name: r._id,
    trips: r.totalTrips,
    distance: r.totalDistance,
    completed: r.completedTrips,
  }));

  const panelSx = {
    height: "100%",
    borderRadius: 4,
    background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(245,249,255,0.96) 100%)",
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.06)",
  };

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Fleet performance insights"
      />

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Vehicles" value={dashboard?.totalVehicles || 0} icon={DirectionsCarIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Drivers" value={dashboard?.totalDrivers || 0} icon={PeopleIcon} color="#00838F" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Total Trips" value={dashboard?.totalTrips || 0} icon={RouteIcon} color="#7B1FA2" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Completed" value={dashboard?.completedTrips || 0} icon={RouteIcon} color="#2E7D32" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Fuel Cost" value={formatCurrency(dashboard?.totalFuelCost)} icon={LocalGasStationIcon} color="#ED6C02" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard title="Maintenance" value={formatCurrency(dashboard?.totalMaintenanceCost)} icon={BuildIcon} color="#D32F2F" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ ...panelSx }}>
            <CardContent sx={{ py: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography variant="h6" fontWeight={700}>
                  Fuel Analysis by Vehicle
                </Typography>
                <Box sx={{ px: 1.2, py: 0.6, borderRadius: 999, bgcolor: "secondary.main", color: "secondary.contrastText", fontSize: 12, fontWeight: 600 }}>
                  Cost & Volume
                </Box>
              </Stack>
              {fuelChartData.length === 0 ? (
                <Typography color="text.secondary">No fuel data available</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={fuelChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="cost" name="Fuel Cost" fill="#1565C0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="liters" name="Liters" fill="#42A5F5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ ...panelSx }}>
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2.5}>
                Trip Analysis by Vehicle
              </Typography>
              {tripChartData.length === 0 ? (
                <Typography color="text.secondary">No trip data available</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={tripChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="trips" name="Total Trips" fill="#1565C0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="distance" name="Distance (km)" fill="#FF9800" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
