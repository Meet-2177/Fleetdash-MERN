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
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TableSkeleton from "../components/common/TableSkeleton";
import EmptyState from "../components/common/EmptyState";
import useRoleAccess from "../hooks/useRoleAccess";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  assignVehicle,
  uploadDriverPhoto,
} from "../services/driverService";
import { getVehicles } from "../services/vehicleService";
import { DRIVER_STATUSES } from "../utils/constants";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  licenseNumber: "",
  experience: "",
  address: "",
  status: "Available",
};

const Drivers = () => {
  const { canCreate, canEdit, canDelete } = useRoleAccess("drivers");
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [vehicleId, setVehicleId] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        getDrivers(),
        getVehicles({ limit: 100 }),
      ]);
      setDrivers(driversRes.data.drivers || []);
      setVehicles(vehiclesRes.data.vehicles || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setDialogOpen(true);
  };

  const openEdit = (driver) => {
    setSelected(driver);
    setForm({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      experience: driver.experience,
      address: driver.address,
      status: driver.status,
    });
    setPhotoFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...form, experience: Number(form.experience) };
      let driverId;
      if (selected) {
        const res = await updateDriver(selected._id, payload);
        driverId = res.data.driver._id;
        toast.success("Driver updated");
      } else {
        const res = await createDriver(payload);
        driverId = res.data.driver._id;
        toast.success("Driver created");
      }
      if (photoFile && driverId) {
        const fd = new FormData();
        fd.append("photo", photoFile);
        await uploadDriverPhoto(driverId, fd);
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async () => {
    setSubmitting(true);
    try {
      await assignVehicle(selected._id, vehicleId);
      toast.success("Vehicle assigned");
      setAssignOpen(false);
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
      await deleteDriver(selected._id);
      toast.success("Driver deleted");
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
        title="Drivers"
        subtitle="Manage fleet drivers"
        actionLabel={canCreate ? "Add Driver" : undefined}
        onAction={canCreate ? openCreate : undefined}
        actionIcon={<AddIcon />}
      />

      <Card sx={{ mb: 2, p: 2 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search drivers..." />
      </Card>

      {loading ? (
        <TableSkeleton cols={7} />
      ) : filtered.length === 0 ? (
        <Card><EmptyState title="No drivers found" /></Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>License</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Assigned Vehicle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar src={d.photo} sx={{ width: 36, height: 36 }}>
                          {d.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Box>{d.name}</Box>
                          <Box sx={{ fontSize: 12, color: "text.secondary" }}>{d.email}</Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{d.phone}</TableCell>
                    <TableCell>{d.licenseNumber}</TableCell>
                    <TableCell>{d.experience} yrs</TableCell>
                    <TableCell>{d.assignedVehicle?.vehicleNumber || "—"}</TableCell>
                    <TableCell><StatusBadge status={d.status} /></TableCell>
                    <TableCell align="right">
                      {canEdit && (
                        <>
                          <IconButton size="small" onClick={() => openEdit(d)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="info" onClick={() => { setSelected(d); setVehicleId(d.assignedVehicle?._id || ""); setAssignOpen(true); }}>
                            <LinkIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {canDelete && (
                        <IconButton size="small" color="error" onClick={() => { setSelected(d); setDeleteOpen(true); }}>
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
        <DialogTitle>{selected ? "Edit Driver" : "Add Driver"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[
              { name: "name", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone" },
              { name: "licenseNumber", label: "License Number" },
              { name: "experience", label: "Experience (years)", type: "number" },
              { name: "address", label: "Address" },
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
              <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {DRIVER_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Photo
                <input type="file" hidden accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
              </Button>
              {photoFile && <Box sx={{ mt: 1, fontSize: 13 }}>{photoFile.name}</Box>}
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

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            sx={{ mt: 1 }}
          >
            {vehicles.map((v) => (
              <MenuItem key={v._id} value={v._id}>
                {v.vehicleNumber} — {v.brand} {v.model}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign} disabled={submitting || !vehicleId}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Driver"
        message={`Delete driver ${selected?.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={submitting}
      />
    </Box>
  );
};

export default Drivers;
