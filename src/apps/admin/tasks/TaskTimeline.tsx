// src/components/TaskTimeline.js

import React, { useEffect, useState } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "./Timeline.css";
import moment from "moment";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";

const TaskTimeline = () => {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/tasks`
        );
        const tasks = response.data || [];

        const formattedItems = tasks.map((task) => ({
          id: task.id,
          group: 1, // Adjust later if you have real groups (teams, users, etc.)
          title: task.title,
          start_time: moment(task.dueDate).add(0, "hour"),
          end_time: moment(task.dueDate).add(24, "hour"),
          itemProps: {
            onDoubleClick: () => {
              console.log("You double-clicked:", task.title);
              // e.g. navigate to edit page if you want:
              // navigate(`/admin/projects/task/edit/${task.id}`);
            },
            style: {
              background: "#0B6BD9",
              borderRadius: 4,
              border: "1px solid rgba(0,0,0,0.1)",
            },
          },
        }));

        setGroups([
          { id: 1, title: "Tasks" },
          // You can add more groups later if needed
        ]);

        setItems(formattedItems);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setError("Failed to fetch tasks for the timeline.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

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
                Task Timeline
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Visualize your tasks across time to quickly see what’s coming up
                and what’s overdue.
              </Typography>
            </Box>

            {/* Legend */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: -1,
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: 0.75,
                  backgroundColor: "#0B6BD9",
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Task due window
              </Typography>
            </Box>

            {/* Timeline Card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ height: { xs: 400, md: 500 } }}>
                {loading ? (
                  <Box
                    sx={{
                      height: "100%",
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
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    <Typography color="error">{error}</Typography>
                  </Box>
                ) : !groups.length || !items.length ? (
                  <Box
                    sx={{
                      height: "100%",
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
                        this timeline.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Timeline
                    groups={groups}
                    items={items}
                    defaultTimeStart={moment().add(-12, "hour")}
                    defaultTimeEnd={moment().add(12, "hour")}
                  />
                )}
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
};

export default TaskTimeline;
