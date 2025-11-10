// src/components/TaskTimeline.js

import React, { useEffect, useState } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "./Timeline.css";
import moment from "moment";
import { Box, Paper } from "@mui/material";
import axios from "axios";
import { blue } from "@mui/material/colors";
import Layout from "../Layout";

const TaskTimeline = () => {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/tasks`
        );
        const tasks = response.data;

        // Assuming all tasks belong to a single group for simplicity
        // Adjust as needed if tasks belong to different groups

        // Transform task data to fit react-calendar-timeline format
        const formattedItems = tasks.map((task) => ({
          id: task.id,
          group: 1, // Use task.group if tasks have different groups
          title: task.title,
          start_time: moment(task.dueDate).add(0, "hour"),
          //     end_time: moment().add(3, "hour"),,
          end_time: moment(task.dueDate).add(24, "hour"),
          itemProps: {
            onDoubleClick: () => {
              console.log("You clicked double!");
            },

            style: {
              background: "#0B6BD9", //blue
            },
          },
        }));

        // Define groups (you can customize this as needed)
        setGroups([
          { id: 1, title: "equipe 1" },
          { id: 2, title: "n/a" },
        ]);

        setItems(formattedItems);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ height: "500px" }}>
            {groups.length != 0 && items.length != 0 && (
              <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment().add(-12, "hour")}
                defaultTimeEnd={moment().add(12, "hour")}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default TaskTimeline;
