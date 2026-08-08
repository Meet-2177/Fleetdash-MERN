import { useEffect, useMemo, useState } from "react";

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
  Alert,
  Button,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import { getVehiclesForMap } from "../services/vehicleService";
import { getGeofences } from "../services/geofenceService";

// ======================================================
// FIX LEAFLET DEFAULT MARKER ICONS
// ======================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ======================================================
// DEFAULT MAP LOCATION
// Ahmedabad
// ======================================================

const DEFAULT_MAP_CENTER = [23.0225, 72.5714];

const DEFAULT_ZOOM = 12;

// ======================================================
// DISTANCE CALCULATION
// Haversine formula
// Returns distance in meters
// ======================================================

const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371000;

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const deltaLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const deltaLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

// ======================================================
// CHECK VALID COORDINATES
// ======================================================

const hasValidCoordinates = (
  latitude,
  longitude
) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// ======================================================
// FORMAT RADIUS
// ======================================================

const formatRadius = (radius) => {
  const value = Number(radius);

  if (!Number.isFinite(value)) {
    return "N/A";
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} km`;
  }

  return `${value} m`;
};

// ======================================================
// LIVE MAP COMPONENT
// ======================================================

const LiveMap = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [vehicles, setVehicles] = useState([]);

  const [geofences, setGeofences] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  // ====================================================
  // LOAD VEHICLES + GEOFENCES
  // ====================================================

  const loadMapData = async (
    showFullLoader = false
  ) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [
        vehicleResponse,
        geofenceResponse,
      ] = await Promise.all([
        getVehiclesForMap(),
        getGeofences(),
      ]);

      const vehicleData =
        vehicleResponse?.data?.vehicles || [];

      const geofenceData =
        geofenceResponse?.data?.geofences || [];

      setVehicles(vehicleData);

      setGeofences(geofenceData);

      setLastUpdated(new Date());
    } catch (err) {
      console.error(
        "Live map loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load live map data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ====================================================
  // INITIAL LOAD + AUTO REFRESH
  // ====================================================

  useEffect(() => {
    loadMapData(true);

    const interval = setInterval(() => {
      loadMapData(false);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ====================================================
  // VEHICLES WITH VALID GPS COORDINATES
  // ====================================================

  const mappedVehicles = useMemo(() => {
    return vehicles.filter((vehicle) =>
      hasValidCoordinates(
        vehicle.latitude,
        vehicle.longitude
      )
    );
  }, [vehicles]);

  // ====================================================
  // ACTIVE GEOFENCES
  // ====================================================

  const activeGeofences = useMemo(() => {
    return geofences.filter(
      (geofence) =>
        geofence.status === "Active" &&
        hasValidCoordinates(
          geofence.latitude,
          geofence.longitude
        ) &&
        Number(geofence.radius) > 0
    );
  }, [geofences]);

  // ====================================================
  // CALCULATE VEHICLE GEOFENCE STATUS
  // ====================================================

  const vehicleStatus = useMemo(() => {
    return mappedVehicles.map((vehicle) => {
      const latitude = Number(
        vehicle.latitude
      );

      const longitude = Number(
        vehicle.longitude
      );

      const matchingGeofences =
        activeGeofences.filter(
          (geofence) => {
            const distance =
              calculateDistance(
                Number(geofence.latitude),
                Number(geofence.longitude),
                latitude,
                longitude
              );

            return (
              distance <=
              Number(geofence.radius)
            );
          }
        );

      return {
        ...vehicle,

        latitude,

        longitude,

        inside:
          matchingGeofences.length > 0,

        geofences: matchingGeofences,
      };
    });
  }, [
    mappedVehicles,
    activeGeofences,
  ]);

  // ====================================================
  // SUMMARY COUNTS
  // ====================================================

  const insideCount =
    vehicleStatus.filter(
      (vehicle) => vehicle.inside
    ).length;

  const outsideCount =
    vehicleStatus.filter(
      (vehicle) => !vehicle.inside
    ).length;

  // ====================================================
  // VEHICLES WITHOUT GPS
  // ====================================================

  const vehiclesWithoutCoordinates =
    vehicles.length -
    mappedVehicles.length;

  // ====================================================
  // MAP CENTER
  // ====================================================

  const mapCenter = useMemo(() => {
    // First preference:
    // Active geofence

    if (activeGeofences.length > 0) {
      return [
        Number(
          activeGeofences[0].latitude
        ),
        Number(
          activeGeofences[0].longitude
        ),
      ];
    }

    // Second preference:
    // Vehicle

    if (vehicleStatus.length > 0) {
      return [
        vehicleStatus[0].latitude,
        vehicleStatus[0].longitude,
      ];
    }

    // Default:
    // Ahmedabad

    return DEFAULT_MAP_CENTER;
  }, [
    activeGeofences,
    vehicleStatus,
  ]);

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <Box>
      {/* ==================================================
          HEADER
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            Live Map
          </Typography>

          <Typography
            color="text.secondary"
          >
            Monitor vehicle locations and
            geofence activity in real time.
          </Typography>

          {lastUpdated && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 1 }}
            >
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          startIcon={
            refreshing ? (
              <CircularProgress
                size={18}
              />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={() =>
            loadMapData(false)
          }
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </Button>
      </Box>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* ==================================================
          NO ACTIVE GEOFENCE WARNING
      ================================================== */}

      {activeGeofences.length === 0 && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
        >
          There are currently no active
          geofences. Create or activate a
          geofence from the Geofence Management
          page.
        </Alert>
      )}

      {/* ==================================================
          VEHICLE GPS WARNING
      ================================================== */}

      {vehiclesWithoutCoordinates > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
        >
          {vehiclesWithoutCoordinates} vehicle
          {vehiclesWithoutCoordinates !== 1
            ? "s"
            : ""}{" "}
          {vehiclesWithoutCoordinates !== 1
            ? "do"
            : "does"}{" "}
          not have valid GPS coordinates and
          cannot be displayed on the map.
        </Alert>
      )}

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        {/* ACTIVE GEOFENCES */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Active Geofences
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {activeGeofences.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* TOTAL VEHICLES */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Vehicles on Map
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {vehicleStatus.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* INSIDE */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
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
            </CardContent>
          </Card>
        </Grid>

        {/* VIOLATIONS */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==================================================
          MAP
      ================================================== */}

      <Box
        sx={{
          height: {
            xs: 450,
            md: 600,
          },

          width: "100%",

          borderRadius: 3,

          overflow: "hidden",

          border: "1px solid",

          borderColor: "divider",

          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {/* ==================================================
              OPEN STREET MAP
          ================================================== */}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ==================================================
              ACTIVE GEOFENCES
          ================================================== */}

          {activeGeofences.map(
            (geofence) => (
              <Circle
                key={geofence._id}
                center={[
                  Number(
                    geofence.latitude
                  ),
                  Number(
                    geofence.longitude
                  ),
                ]}
                radius={Number(
                  geofence.radius
                )}
                pathOptions={{
                  color: "#4f46e5",
                  fillColor: "#4f46e5",
                  fillOpacity: 0.12,
                  weight: 3,
                }}
              >
                <Popup>
                  <Box
                    sx={{
                      minWidth: 180,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                    >
                      {geofence.name}
                    </Typography>

                    {geofence.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {
                          geofence.description
                        }
                      </Typography>
                    )}

                    <Typography
                      variant="body2"
                      sx={{ mt: 1 }}
                    >
                      <strong>
                        Radius:
                      </strong>{" "}
                      {formatRadius(
                        geofence.radius
                      )}
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      <strong>
                        Status:
                      </strong>{" "}
                      {geofence.status}
                    </Typography>
                  </Box>
                </Popup>
              </Circle>
            )
          )}

          {/* ==================================================
              VEHICLE MARKERS
          ================================================== */}

          {vehicleStatus.map(
            (vehicle) => (
              <Marker
                key={vehicle._id}
                position={[
                  vehicle.latitude,
                  vehicle.longitude,
                ]}
              >
                <Popup>
                  <Box
                    sx={{
                      minWidth: 210,
                    }}
                  >
                    {/* VEHICLE NUMBER */}

                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                    >
                      {vehicle.vehicleNumber}
                    </Typography>

                    {/* VEHICLE TYPE */}

                    <Typography
                      variant="body2"
                    >
                      <strong>
                        Type:
                      </strong>{" "}
                      {
                        vehicle.vehicleType
                      }
                    </Typography>

                    {/* BRAND */}

                    <Typography
                      variant="body2"
                    >
                      <strong>
                        Brand:
                      </strong>{" "}
                      {vehicle.brand}
                    </Typography>

                    {/* MODEL */}

                    <Typography
                      variant="body2"
                    >
                      <strong>
                        Model:
                      </strong>{" "}
                      {vehicle.model}
                    </Typography>

                    {/* STATUS */}

                    <Typography
                      variant="body2"
                    >
                      <strong>
                        Status:
                      </strong>{" "}
                      {vehicle.status}
                    </Typography>

                    {/* COORDINATES */}

                    <Typography
                      variant="body2"
                    >
                      <strong>
                        Latitude:
                      </strong>{" "}
                      {vehicle.latitude.toFixed(
                        5
                      )}
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      <strong>
                        Longitude:
                      </strong>{" "}
                      {vehicle.longitude.toFixed(
                        5
                      )}
                    </Typography>

                    {/* GEOFENCE STATUS */}

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

                    {/* MATCHING GEOFENCES */}

                    {vehicle
                      .geofences
                      .length >
                      0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Inside:
                        </Typography>

                        {vehicle.geofences.map(
                          (geofence) => (
                            <Typography
                              key={
                                geofence._id
                              }
                              variant="body2"
                            >
                              •{" "}
                              {
                                geofence.name
                              }
                            </Typography>
                          )
                        )}
                      </Box>
                    )}
                  </Box>
                </Popup>
              </Marker>
            )
          )}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default LiveMap;