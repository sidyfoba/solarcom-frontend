import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Layout from "./Layout";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [status, setStatus] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(id);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/projects/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project.");
        }
        const data = await response.json();
        setProjectName(data.projectName);
        setProjectDescription(data.projectDescription);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setProjectManager(data.projectManager);
        setStatus(data.status);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !projectName ||
      !projectDescription ||
      !startDate ||
      !endDate ||
      !projectManager ||
      !status
    ) {
      setSnackbarMessage("Please fill in all fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const projectData = {
      projectName,
      projectDescription,
      startDate,
      endDate,
      projectManager,
      status,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/projects/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      if (response.ok) {
        setSnackbarMessage("Project updated successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // navigate("/"); // Navigate back to the project list
      } else {
        throw new Error("Failed to update project.");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Layout>
        <Typography>Loading project details...</Typography>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography color="error">{error}</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton
              onClick={() => navigate("/admin/projects/all")}
              color="primary"
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" gutterBottom ml={2}>
              Edit Project
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Project Description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Project Manager</InputLabel>
                  <Select
                    label="Project Manager"
                    value={projectManager}
                    onChange={(e) => setProjectManager(e.target.value)}
                    required
                  >
                    <MenuItem value="Manager A">Manager A</MenuItem>
                    <MenuItem value="Manager B">Manager B</MenuItem>
                    <MenuItem value="Manager C">Manager C</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Update Project
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
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
    </Layout>
  );
};

export default ProjectEdit;
