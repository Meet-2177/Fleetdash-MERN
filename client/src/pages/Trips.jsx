import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TableSkeleton from "../components/common/TableSkeleton";
import EmptyState from "../components/common/EmptyState";
import useRoleAccess from "../hooks/useRoleAccess";
import { getTrips, createTrip, updateTrip, deleteTrip } from "../services/tripService";
import { getDrivers } from "../services/driverService";
import { getVehicles } from "../services/vehicleService";
import { TRIP_STATUSES } from "../utils/constants";
import { formatDateTime } from "../utils/formatters";

const emptyForm = {
  driver: "",
  vehicle: "",
  source: "",
  destination: "",
  distance: "",
  cargo: "",
  status: "Pending",
};

const Trips = () => {
  const { canCreate, canEdit, canDelete } = useRoleAccess("trips");
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tripsRes, driversRes, vehiclesRes] = await Promise.all([
        getTrips(),
        getDrivers(),
        getVehicles({ limit: 100 }),
      ]);
      setTrips(tripsRes.data.trips || []);
      setDrivers(driversRes.data.drivers || []);
      setVehicles(vehiclesRes.data.vehicles || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = trips.filter(
    (t) =>
      t.source.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.driver?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (trip) => {
    setSelected(trip);
    setForm({
      driver: trip.driver?._id || trip.driver,
      vehicle: trip.vehicle?._id || trip.vehicle,
      source: trip.source,
      destination: trip.destination,
      distance: trip.distance,
      cargo: trip.cargo || "",
      status: trip.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...form, distance: Number(form.distance) };
      if (selected) {
        await updateTrip(selected._id, payload);
        toast.success("Trip updated");
      } else {
        await createTrip(payload);
        toast.success("Trip created");
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteTrip(selected._id);
      toast.success("Trip deleted");
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Trips"
        subtitle="Manage fleet trips"
        actionLabel={canCreate ? "Create Trip" : undefined}
        onAction={canCreate ? openCreate : undefined}
        actionIcon={<AddIcon />}
      />

      <Card sx={{ mb: 2, p: 2 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search trips..." />
      </Card>

      {loading ? (
        <TableSkeleton cols={8} />
      ) : filtered.length === 0 ? (
        <Card><EmptyState title="No trips found" /></Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Route</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Distance</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell>{t.source} → {t.destination}</TableCell>
                    <TableCell>{t.driver?.name || "—"}</TableCell>
                    <TableCell>{t.vehicle?.vehicleNumber || "—"}</TableCell>
                    <TableCell>{t.distance} km</TableCell>
                    <TableCell>{t.cargo || "—"}</TableCell>
                    <TableCell>{formatDateTime(t.startTime)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell align="right">
                      {canEdit && (
                        <IconButton size="small" onClick={() => openEdit(t)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton size="small" color="error" onClick={() => { setSelected(t); setDeleteOpen(true); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? "Edit Trip" : "Create Trip"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Driver" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} required>
                {drivers.map((d) => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Vehicle" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} required>
                {vehicles.map((v) => <MenuItem key={v._id} value={v._id}>{v.vehicleNumber}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Distance (km)" type="number" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Cargo" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {TRIP_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Trip"
        message="Are you sure you want to delete this trip?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={submitting}
      />
    </Box>
  );
};

export default Trips;
