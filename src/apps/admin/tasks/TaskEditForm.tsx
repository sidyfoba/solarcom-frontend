import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReusablePopover from "../ReusablePopover";

enum Recurrence {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

const recurrenceOptions = Object.values(Recurrence);

interface Action {
  action: string;
  status: "todo" | "done";
  startDate?: string;
  endDate?: string;
}
// Define the types for state
interface TaskFormState {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  recurrence?: Recurrence;
  recurrenceValue?: number;
  parentTaskId?: string; // Optional parent task ID
  actions: Action[];
}

const taskStatuses = ["not-started", "in-progress", "completed"] as const;

const TaskEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formState, setFormState] = useState<TaskFormState>({
    title: "",
    description: "",
    dueDate: "",
    // startDate: "",
    // endDate: "",
    status: "not-started",
    actions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  //<mouse popover>
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  //</mouse popover>
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tasks/${id}`);
        const task = response.data;
        setFormState({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          // startDate: task.startDate,
          // endDate: task.endDate,
          status: task.status,
          recurrence: task.recurrence,
          recurrenceValue: task.recurrenceValue,
          actions: task.actions ? task.actions : [],
        });
        setIsRecurring(!!task.recurrence);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch task details.");
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRecurrenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsRecurring(isChecked);

    if (!isChecked) {
      setFormState((prevState) => ({
        ...prevState,
        recurrence: undefined,
        recurrenceValue: undefined,
      }));
    }
  };

  const handleRecurrenceDropdownChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      recurrence: value as Recurrence,
    }));
  };

  const validateEndDate = () => {
    if (formState.endDate) {
      const today = new Date();
      const endDate = new Date(formState.endDate);
      return endDate <= today;
    }
    return true; // No endDate provided means no validation needed
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEndDate()) {
      setError("End date must be a past date.");
      setLoading(false);
      return;
    }

    try {
      const payload: Partial<TaskFormState> = {
        ...formState,
        ...(isRecurring
          ? {
              recurrence: formState.recurrence,
              recurrenceValue: formState.recurrenceValue,
            }
          : {}),
      };

      await axios.put(`http://localhost:8080/tasks/${id}`, payload);
      setSnackbarMessage("Task updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // navigate("/admin/projects/task/all"); // Redirect to the task list page
    } catch (err) {
      setSnackbarMessage("Failed to update task");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const addAction = () => {
    setFormState((prevState) => ({
      ...prevState,
      actions: [...prevState.actions, { action: "", status: "todo" }],
    }));
  };

  const removeAction = (index: number) => {
    setFormState((prevState) => ({
      ...prevState,
      actions: prevState.actions.filter((_, i) => i !== index),
    }));
  };

  const handleActionChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => {
      const actions = [...prevState.actions];
      actions[index] = { ...actions[index], [name]: value };
      return { ...prevState, actions };
    });
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" align="center" gutterBottom>
              Edit Task
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                {formState.actions?.map((action, index) => (
                  <Grid container spacing={2} key={index} sx={{ p: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Action"
                        name="action"
                        value={action.action}
                        onChange={(event) => handleActionChange(index, event)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={action.status}
                        onChange={(event) => handleActionChange(index, event)}
                      >
                        <MenuItem value="todo">To Do</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </TextField>
                    </Grid>
                    {/* <Grid item xs={6} sm={3}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Start Date"
                        type="datetime-local"
                        name="startDate"
                        InputLabelProps={{ shrink: true }}
                        value={action.startDate || ""}
                        onChange={(event) => handleActionChange(index, event)}
                      />
                    </Grid> */}
                    {/* <Grid item xs={6} sm={3}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="End Date"
                        type="datetime-local"
                        name="endDate"
                        InputLabelProps={{ shrink: true }}
                        value={action.endDate || ""}
                        onChange={(event) => handleActionChange(index, event)}
                      />
                    </Grid> */}
                    <Grid item xs={1}>
                      {/* <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => removeAction(index)}
                        startIcon={<DeleteForeverIcon />}
                      ></Button> */}
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => removeAction(index)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12} sx={{ p: 2 }}>
                <IconButton
                  aria-label="Add Action"
                  color="primary"
                  onClick={addAction}
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
                <ReusablePopover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  content="Add button!"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  InputLabelProps={{ shrink: true }}
                  value={formState.dueDate}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  variant="outlined"
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={formState.status}
                  onChange={handleChange}
                >
                  {taskStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Start Date"
                  type="date"
                  name="startDate"
                  InputLabelProps={{ shrink: true }}
                  value={formState.startDate || ""}
                  onChange={handleChange}
                />
              </Grid> */}
              {/* <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="End Date"
                  type="date"
                  name="endDate"
                  InputLabelProps={{ shrink: true }}
                  value={formState.endDate || ""}
                  onChange={handleChange}
                />
              </Grid> */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRecurring}
                      onChange={handleRecurrenceChange}
                      name="isRecurring"
                    />
                  }
                  label="Recurring Task"
                />
              </Grid>
              {isRecurring && (
                <>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      variant="outlined"
                      select
                      fullWidth
                      label="Recurrence"
                      name="recurrence"
                      value={formState.recurrence || ""}
                      required
                      onChange={handleRecurrenceDropdownChange}
                    >
                      {recurrenceOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.charAt(0) + option.slice(1).toLowerCase()}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      variant="outlined"
                      type="number"
                      fullWidth
                      label="Recurrence Value"
                      name="recurrenceValue"
                      value={formState.recurrenceValue ?? 1} // Default value to ensure input is controlled
                      onChange={handleChange}
                      InputProps={{ inputProps: { min: 1, step: 1 } }}
                      placeholder="1" // Placeholder to guide user
                      required
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={12}>
                <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Grid item xs={12} sm={3}>
                    {error && <Typography color="error">{error}</Typography>}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Task"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
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
      </Box>
    </Layout>
  );
};

export default TaskEditForm;
