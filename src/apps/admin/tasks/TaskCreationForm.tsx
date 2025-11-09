import React, { useState, ChangeEvent, FormEvent } from "react";
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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReusablePopover from "../ReusablePopover";

enum Recurrence {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

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
const recurrenceOptions = Object.values(Recurrence);

const TaskCreationForm: React.FC = () => {
  const [formState, setFormState] = useState<TaskFormState>({
    title: "",
    description: "",
    dueDate: "",
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
  const [dateError, setDateError] = useState<string | null>(null);

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

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: name === "recurrenceValue" ? Number(value) : value,
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

  const calculateNewDueDate = (
    date: Date,
    recurrence: Recurrence,
    value: number
  ): Date => {
    const newDate = new Date(date);
    switch (recurrence) {
      case Recurrence.DAILY:
        newDate.setDate(newDate.getDate() + value);
        break;
      case Recurrence.WEEKLY:
        newDate.setDate(newDate.getDate() + value * 7);
        break;
      case Recurrence.MONTHLY:
        newDate.setMonth(newDate.getMonth() + value);
        break;
    }
    return newDate;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setDateError(null);

    const currentDate = new Date();
    let selectedDueDate = new Date(formState.dueDate);

    if (isRecurring && formState.recurrence && formState.recurrenceValue) {
      selectedDueDate = calculateNewDueDate(
        selectedDueDate,
        formState.recurrence,
        formState.recurrenceValue
      );
    }

    if (selectedDueDate <= currentDate) {
      setDateError("Due date must be in the future");
      setLoading(false);
      return;
    }

    try {
      const payload: Partial<TaskFormState> = {
        ...formState,
        dueDate: selectedDueDate.toISOString(), // Ensure the date is in ISO format
        ...(isRecurring
          ? {
              recurrence: formState.recurrence,
              recurrenceValue: formState.recurrenceValue,
            }
          : {}),
      };

      await axios.post("http://localhost:8080/tasks", payload);
      setSnackbarMessage("Task created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setFormState({
        title: "",
        description: "",
        dueDate: "",
        status: "not-started",
      });
      setIsRecurring(false);
    } catch (err) {
      setSnackbarMessage("Failed to create task");
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
          <Typography variant="h5" align="center" gutterBottom>
            Create Task
          </Typography>
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
                  label="Due Date and Time"
                  type="date"
                  name="dueDate"
                  InputLabelProps={{ shrink: true }}
                  value={formState.dueDate}
                  onChange={handleChange}
                  error={!!dateError}
                  helperText={dateError}
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
                      value={formState.recurrenceValue}
                      onChange={handleChange}
                      InputProps={{ inputProps: { min: 1, step: 1 } }}
                      placeholder="1"
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
                      {loading ? "Creating..." : "Create Task"}
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

export default TaskCreationForm;
