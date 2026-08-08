import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import {
  getGeofences,
  createGeofence,
  updateGeofence,
  deleteGeofence,
  toggleGeofenceStatus,
} from "../services/geofenceService";

import useRoleAccess from "../hooks/useRoleAccess";

const emptyForm = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  radius: 5000,
  status: "Active",
};

const Geofences = () => {
  const [geofences, setGeofences] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const {
    canCreate,
    canEdit,
    canDelete,
  } = useRoleAccess("geofences");

  // ==========================================
  // LOAD GEOFENCES
  // ==========================================

  const loadGeofences = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getGeofences();

      setGeofences(
        response.data?.geofences || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load geofences"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGeofences();
  }, []);

  // ==========================================
  // OPEN CREATE
  // ==========================================

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setDialogOpen(true);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleEdit = (geofence) => {
    setEditingId(geofence._id);

    setForm({
      name: geofence.name || "",
      description:
        geofence.description || "",
      latitude: geofence.latitude,
      longitude: geofence.longitude,
      radius: geofence.radius,
      status: geofence.status,
    });

    setError("");
    setSuccess("");
    setDialogOpen(true);
  };

  // ==========================================
  // CLOSE DIALOG
  // ==========================================

  const handleClose = () => {
    if (saving) return;

    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),

        description:
          form.description.trim(),

        latitude: Number(form.latitude),

        longitude: Number(form.longitude),

        radius: Number(form.radius),

        status: form.status,
      };

      if (editingId) {
        await updateGeofence(
          editingId,
          payload
        );

        setSuccess(
          "Geofence updated successfully"
        );
      } else {
        await createGeofence(payload);

        setSuccess(
          "Geofence created successfully"
        );
      }

      await loadGeofences();

      setDialogOpen(false);

      setForm(emptyForm);

      setEditingId(null);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save geofence"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this geofence?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteGeofence(id);

      setSuccess(
        "Geofence deleted successfully"
      );

      await loadGeofences();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete geofence"
      );
    }
  };

  // ==========================================
  // TOGGLE
  // ==========================================

  const handleToggle = async (id) => {
    try {
      setError("");
      setSuccess("");

      await toggleGeofenceStatus(id);

      setSuccess(
        "Geofence status updated"
      );

      await loadGeofences();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update geofence status"
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Box>
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 2,
          mb: 3,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            Geofence Management
          </Typography>

          <Typography color="text.secondary">
            Create and manage geographic
            boundaries for your fleet.
          </Typography>
        </Box>

        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Add Geofence
          </Button>
        )}
      </Box>

      {/* ====================================== */}
      {/* ALERTS */}
      {/* ====================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* ====================================== */}
      {/* LOADING */}
      {/* ====================================== */}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : geofences.length === 0 ? (
        /* ==================================== */
        /* EMPTY STATE */
        /* ==================================== */

        <Card>
          <CardContent
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <LocationOnIcon
              sx={{
                fontSize: 60,
                color: "text.secondary",
                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
            >
              No geofences found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Create your first geofence to
              start monitoring fleet boundaries.
            </Typography>

            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                sx={{ mt: 3 }}
              >
                Create Geofence
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* ==================================== */
        /* GEOFENCE CARDS */
        /* ==================================== */

        <Grid container spacing={2}>
          {geofences.map((geofence) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={geofence._id}
            >
              <Card
                sx={{
                  height: "100%",
                  transition:
                    "transform 0.2s ease",
                  "&:hover": {
                    transform:
                      "translateY(-3px)",
                  },
                }}
              >
                <CardContent>
                  {/* NAME + STATUS */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <LocationOnIcon
                        color="primary"
                      />

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {geofence.name}
                      </Typography>
                    </Box>

                    <Chip
                      label={geofence.status}
                      size="small"
                      color={
                        geofence.status ===
                        "Active"
                          ? "success"
                          : "default"
                      }
                    />
                  </Box>

                  {/* DESCRIPTION */}

                  {geofence.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      {geofence.description}
                    </Typography>
                  )}

                  {/* DETAILS */}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Latitude:</strong>{" "}
                      {Number(
                        geofence.latitude
                      ).toFixed(5)}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Longitude:</strong>{" "}
                      {Number(
                        geofence.longitude
                      ).toFixed(5)}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Radius:</strong>{" "}
                      {geofence.radius >= 1000
                        ? `${(
                            geofence.radius /
                            1000
                          ).toFixed(1)} km`
                        : `${geofence.radius} m`}
                    </Typography>
                  </Box>

                  {/* ACTIONS */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "flex-end",
                      gap: 0.5,
                      mt: 3,
                    }}
                  >
                    {(canEdit ||
                      canCreate) && (
                      <Tooltip
                        title={
                          geofence.status ===
                          "Active"
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        <IconButton
                          color={
                            geofence.status ===
                            "Active"
                              ? "success"
                              : "default"
                          }
                          onClick={() =>
                            handleToggle(
                              geofence._id
                            )
                          }
                        >
                          <PowerSettingsNewIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canEdit && (
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleEdit(
                              geofence
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              geofence._id
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ====================================== */}
      {/* CREATE / EDIT DIALOG */}
      {/* ====================================== */}

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId
            ? "Edit Geofence"
            : "Create Geofence"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Geofence Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={form.latitude}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{
                  step: "any",
                  min: -90,
                  max: 90,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={form.longitude}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{
                  step: "any",
                  min: -180,
                  max: 180,
                }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Radius (meters)"
            name="radius"
            type="number"
            value={form.radius}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{
              min: 100,
            }}
            helperText="Minimum radius: 100 meters"
          />

          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              saving ||
              !form.name ||
              !form.latitude ||
              !form.longitude ||
              !form.radius
            }
          >
            {saving ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : editingId ? (
              "Update Geofence"
            ) : (
              "Create Geofence"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Geofences;