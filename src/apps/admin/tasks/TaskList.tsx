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
  Box,
  Stack,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(
          `${import.meta.env.VITE_API_URL}/api/tasks`
        );
        setTasks(response.data);
        setFilteredTasks(response.data);
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`);
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

  const getStatusChipColor = (
    status: string
  ): "default" | "success" | "warning" | "info" => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "not-started":
      default:
        return "default";
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString();
  };

  const formatRecurrence = (recurrence: string) => {
    if (!recurrence) return "-";
    return recurrence.charAt(0) + recurrence.slice(1).toLowerCase();
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "grey.100"
              : theme.palette.background.default,
          py: { xs: 3, md: 4 },
        }}
      >
        <Container component="main" maxWidth="lg">
          <Stack spacing={3}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Task List
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View, filter, and manage all your tasks.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate("/admin/projects/task/create")}
              >
                New Task
              </Button>
            </Box>

            {/* Filters */}
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    label="Filter by Title"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    placeholder="Search by title"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
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
                    size="small"
                    type="date"
                    label="Filter by Due Date"
                    InputLabelProps={{ shrink: true }}
                    value={dueDateFilter}
                    onChange={(e) => setDueDateFilter(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Table / content */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ py: 4 }}>
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                </Box>
              ) : filteredTasks.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center", px: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    No tasks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Try adjusting your filters or create a new task.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/admin/projects/task/create")}
                  >
                    Create your first task
                  </Button>
                </Box>
              ) : isMobile ? (
                /* MOBILE: CARD LAYOUT */
                <Box sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    {filteredTasks.map((task) => (
                      <Paper
                        key={task.id}
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{
                                  wordBreak: "break-word",
                                }}
                              >
                                {task.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 0.5,
                                  wordBreak: "break-word",
                                }}
                              >
                                {task.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={
                                task.status.charAt(0).toUpperCase() +
                                task.status.slice(1)
                              }
                              size="small"
                              color={getStatusChipColor(task.status)}
                              variant={
                                task.status === "not-started"
                                  ? "outlined"
                                  : "filled"
                              }
                            />
                          </Box>

                          <Stack
                            direction="row"
                            spacing={2}
                            flexWrap="wrap"
                            rowGap={1}
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Due date
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(task.dueDate)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Recurrence
                              </Typography>
                              <Typography variant="body2">
                                {formatRecurrence(task.recurrence)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Value
                              </Typography>
                              <Typography variant="body2">
                                {task.recurrenceValue || "-"}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick(task.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(task.id)}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              ) : (
                /* DESKTOP / TABLET: TABLE LAYOUT */
                <TableContainer
                  sx={{
                    maxHeight: { xs: 420, md: 540 },
                    overflowX: "auto",
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: (theme) =>
                            theme.palette.mode === "light"
                              ? "grey.100"
                              : "background.default",
                        }}
                      >
                        <TableCell sx={{ minWidth: 160 }}>Title</TableCell>
                        <TableCell sx={{ minWidth: 220 }}>
                          Description
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Due Date</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Recurrence</TableCell>
                        <TableCell sx={{ minWidth: 120 }} align="right">
                          Recurrence Value
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }} align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TableRow
                          key={task.id}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 500,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                              title={task.title}
                            >
                              {task.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                              title={task.description}
                            >
                              {task.description}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDate(task.dueDate)}</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                task.status.charAt(0).toUpperCase() +
                                task.status.slice(1)
                              }
                              size="small"
                              color={getStatusChipColor(task.status)}
                              variant={
                                task.status === "not-started"
                                  ? "outlined"
                                  : "filled"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {formatRecurrence(task.recurrence)}
                          </TableCell>
                          <TableCell align="right">
                            {task.recurrenceValue || "-"}
                          </TableCell>
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => handleEditClick(task.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(task.id)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>

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
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
};

export default TaskList;
