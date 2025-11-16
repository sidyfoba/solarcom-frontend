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
  CircularProgress,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Layout from "./Layout";
import { useNavigate, useParams } from "react-router-dom";

type SnackbarSeverity = "success" | "error";

interface Project {
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  status: string;
}

const ProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project>({
    projectName: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    projectManager: "",
    status: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/projects/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project.");
        }
        const data = await response.json();
        setProject({
          projectName: data.projectName,
          projectDescription: data.projectDescription,
          startDate: data.startDate,
          endDate: data.endDate,
          projectManager: data.projectManager,
          status: data.status,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      projectName,
      projectDescription,
      startDate,
      endDate,
      projectManager,
      status,
    } = project;

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

    if (new Date(endDate) < new Date(startDate)) {
      setSnackbarMessage("End date cannot be earlier than start date.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/projects/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(project),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project.");
      }

      setSnackbarMessage("Project updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/admin/projects/all");
    } catch (err: any) {
      setSnackbarMessage(err.message || "Failed to update project.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate("/admin/projects/all");
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
        <Container maxWidth="md">
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <IconButton onClick={handleBack} color="primary">
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Edit Project
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Update the project details and save your changes.
                </Typography>
              </Box>
            </Stack>

            <Divider textAlign="left" sx={{ mb: 3 }}>
              <Chip
                label="Project Details"
                color="primary"
                variant="outlined"
              />
            </Divider>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 200,
                }}
              >
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading project details...
                </Typography>
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      name="projectName"
                      value={project.projectName}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Project Description"
                      name="projectDescription"
                      value={project.projectDescription}
                      onChange={handleChange}
                      required
                      multiline
                      minRows={2}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Start Date"
                      name="startDate"
                      InputLabelProps={{ shrink: true }}
                      value={project.startDate}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="End Date"
                      name="endDate"
                      InputLabelProps={{ shrink: true }}
                      value={project.endDate}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Project Manager</InputLabel>
                      <Select
                        label="Project Manager"
                        name="projectManager"
                        value={project.projectManager}
                        onChange={handleChange}
                      >
                        <MenuItem value="Manager A">Manager A</MenuItem>
                        <MenuItem value="Manager B">Manager B</MenuItem>
                        <MenuItem value="Manager C">Manager C</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Status"
                        name="status"
                        value={project.status}
                        onChange={handleChange}
                      >
                        <MenuItem value="Not Started">Not Started</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                        gap: 2,
                      }}
                    >
                      <Button
                        onClick={handleBack}
                        variant="outlined"
                        color="inherit"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Update Project"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
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
      </Box>
    </Layout>
  );
};

export default ProjectEdit;
