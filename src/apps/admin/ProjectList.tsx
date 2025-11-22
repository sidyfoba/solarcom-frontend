import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { Edit } from "@mui/icons-material";

interface Project {
  id: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  status: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/projects/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects.");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "grey.100"
              : theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Projects
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                View, edit and manage all your projects.
              </Typography>
            </Box>

            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Divider textAlign="left" sx={{ mb: 2 }}>
                <Chip
                  label="Projects List"
                  color="primary"
                  variant="outlined"
                />
              </Divider>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  component={Link}
                  to="/admin/projects/new"
                  variant="contained"
                >
                  Create New Project
                </Button>
              </Box>

              {/* Loading State */}
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 250,
                  }}
                >
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading projects...</Typography>
                </Box>
              )}

              {/* Error State */}
              {!loading && error && (
                <Typography color="error" textAlign="center" sx={{ py: 2 }}>
                  {error}
                </Typography>
              )}

              {/* Empty State */}
              {!loading && !error && projects.length === 0 && (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  sx={{ py: 3 }}
                >
                  No projects available. Create one to get started.
                </Typography>
              )}

              {/* Projects */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {projects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <Card
                      elevation={3}
                      sx={{
                        p: 1,
                        borderRadius: 3,
                        transition: "0.2s",
                        "&:hover": { boxShadow: 6 },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={600}>
                          {project.projectName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {project.projectDescription}
                        </Typography>

                        <Typography variant="body2">
                          <strong>Start:</strong>{" "}
                          {new Date(project.startDate).toLocaleDateString()}
                        </Typography>

                        <Typography variant="body2">
                          <strong>End:</strong>{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </Typography>

                        <Typography variant="body2">
                          <strong>Manager:</strong> {project.projectManager}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <Chip
                            label={project.status}
                            color={
                              project.status === "active"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                          />
                        </Typography>

                        <Box sx={{ textAlign: "right", mt: 2 }}>
                          <IconButton
                            component={Link}
                            to={`/admin/projects/edit/${project.id}`}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Stack>
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <Alert
            severity="error"
            onClose={handleSnackbarClose}
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default ProjectList;
