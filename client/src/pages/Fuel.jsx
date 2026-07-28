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
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TableSkeleton from "../components/common/TableSkeleton";
import EmptyState from "../components/common/EmptyState";
import useRoleAccess from "../hooks/useRoleAccess";
import { getFuelEntries, addFuel, deleteFuel } from "../services/fuelService";
import { getVehicles } from "../services/vehicleService";
import { getDrivers } from "../services/driverService";
import { formatCurrency, formatDateTime } from "../utils/formatters";

const emptyForm = {
  vehicle: "",
  driver: "",
  liters: "",
  pricePerLiter: "",
  odometer: "",
  fuelStation: "",
};

const Fuel = () => {
  const { canCreate, canDelete } = useRoleAccess("fuel");
  const [entries, setEntries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
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
      const [fuelRes, vehiclesRes, driversRes] = await Promise.all([
        getFuelEntries(),
        getVehicles({ limit: 100 }),
        getDrivers(),
      ]);
      setEntries(fuelRes.data.fuels || []);
      setVehicles(vehiclesRes.data.vehicles || []);
      setDrivers(driversRes.data.drivers || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = entries.filter(
    (f) =>
      f.vehicle?.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
      f.driver?.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.fuelStation?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPreview =
    Number(form.liters || 0) * Number(form.pricePerLiter || 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await addFuel({
        ...form,
        liters: Number(form.liters),
        pricePerLiter: Number(form.pricePerLiter),
        odometer: Number(form.odometer),
      });
      toast.success("Fuel entry added");
      setDialogOpen(false);
      setForm(emptyForm);
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
      await deleteFuel(selected._id);
      toast.success("Fuel entry deleted");
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
        title="Fuel Management"
        subtitle="Track fuel consumption and costs"
        actionLabel={canCreate ? "Add Fuel Entry" : undefined}
        onAction={canCreate ? () => setDialogOpen(true) : undefined}
        actionIcon={<AddIcon />}
      />

      <Card sx={{ mb: 2, p: 2, borderRadius: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search fuel entries..." />
      </Card>

      {loading ? (
        <TableSkeleton cols={7} />
      ) : filtered.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}><EmptyState title="No fuel entries found" /></Card>
      ) : (
        <Card sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Liters</TableCell>
                  <TableCell>Price/L</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Station</TableCell>
                  <TableCell>Date</TableCell>
                  {canDelete && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((f) => (
                  <TableRow key={f._id} hover>
                    <TableCell>{f.vehicle?.vehicleNumber || "—"}</TableCell>
                    <TableCell>{f.driver?.name || "—"}</TableCell>
                    <TableCell>{f.liters} L</TableCell>
                    <TableCell>{formatCurrency(f.pricePerLiter)}</TableCell>
                    <TableCell>{formatCurrency(f.totalCost)}</TableCell>
                    <TableCell>{f.fuelStation}</TableCell>
                    <TableCell>{formatDateTime(f.filledAt)}</TableCell>
                    {canDelete && (
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => { setSelected(f); setDeleteOpen(true); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Fuel Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Vehicle" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} required>
                {vehicles.map((v) => <MenuItem key={v._id} value={v._id}>{v.vehicleNumber}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Driver" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} required>
                {drivers.map((d) => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Liters" type="number" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Price per Liter" type="number" value={form.pricePerLiter} onChange={(e) => setForm({ ...form, pricePerLiter: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Odometer" type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fuel Station" value={form.fuelStation} onChange={(e) => setForm({ ...form, fuelStation: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Estimated Total: <strong>{formatCurrency(totalPreview)}</strong>
              </Typography>
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
        title="Delete Fuel Entry"
        message="Are you sure you want to delete this fuel entry?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={submitting}
      />
    </Box>
  );
};

export default Fuel;
