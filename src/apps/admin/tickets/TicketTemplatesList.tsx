// src/components/TemplateList.js

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

const TicketTemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/process/ticket/template/all"
        );
        setTemplates(response.data.templates);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (templateId) => {
    navigate(`/admin/projects/ticket/template/edit/${templateId}`);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/admin/process/touble-ticket/template/delete/${templateId}`
        );
        const temps = templates.filter(
          (template) => template.id !== templateId
        );
        setTemplates(temps);
      } catch (err) {
        setError("Failed to delete template");
      }
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 3, width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Template List
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {templates.map((template) => (
                <ListItem key={template.id} divider>
                  <ListItemText
                    primary={template.templateName}
                    secondary={template.description || "No description"}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(template.id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default TicketTemplatesList;
