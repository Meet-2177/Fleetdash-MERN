import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

import { getVehicles } from "../services/vehicleService";

// --------------------------------------------------
// FIX LEAFLET MARKER ICONS WITH VITE
// --------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// --------------------------------------------------
// TEMPORARY GEOFENCE CONFIGURATION
// --------------------------------------------------

// Ahmedabad center
const GEO_FENCE_CENTER = [23.0225, 72.5714];

// Radius in meters
const GEO_FENCE_RADIUS = 5000;

// --------------------------------------------------
// DISTANCE CALCULATION
// --------------------------------------------------

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// --------------------------------------------------
// CHECK GEOFENCE
// --------------------------------------------------

const isInsideGeofence = (position) => {
  const distance = calculateDistance(
    GEO_FENCE_CENTER[0],
    GEO_FENCE_CENTER[1],
    position[0],
    position[1]
  );

  return distance <= GEO_FENCE_RADIUS;
};

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

const LiveMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------------
  // SCROLL TO TOP
  // ------------------------------------------------

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ------------------------------------------------
  // LOAD VEHICLES FROM API
  // ------------------------------------------------

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVehicles({
          limit: 100,
        });

        const data = response.data;

        const vehicleList = Array.isArray(data)
          ? data
          : data?.vehicles || [];

        setVehicles(vehicleList);
      } catch (err) {
        console.error(
          "Failed to load vehicles:",
          err
        );

        setError(
          "Unable to load vehicle locations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // ------------------------------------------------
  // PREPARE VEHICLE LOCATIONS
  // ------------------------------------------------

  const vehicleStatus = vehicles
    .filter(
      (vehicle) =>
        vehicle.latitude !== null &&
        vehicle.latitude !== undefined &&
        vehicle.longitude !== null &&
        vehicle.longitude !== undefined
    )
    .map((vehicle) => {
      const position = [
        Number(vehicle.latitude),
        Number(vehicle.longitude),
      ];

      const inside = isInsideGeofence(position);

      return {
        ...vehicle,
        position,
        inside,
      };
    });

  // ------------------------------------------------
  // COUNTS
  // ------------------------------------------------

  const insideCount = vehicleStatus.filter(
    (vehicle) => vehicle.inside
  ).length;

  const outsideCount = vehicleStatus.filter(
    (vehicle) => !vehicle.inside
  ).length;

  // ------------------------------------------------
  // TOTAL VEHICLES WITH GPS
  // ------------------------------------------------

  const trackedVehicleCount =
    vehicleStatus.length;

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <Box>
      {/* ---------------------------------------- */}
      {/* PAGE HEADER */}
      {/* ---------------------------------------- */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
        >
          Live Map
        </Typography>

        <Typography color="text.secondary">
          Monitor vehicle locations and geofence
          activity in real time.
        </Typography>
      </Box>

      {/* ---------------------------------------- */}
      {/* STATUS CARDS */}
      {/* ---------------------------------------- */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        {/* -------------------------------------- */}
        {/* ACTIVE GEOFENCE */}
        {/* -------------------------------------- */}

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Active Geofence
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                Ahmedabad Zone
              </Typography>

              <Chip
                label="Active"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Radius: 5 km
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* -------------------------------------- */}
        {/* TRACKED VEHICLES */}
        {/* -------------------------------------- */}

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Tracked Vehicles
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
                sx={{ mt: 1 }}
              >
                {trackedVehicleCount}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Vehicles with GPS coordinates
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* -------------------------------------- */}
        {/* INSIDE */}
        {/* -------------------------------------- */}

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Vehicles Inside
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
                sx={{ mt: 1 }}
              >
                {insideCount}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Within permitted area
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* -------------------------------------- */}
        {/* OUTSIDE */}
        {/* -------------------------------------- */}

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Geofence Violations
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color={
                  outsideCount > 0
                    ? "error.main"
                    : "success.main"
                }
                sx={{ mt: 1 }}
              >
                {outsideCount}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Outside permitted area
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ---------------------------------------- */}
      {/* LOADING */}
      {/* ---------------------------------------- */}

      {loading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <CircularProgress size={22} />

          <Typography color="text.secondary">
            Loading vehicle locations...
          </Typography>
        </Box>
      )}

      {/* ---------------------------------------- */}
      {/* ERROR */}
      {/* ---------------------------------------- */}

      {error && (
        <Typography
          color="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>
      )}

      {/* ---------------------------------------- */}
      {/* NO GPS VEHICLES */}
      {/* ---------------------------------------- */}

      {!loading &&
        !error &&
        vehicleStatus.length === 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                No vehicles with GPS coordinates
                are available.
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Add latitude and longitude to a
                vehicle from the Vehicles page to
                display it on the map.
              </Typography>
            </CardContent>
          </Card>
        )}

      {/* ---------------------------------------- */}
      {/* MAP */}
      {/* ---------------------------------------- */}

      <Box
        sx={{
          height: 600,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <MapContainer
          center={GEO_FENCE_CENTER}
          zoom={12}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {/* ---------------------------------- */}
          {/* OPEN STREET MAP */}
          {/* ---------------------------------- */}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ---------------------------------- */}
          {/* GEOFENCE */}
          {/* ---------------------------------- */}

          <Circle
            center={GEO_FENCE_CENTER}
            radius={GEO_FENCE_RADIUS}
            pathOptions={{
              color: "#4f46e5",
              fillColor: "#4f46e5",
              fillOpacity: 0.12,
              weight: 3,
            }}
          />

          {/* ---------------------------------- */}
          {/* VEHICLE MARKERS */}
          {/* ---------------------------------- */}

          {vehicleStatus.map((vehicle) => (
            <Marker
              key={vehicle._id}
              position={vehicle.position}
            >
              <Popup>
                {/* Vehicle Number */}

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                >
                  {vehicle.vehicleNumber}
                </Typography>

                {/* Vehicle Type */}

                <Typography variant="body2">
                  Type: {vehicle.vehicleType}
                </Typography>

                {/* Brand */}

                <Typography variant="body2">
                  Brand: {vehicle.brand}
                </Typography>

                {/* Model */}

                <Typography variant="body2">
                  Model: {vehicle.model}
                </Typography>

                {/* Status */}

                <Typography variant="body2">
                  Status: {vehicle.status}
                </Typography>

                {/* Coordinates */}

                <Typography variant="body2">
                  Location:{" "}
                  {Number(vehicle.latitude).toFixed(
                    5
                  )}
                  ,{" "}
                  {Number(vehicle.longitude).toFixed(
                    5
                  )}
                </Typography>

                {/* Geofence Status */}

                <Box sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    label={
                      vehicle.inside
                        ? "Inside Geofence"
                        : "Outside Geofence"
                    }
                    color={
                      vehicle.inside
                        ? "success"
                        : "error"
                    }
                  />
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default LiveMap;