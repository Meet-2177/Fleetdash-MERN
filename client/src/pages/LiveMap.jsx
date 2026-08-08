import { useEffect } from "react";
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
} from "@mui/material";

// Fix Leaflet marker icons with Vite
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
// DEMO VEHICLES
// --------------------------------------------------

const vehicles = [
  {
    id: 1,
    vehicleNumber: "GJ01AB1234",
    driver: "Meet Patel",
    status: "On Trip",

    // Ahmedabad
    position: [23.0225, 72.5714],

    location: "Ahmedabad",
  },

  {
    id: 2,
    vehicleNumber: "GJ05CD5678",
    driver: "Raj Patel",
    status: "Available",

    // Slightly away from center
    position: [23.055, 72.610],

    location: "Ahmedabad",
  },
];


// --------------------------------------------------
// GEOFENCE CONFIGURATION
// --------------------------------------------------

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

  const deltaLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const deltaLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const vehicleStatus = vehicles.map((vehicle) => {
    const inside = isInsideGeofence(vehicle.position);

    return {
      ...vehicle,
      inside,
    };
  });


  const insideCount = vehicleStatus.filter(
    (vehicle) => vehicle.inside
  ).length;


  const outsideCount = vehicleStatus.filter(
    (vehicle) => !vehicle.inside
  ).length;


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

        <Typography
          color="text.secondary"
        >
          Monitor vehicle locations and geofence activity in real time.
        </Typography>

      </Box>


      {/* ---------------------------------------- */}
      {/* GEOFENCE STATUS CARDS */}
      {/* ---------------------------------------- */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >

        {/* Geofence */}
        <Grid item xs={12} md={4}>

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


        {/* Inside */}
        <Grid item xs={12} md={4}>

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
                Vehicles currently within permitted area
              </Typography>

            </CardContent>
          </Card>

        </Grid>


        {/* Outside */}
        <Grid item xs={12} md={4}>

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
                Vehicles outside permitted area
              </Typography>

            </CardContent>
          </Card>

        </Grid>

      </Grid>


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

          {/* OpenStreetMap */}
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
          {/* VEHICLES */}
          {/* ---------------------------------- */}

          {vehicleStatus.map((vehicle) => (

            <Marker
              key={vehicle.id}
              position={vehicle.position}
            >

              <Popup>

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                >
                  {vehicle.vehicleNumber}
                </Typography>

                <Typography variant="body2">
                  Driver: {vehicle.driver}
                </Typography>

                <Typography variant="body2">
                  Status: {vehicle.status}
                </Typography>

                <Typography variant="body2">
                  Location: {vehicle.location}
                </Typography>

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