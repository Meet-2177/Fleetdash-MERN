import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={1} mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Register to manage your fleet
        </Typography>
      </Stack>

      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
        margin="normal"
        helperText="Minimum 6 characters"
      />
      <TextField
        fullWidth
        select
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value={ROLES.MANAGER}>Manager</MenuItem>
        <MenuItem value={ROLES.DRIVER}>Driver</MenuItem>
        <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
      </TextField>

      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, py: 1.2, borderRadius: 3 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
      </Button>

      <Divider sx={{ my: 2.5 }} />
      <Typography variant="body2" align="center">
        Already have an account?{" "}
        <Link component={RouterLink} to="/login" underline="hover">
          Sign In
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
