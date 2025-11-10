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

  // Fetch job positions from the server
  useEffect(() => {
    fetchJobPositions();
  }, []);

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
      setJobPositions(response.data);
      setFilteredJobPositions(response.data); // Initialize filtered positions
    } catch (error) {
      setSnackbarMessage("Error fetching job positions");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setError("Error fetching job positions");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (jobPosition?: JobPosition) => {
    setCurrentJobPosition(jobPosition || { title: "", description: "" });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!currentJobPosition.title || !currentJobPosition.description) {
        setSnackbarMessage("Title and Description are required");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

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

      fetchJobPositions();
      handleDialogClose();
      setSnackbarMessage("Job position saved successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error saving job position");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/hr/job-positions/${id}`
      );
      fetchJobPositions();
      setSnackbarMessage("Job position deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error deleting job position");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container component="main" maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Job list
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDialogOpen()}
            sx={{ marginBottom: 2 }}
          >
            Add Job Position
          </Button>
          {/* Filter Inputs */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                label="Filter by Job Title"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredJobPositions.length > 0 ? (
                      filteredJobPositions.map((position) => (
                        <TableRow key={position.id}>
                          <TableCell>{position.title}</TableCell>
                          <TableCell>{position.description}</TableCell>

                          <TableCell>
                            <Button
                              variant="outlined"
                              onClick={() => handleDialogOpen(position)}
                              sx={{ mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(position.id!)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <Typography variant="body1" align="center">
                        No job positions found.
                      </Typography>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Dialog open={openDialog} onClose={handleDialogClose}>
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
                  setCurrentJobPosition({
                    ...currentJobPosition,
                    title: e.target.value,
                  })
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
                  setCurrentJobPosition({
                    ...currentJobPosition,
                    description: e.target.value,
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {currentJobPosition.id ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>

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
        </Paper>
      </Container>
    </Layout>
  );
};

export default JobPositionList;
