import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Layout from "../Layout";
import { Box, Paper } from "@mui/material";

const localizer = momentLocalizer(moment);

const TaksCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/tasks`
        );
        const tasks = response.data;

        // Transform task data to fit calendar format
        const calendarEvents = tasks.map((task) => ({
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          id: task.id,
          status: task.status, // Include status in the event data
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleSaveEvent = () => {
    // Update the event in the events array
    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id ? selectedEvent : event
      )
    );
    setSelectedEvent(null);
  };

  const handleChange = (e) => {
    setSelectedEvent({ ...selectedEvent, [e.target.name]: e.target.value });
  };

  // Define a function to apply custom styles based on event status
  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.status) {
      case "completed":
        backgroundColor = "#00473F"; //green
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
        color: "black", // Set text color to black
        borderRadius: "0px",
        opacity: 0.8,
        display: "block",
      },
    };
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <div>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter} // Apply custom styles
              style={{ height: 500 }}
            />
            {selectedEvent && (
              <div className="event-modal">
                <h2>Edit Task</h2>
                <input
                  type="text"
                  name="title"
                  value={selectedEvent.title}
                  onChange={handleChange}
                  placeholder="Task Title"
                />
                <input
                  type="datetime-local"
                  name="start"
                  value={moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")}
                  onChange={handleChange}
                />
                <input
                  type="datetime-local"
                  name="end"
                  value={moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")}
                  onChange={handleChange}
                />
                <button onClick={handleSaveEvent}>Save</button>
                <button onClick={() => setSelectedEvent(null)}>Cancel</button>
              </div>
            )}
          </div>
        </Paper>
      </Box>
    </Layout>
  );
};

export default TaksCalendar;
