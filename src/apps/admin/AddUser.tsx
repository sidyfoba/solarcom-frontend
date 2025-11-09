import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Layout from "./Layout";

const AddUser = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [profileId, setProfileId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkLoginExists = async (login) => {
    try {
      const response = await axios.get(`/api/users/check-login?login=${login}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking login:", error);
      return false; // Consider the login available if there's an error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!login || !password || !confirmPassword || !email) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    const loginExists = await checkLoginExists(login);
    if (loginExists) {
      setError("Login already exists");
      return;
    }

    const userData = {
      login,
      password,
      email,
      // roles: selectedRoles,
      // profile: { id: profileId },
    };

    axios
      .post("http://localhost:8080/users/add", userData)
      .then((response) => {
        setSuccessMessage("User added successfully!");
        setLogin("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setSelectedRoles([]);
        setProfileId("");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setError("An error occurred while adding the user.");
      });
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
        <Paper sx={{ p: 5 }}>
          <Typography variant="h4" gutterBottom>
            Add User
          </Typography>
          <form onSubmit={handleSubmit}>
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
              error={!!error}
              helperText={error}
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
            {/* Uncomment this section to add profiles and roles selection */}
            {/* 
            <FormControl fullWidth margin="normal">
              <InputLabel>Profile</InputLabel>
              <Select
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
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
                onChange={(e) => setSelectedRoles(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={{
                  PaperProps: { style: { maxHeight: 224, width: 250 } },
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={selectedRoles.indexOf(role.id) > -1} />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select roles for the user</FormHelperText>
            </FormControl>
            */}
            <Button type="submit" variant="contained" color="primary">
              Add User
            </Button>
            {successMessage && (
              <Typography color="green">{successMessage}</Typography>
            )}
          </form>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AddUser;
