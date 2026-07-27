import { useCallback, useEffect, useState } from "react";
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
  TablePagination,
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
import useDebounce from "../hooks/useDebounce";
import useRoleAccess from "../hooks/useRoleAccess";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";
import {
  VEHICLE_TYPES,
  FUEL_TYPES,
  VEHICLE_STATUSES,
} from "../utils/constants";

const emptyForm = {
  vehicleNumber: "",
  vehicleType: "Truck",
  brand: "",
  model: "",
  capacity: "",
  fuelType: "Diesel",
  status: "Available",
};

const Vehicles = () => {
  const { canCreate, canEdit, canDelete } = useRoleAccess("vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getVehicles({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch,
        status: statusFilter,
      });
      setVehicles(data.vehicles || []);
      setTotal(data.totalVehicles || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (vehicle) => {
    setSelected(vehicle);
    setForm({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      capacity: vehicle.capacity,
      fuelType: vehicle.fuelType,
      status: vehicle.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (selected) {
        await updateVehicle(selected._id, payload);
        toast.success("Vehicle updated");
      } else {
        await createVehicle(payload);
        toast.success("Vehicle created");
      }
      setDialogOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteVehicle(selected._id);
      toast.success("Vehicle deleted");
      setDeleteOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Vehicles"
        subtitle="Manage fleet vehicles"
        actionLabel={canCreate ? "Add Vehicle" : undefined}
        onAction={canCreate ? openCreate : undefined}
        actionIcon={<AddIcon />}
      />

      <Card sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search vehicles..." />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {VEHICLE_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Card>

      {loading ? (
        <TableSkeleton cols={7} />
      ) : vehicles.length === 0 ? (
        <Card><EmptyState title="No vehicles found" actionLabel={canCreate ? "Add Vehicle" : undefined} onAction={canCreate ? openCreate : undefined} /></Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v._id} hover>
                    <TableCell>{v.vehicleNumber}</TableCell>
                    <TableCell>{v.vehicleType}</TableCell>
                    <TableCell>{v.brand}</TableCell>
                    <TableCell>{v.model}</TableCell>
                    <TableCell>{v.capacity}</TableCell>
                    <TableCell><StatusBadge status={v.status} /></TableCell>
                    <TableCell align="right">
                      {canEdit && (
                        <IconButton size="small" onClick={() => openEdit(v)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton size="small" color="error" onClick={() => { setSelected(v); setDeleteOpen(true); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[
              { name: "vehicleNumber", label: "Vehicle Number" },
              { name: "brand", label: "Brand" },
              { name: "model", label: "Model" },
              { name: "capacity", label: "Capacity", type: "number" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  required
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Type" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>
                {VEHICLE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Fuel Type" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>
                {FUEL_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {VEHICLE_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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
        title="Delete Vehicle"
        message={`Delete vehicle ${selected?.vehicleNumber}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={submitting}
      />
    </Box>
  );
};

export default Vehicles;
