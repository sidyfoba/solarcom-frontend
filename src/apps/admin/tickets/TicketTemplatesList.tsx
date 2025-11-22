// src/components/TicketTemplatesList.js

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
  Container,
  Stack,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

const TicketTemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/process/ticket/template/all`
        );
        // API returns `templates` for tickets
        setTemplates(response.data.templates || []);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load templates");
        setSnackbarMessage("Failed to load templates");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (templateId) => {
    navigate(`/admin/projects/ticket/template/edit/${templateId}`);
  };

  const handleDeleteClick = (templateId) => {
    setTemplateToDelete(templateId);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/process/touble-ticket/template/delete/${templateToDelete}`
      );
      const temps = templates.filter(
        (template) => template.id !== templateToDelete
      );
      setTemplates(temps);
      setSnackbarMessage("Template deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setError("Failed to delete template");
      setSnackbarMessage("Failed to delete template.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenDialog(false);
      setTemplateToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setTemplateToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Ticket Templates
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Browse, edit, and delete ticket templates used to create tickets
              from predefined structures.
            </Typography>
          </Box>

          <Stack spacing={3}>
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Divider textAlign="left" sx={{ mb: 3 }}>
                <Chip
                  label="Template List"
                  color="primary"
                  variant="outlined"
                />
              </Divider>

              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading templates...
                  </Typography>
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : templates.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No ticket templates found. Create a new ticket template to get
                  started.
                </Typography>
              ) : (
                <List>
                  {templates.map((template) => (
                    <ListItem key={template.id} divider alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight={500}>
                            {template.templateName}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {template.description || "No description"}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(template.id)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteClick(template.id)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>

            {/* Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Stack>
        </Container>

        {/* Delete confirmation dialog */}
        <Dialog open={openDialog} onClose={cancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this ticket template?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button onClick={confirmDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default TicketTemplatesList;
