import React, { useState } from "react";
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
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

type SnackbarSeverity = "success" | "error";

const ProjectForm: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [projectManager, setProjectManager] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    if (new Date(endDate) < new Date(startDate)) {
      setSnackbarMessage("End date cannot be earlier than start date.");
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
        `${import.meta.env.VITE_API_BASE}/api/projects/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit project.");
      }

      setProjectName("");
      setProjectDescription("");
      setStartDate("");
      setEndDate("");
      setProjectManager("");
      setStatus("");

      setSnackbarMessage("Project submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      navigate("/admin/projects/all");
    } catch (error: any) {
      setSnackbarMessage(error.message || "Failed to submit project.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
                  Create a New Project
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Fill in the project information and save it to your project
                  portfolio.
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
                    multiline
                    minRows={2}
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
                  <FormControl fullWidth required>
                    <InputLabel>Project Manager</InputLabel>
                    <Select
                      label="Project Manager"
                      value={projectManager}
                      onChange={(e) =>
                        setProjectManager(e.target.value as string)
                      }
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
                      value={status}
                      onChange={(e) => setStatus(e.target.value as string)}
                    >
                      <MenuItem value="Not Started">Not Started</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                  >
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      color="inherit"
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Create Project
                    </Button>
                  </Box>
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
      </Box>
    </Layout>
  );
};

export default ProjectForm;
