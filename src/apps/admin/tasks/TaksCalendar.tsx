// src/components/TaksCalendar.js

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Layout from "../Layout";
import {
  Box,
  Paper,
  Typography,
  Container,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
} from "@mui/material";

const localizer = momentLocalizer(moment);

const TaksCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW: track the currently displayed date in the calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/tasks`
        );
        const tasks = response.data || [];

        const calendarEvents = tasks.map((task) => ({
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          id: task.id,
          status: task.status,
        }));

        setEvents(calendarEvents);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setError("Failed to fetch tasks for the calendar.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleSaveEvent = () => {
    // Only updates local calendar state, not the backend.
    setEvents((prev) =>
      prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
    );
    setSelectedEvent(null);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const handleChange = (e) => {
    if (!selectedEvent) return;
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      setSelectedEvent((prev) => ({
        ...prev,
        [name]: new Date(value),
      }));
    } else {
      setSelectedEvent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.status) {
      case "completed":
        backgroundColor = "#00473F"; // green
        break;
      case "not-started":
        backgroundColor = "#FFC745"; // yellow
        break;
      case "in-progress":
        backgroundColor = "#1671FA"; // blue
        break;
      default:
        backgroundColor = "gray";
    }

    return {
      style: {
        backgroundColor,
        color: "black",
        borderRadius: 6,
        opacity: 0.9,
        display: "block",
        border: "1px solid rgba(0,0,0,0.1)",
      },
    };
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
                Task Calendar
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                See all your tasks laid out on a calendar for a quick overview
                of busy days and upcoming deadlines.
              </Typography>

              {/* NEW: show month + year currently being viewed in the calendar */}
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Viewing: {moment(currentDate).format("MMMM YYYY")}
              </Typography>
            </Box>

            {/* Legend */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: 0.75,
                    bgcolor: "#FFC745",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Not started
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: 0.75,
                    bgcolor: "#1671FA",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  In progress
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: 0.75,
                    bgcolor: "#00473F",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Stack>
            </Stack>

            {/* Calendar Card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    height: 480,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box
                  sx={{
                    height: 480,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Typography color="error">{error}</Typography>
                </Box>
              ) : events.length === 0 ? (
                <Box
                  sx={{
                    height: 480,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      No tasks to display
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Once you create tasks with due dates, they’ll appear on
                      this calendar.
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  style={{ height: 480 }}
                  // NEW: keep calendar's internal date in sync so we can show the correct year
                  date={currentDate}
                  onNavigate={(date) => setCurrentDate(date)}
                />
              )}
            </Paper>
          </Stack>

          {/* Edit Event Modal */}
          <Dialog
            open={!!selectedEvent}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Edit Task</DialogTitle>
            {selectedEvent && (
              <>
                <DialogContent sx={{ pt: 1 }}>
                  <Stack spacing={2} mt={1}>
                    <TextField
                      label="Title"
                      name="title"
                      fullWidth
                      value={selectedEvent.title}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Start"
                      name="start"
                      type="datetime-local"
                      fullWidth
                      value={moment(selectedEvent.start).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="End"
                      name="end"
                      type="datetime-local"
                      fullWidth
                      value={moment(selectedEvent.end).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      name="status"
                      value={selectedEvent.status || ""}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select status
                      </option>
                      <option value="not-started">Not started</option>
                      <option value="in-progress">In progress</option>
                      <option value="completed">Completed</option>
                    </TextField>
                    <Typography variant="caption" color="text.secondary">
                      Changes are applied locally to the calendar view. Hook
                      this up to your API if you want to persist changes.
                    </Typography>
                  </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEvent}
                  >
                    Save
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default TaksCalendar;
