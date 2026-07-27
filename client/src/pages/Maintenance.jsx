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
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TableSkeleton from "../components/common/TableSkeleton";
import EmptyState from "../components/common/EmptyState";
import useRoleAccess from "../hooks/useRoleAccess";
import { getMaintenances, addMaintenance, deleteMaintenance } from "../services/maintenanceService";
import { getVehicles } from "../services/vehicleService";
import { MAINTENANCE_STATUSES } from "../utils/constants";
import { formatCurrency, formatDate } from "../utils/formatters";

const emptyForm = {
  vehicle: "",
  serviceType: "",
  description: "",
  nextServiceDate: "",
  cost: "",
  workshop: "",
  status: "Completed",
};

const Maintenance = () => {
  const { canCreate, canDelete } = useRoleAccess("maintenance");
  const [records, setRecords] = useState([]);
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
      const [maintRes, vehiclesRes] = await Promise.all([
        getMaintenances(),
        getVehicles({ limit: 100 }),
      ]);
      setRecords(maintRes.data.maintenances || []);
      setVehicles(vehiclesRes.data.vehicles || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = records.filter(
    (r) =>
      r.vehicle?.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
      r.workshop?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await addMaintenance({
        ...form,
        cost: Number(form.cost),
      });
      toast.success("Maintenance record added");
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
      await deleteMaintenance(selected._id);
      toast.success("Maintenance record deleted");
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
        title="Maintenance"
        subtitle="Track vehicle service records"
        actionLabel={canCreate ? "Add Record" : undefined}
        onAction={canCreate ? () => setDialogOpen(true) : undefined}
        actionIcon={<AddIcon />}
      />

      <Card sx={{ mb: 2, p: 2, borderRadius: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search maintenance records..." />
      </Card>

      {loading ? (
        <TableSkeleton cols={7} />
      ) : filtered.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}><EmptyState title="No maintenance records found" /></Card>
      ) : (
        <Card sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Service Type</TableCell>
                  <TableCell>Workshop</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Next Service</TableCell>
                  <TableCell>Status</TableCell>
                  {canDelete && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell>{r.vehicle?.vehicleNumber || "—"}</TableCell>
                    <TableCell>{r.serviceType}</TableCell>
                    <TableCell>{r.workshop}</TableCell>
                    <TableCell>{formatCurrency(r.cost)}</TableCell>
                    <TableCell>{formatDate(r.serviceDate)}</TableCell>
                    <TableCell>{formatDate(r.nextServiceDate)}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    {canDelete && (
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => { setSelected(r); setDeleteOpen(true); }}>
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
        <DialogTitle>Add Maintenance Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth select label="Vehicle" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} required>
                {vehicles.map((v) => <MenuItem key={v._id} value={v._id}>{v.vehicleNumber}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Service Type" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Workshop" value={form.workshop} onChange={(e) => setForm({ ...form, workshop: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Cost" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Next Service Date" type="date" InputLabelProps={{ shrink: true }} value={form.nextServiceDate} onChange={(e) => setForm({ ...form, nextServiceDate: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {MAINTENANCE_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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
        title="Delete Record"
        message="Are you sure you want to delete this maintenance record?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={submitting}
      />
    </Box>
  );
};

export default Maintenance;
