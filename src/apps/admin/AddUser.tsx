import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Checkbox,
  Snackbar,
  Alert,
  Container,
  Divider,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Layout from "./Layout";

const AddUser = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<any[]>([]); // still unused / commented block
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
  const [profileId, setProfileId] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]); // still unused / commented block

  const [formError, setFormError] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return true; // don't show error until user types
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const checkLoginExists = async (loginValue: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/check-login`,
        { params: { login: loginValue } }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking login:", error);
      // If error happens, treat as "available" but notify via snackbar
      setSnackbarMessage(
        "Could not validate login uniqueness. Proceeding anyway."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSnackbarMessage("");
    setSubmitting(true);

    if (!login || !password || !confirmPassword || !email) {
      setFormError("All fields are required.");
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setFormError("Invalid email format.");
      setSubmitting(false);
      return;
    }

    const loginExists = await checkLoginExists(login);
    if (loginExists) {
      setFormError("Login already exists.");
      setSubmitting(false);
      return;
    }

    const userData = {
      login,
      password,
      email,
      // roles: selectedRoles,
      // profile: { id: profileId },
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/add`,
        userData
      );

      setSnackbarMessage("User added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset form
      setLogin("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setSelectedRoles([]);
      setProfileId("");
    } catch (error) {
      console.error("Error adding user:", error);
      setSnackbarMessage("An error occurred while adding the user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "grey.100"
              : theme.palette.background.default,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            {/* Header */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Add User
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Create a new application user with login credentials.
            </Typography>

            <Divider textAlign="left" sx={{ my: 3 }}>
              <Chip
                label="Account Details"
                color="primary"
                variant="outlined"
              />
            </Divider>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                label="Login"
                fullWidth
                margin="normal"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!validateEmail(email) && email !== ""}
                helperText={
                  !validateEmail(email) && email !== ""
                    ? "Invalid email format"
                    : ""
                }
                required
              />

              {/* Profile & Roles (kept commented as in original) */}
              {/*
              <FormControl fullWidth margin="normal">
                <InputLabel>Profile</InputLabel>
                <Select
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value as string)}
                  label="Profile"
                  required
                >
                  {profiles.map((profile) => (
                    <MenuItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Roles</InputLabel>
                <Select
                  multiple
                  value={selectedRoles}
                  onChange={(e) =>
                    setSelectedRoles(
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value
                    )
                  }
                  renderValue={(selected) =>
                    (selected as string[]).join(", ")
                  }
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 224, width: 250 } },
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      <Checkbox
                        checked={selectedRoles.indexOf(role.id) > -1}
                      />
                      <ListItemText primary={role.name} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select roles for the user</FormHelperText>
              </FormControl>
              */}

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add User"}
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Layout>
  );
};

export default AddUser;
