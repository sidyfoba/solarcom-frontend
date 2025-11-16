import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Box,
  IconButton,
  Divider,
  Chip,
  Stack,
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

interface TaskFormState {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  recurrence?: Recurrence;
  recurrenceValue?: number;
  parentTaskId?: string;
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

  // <mouse popover>
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  // </mouse popover>

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
        dueDate: selectedDueDate.toISOString(),
        ...(isRecurring
          ? {
              recurrence: formState.recurrence,
              recurrenceValue: formState.recurrenceValue,
            }
          : {}),
      };

      await axios.post(`${import.meta.env.VITE_API_BASE}/api/tasks`, payload);
      setSnackbarMessage("Task created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setFormState({
        title: "",
        description: "",
        dueDate: "",
        status: "not-started",
        actions: [],
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
        <Box sx={{ width: "100%", maxWidth: 900 }}>
          <Stack spacing={2} mb={3}>
            <Typography variant="h4" fontWeight={600}>
              Create Task
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Capture the details of your task, break it into actions, and set
              up its schedule in one place.
            </Typography>
          </Stack>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Task Details */}
              <Stack spacing={3}>
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Task Details"
                      color="primary"
                      variant="outlined"
                    />
                  </Divider>
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
                        placeholder="e.g. Prepare quarterly report"
                        helperText="Give your task a short, descriptive name."
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
                        placeholder="Add more context, links, or notes for this task."
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Actions */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 2 }}>
                    <Chip
                      label="Actions Checklist"
                      color="secondary"
                      variant="outlined"
                    />
                  </Divider>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Break your task into smaller, trackable actions.
                  </Typography>

                  <Box
                    sx={{
                      borderRadius: 2,
                      border: "1px dashed",
                      borderColor: "divider",
                      p: formState.actions?.length ? 2 : 1.5,
                    }}
                  >
                    {formState.actions?.length === 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        No actions yet. Add your first action below.
                      </Typography>
                    )}

                    {formState.actions?.map((action, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        alignItems="center"
                        sx={{
                          mb: 1,
                          pb: 1,
                          borderBottom:
                            index !== formState.actions.length - 1
                              ? "1px solid"
                              : "none",
                          borderColor: "divider",
                        }}
                      >
                        <Grid item xs={12} sm={7}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            label={`Action ${index + 1}`}
                            name="action"
                            value={action.action}
                            onChange={(event) =>
                              handleActionChange(index, event)
                            }
                            placeholder="e.g. Gather data from finance team"
                          />
                        </Grid>
                        <Grid item xs={9} sm={3}>
                          <TextField
                            variant="outlined"
                            select
                            fullWidth
                            label="Status"
                            name="status"
                            value={action.status}
                            onChange={(event) =>
                              handleActionChange(index, event)
                            }
                          >
                            <MenuItem value="todo">To Do</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={3} sm={2} textAlign="right">
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

                    <Box display="flex" alignItems="center" mt={1}>
                      <IconButton
                        aria-label="Add Action"
                        color="primary"
                        onClick={addAction}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                        size="large"
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <Typography variant="body2" color="primary">
                        Add action
                      </Typography>
                      <ReusablePopover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        content="Add a new action to this task"
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Schedule & Recurrence */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Schedule & Recurrence"
                      color="primary"
                      variant="outlined"
                    />
                  </Divider>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
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
                        error={!!dateError}
                        helperText={
                          dateError || "Select the deadline for this task."
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      display="flex"
                      alignItems="center"
                    >
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
                        <Grid item xs={12} sm={4}>
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
                                {option.charAt(0) +
                                  option.slice(1).toLowerCase()}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            variant="outlined"
                            type="number"
                            fullWidth
                            label="Recurrence Value"
                            name="recurrenceValue"
                            value={formState.recurrenceValue ?? ""}
                            onChange={handleChange}
                            InputProps={{ inputProps: { min: 1, step: 1 } }}
                            placeholder="1"
                            required
                            helperText="e.g. every 1 day, 2 weeks, or 3 months."
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>

                {/* Actions */}
                <Box mt={1}>
                  {error && (
                    <Typography color="error" sx={{ mb: 1 }}>
                      {error}
                    </Typography>
                  )}
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Task"}
                    </Button>
                  </Box>
                </Box>
              </Stack>
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
      </Box>
    </Layout>
  );
};

export default TaskCreationForm;
