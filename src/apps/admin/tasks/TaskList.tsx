import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

// Define the types for a task
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  recurrence: string;
  recurrenceValue: number;
}

const statuses = ["not-started", "in-progress", "completed"];

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [titleFilter, setTitleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dueDateFilter, setDueDateFilter] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(
          `${import.meta.env.VITE_API_BASE}/api/tasks`
        );
        setTasks(response.data);
        setFilteredTasks(response.data); // Initialize filteredTasks with fetched tasks
      } catch (err) {
        setError("Failed to fetch tasks");
        setSnackbarMessage("Failed to fetch tasks");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on the current filter criteria
  useEffect(() => {
    let filtered = tasks;

    if (titleFilter) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (dueDateFilter) {
      filtered = filtered.filter((task) =>
        task.dueDate.startsWith(dueDateFilter)
      );
    }

    setFilteredTasks(filtered);
  }, [titleFilter, statusFilter, dueDateFilter, tasks]);

  const handleEditClick = (id: string) => {
    navigate(`/admin/projects/task/edit/${id}`);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setSnackbarMessage("Task deleted successfully");
      setSnackbarSeverity("success");
    } catch (err) {
      setSnackbarMessage("Failed to delete task");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
      <Container component="main" maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Task List
          </Typography>

          {/* Filter Inputs */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                label="Filter by Title"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                type="date"
                label="Filter by Due Date"
                InputLabelProps={{ shrink: true }}
                value={dueDateFilter}
                onChange={(e) => setDueDateFilter(e.target.value)}
              />
            </Grid>
          </Grid>

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Recurrence</TableCell>
                    <TableCell>Recurrence Value</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>
                        {task.recurrence?.charAt(0).toUpperCase() +
                          task.recurrence?.slice(1)}
                      </TableCell>
                      <TableCell>{task.recurrenceValue}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditClick(task.id)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(task.id)}
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
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
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

export default TaskList;
