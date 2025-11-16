import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";

interface JobPosition {
  id?: number;
  title: string;
  description: string;
}

const JobPositionList: React.FC = () => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [filteredJobPositions, setFilteredJobPositions] = useState<
    JobPosition[]
  >([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentJobPosition, setCurrentJobPosition] = useState<JobPosition>({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobPosition | null>(null);

  // Fetch job positions
  useEffect(() => {
    fetchJobPositions();
  }, []);

  // Filter list whenever filter or data changes
  useEffect(() => {
    setFilteredJobPositions(
      jobPositions.filter((position) =>
        position.title.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, jobPositions]);

  const fetchJobPositions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/hr/job-positions`
      );
      setJobPositions(response.data || []);
      setFilteredJobPositions(response.data || []);
      setError(null);
    } catch (err) {
      setError("Error fetching job positions");
      setSnackbarMessage("Error fetching job positions");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (jobPosition?: JobPosition) => {
    setCurrentJobPosition(
      jobPosition || {
        title: "",
        description: "",
      }
    );
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (!currentJobPosition.title || !currentJobPosition.description) {
        setSnackbarMessage("Title and Description are required");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      setLoading(true);

      if (currentJobPosition.id) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE}/api/hr/job-positions/${
            currentJobPosition.id
          }`,
          currentJobPosition
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/hr/job-positions`,
          currentJobPosition
        );
      }

      await fetchJobPositions();
      handleDialogClose();
      setSnackbarMessage("Job position saved successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Error saving job position");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (position: JobPosition) => {
    setJobToDelete(position);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete?.id) return;
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/hr/job-positions/${
          jobToDelete.id
        }`
      );
      await fetchJobPositions();
      setSnackbarMessage("Job position deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Error deleting job position");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
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
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Job Positions
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage available job positions, update descriptions and add new
                roles.
              </Typography>
            </Box>

            {/* Main card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Divider
                  sx={{ flexGrow: 1, mr: { md: 2 } }}
                  textAlign="left"
                  variant="fullWidth"
                >
                  <Chip
                    label="Job Position List"
                    color="primary"
                    variant="outlined"
                  />
                </Divider>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDialogOpen()}
                >
                  Add Job Position
                </Button>
              </Box>

              {/* Filter */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Filter by Job Title"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Table / Loading / Empty / Error */}
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 240,
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading job positions...
                  </Typography>
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : filteredJobPositions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No job positions found. Create a new job position to get
                  started.
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Description
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, width: 180 }}
                          align="right"
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredJobPositions.map((position) => (
                        <TableRow key={position.id}>
                          <TableCell>{position.title}</TableCell>
                          <TableCell>{position.description}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleDialogOpen(position)}
                              sx={{ mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(position)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Stack>

          {/* Add / Edit dialog */}
          <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
            <DialogTitle>
              {currentJobPosition.id ? "Edit Job Position" : "Add Job Position"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                type="text"
                fullWidth
                value={currentJobPosition.title}
                onChange={(e) =>
                  setCurrentJobPosition((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={currentJobPosition.description}
                onChange={(e) =>
                  setCurrentJobPosition((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {currentJobPosition.id ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete the job position{" "}
                <strong>{jobToDelete?.title}</strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
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

export default JobPositionList;
