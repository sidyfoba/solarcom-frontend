// src/components/SitesDataGrid.js

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Container,
  Stack,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const ElementsList = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false); // for elements loading
  const [templatesLoading, setTemplatesLoading] = useState(true); // for templates dropdown
  const [error, setError] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch templates for dropdown
  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplatesLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/admin/infrastructure/element/template/all`
        );
        setTemplates(response.data || []);
      } catch (err) {
        setError("Failed to load templates");
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Fetch elements based on selected template
  useEffect(() => {
    const fetchElements = async () => {
      if (!selectedTemplate) {
        setRows([]);
        setColumns([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get template metadata to build dynamic columns
        const templateResponse = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/admin/infrastructure/element/template/${selectedTemplate}`
        );
        const templateData = templateResponse.data;

        const valueColumns = (templateData.fields || []).map((field) => ({
          field: field.name,
          headerName: field.name.charAt(0).toUpperCase() + field.name.slice(1),
          flex: 1,
          minWidth: 150,
          type: field.valueType === "Number" ? "number" : "string",
        }));

        setColumns([
          {
            field: "edit",
            headerName: "Edit",
            width: 70,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <IconButton
                color="primary"
                onClick={() =>
                  navigate(
                    `/admin/projects/element/edit-element/${params.row.id}`
                  )
                }
              >
                <EditIcon />
              </IconButton>
            ),
          },
          {
            field: "delete",
            headerName: "Delete",
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <IconButton
                color="secondary"
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
          { field: "id", headerName: "ID", width: 150 },
          { field: "elementName", headerName: "Element Name", width: 220 },
          ...valueColumns,
        ]);

        // Fetch elements for that template
        const elementsResponse = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/infrastructure/element/all/${selectedTemplate}`
        );
        const elements = elementsResponse.data || [];

        const formattedRows = elements.map((element) => ({
          id: element.id,
          elementName: element.elementName,
          ...(element.values || []).reduce((acc, value) => {
            acc[value.key] = value.value;
            return acc;
          }, {}),
        }));

        setRows(formattedRows);
      } catch (err) {
        setError("Failed to load elements");
      } finally {
        setLoading(false);
      }
    };

    fetchElements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const handleDelete = (id) => {
    setElementToDelete(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/infrastructure/element/${elementToDelete}`
      );
      setSnackbarMessage("Element deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      const updatedRows = rows.filter((row) => row.id !== elementToDelete);
      setRows(updatedRows);
    } catch (err) {
      setSnackbarMessage("Failed to delete element.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenDialog(false);
      setElementToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setElementToDelete(null);
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
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Elements
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Select a template to view and manage its elements.
            </Typography>
          </Box>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Divider textAlign="left" sx={{ mb: 3 }}>
                  <Chip
                    label="Filter by Template"
                    color="primary"
                    variant="outlined"
                  />
                </Divider>

                {templatesLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 3,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <FormControl fullWidth>
                    <InputLabel>Template</InputLabel>
                    <Select
                      label="Template"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      required
                    >
                      {templates.map((template) => (
                        <MenuItem key={template.id} value={template.id}>
                          {template.templateName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>

              <Box>
                <Divider textAlign="left" sx={{ mb: 3 }}>
                  <Chip label="Elements" color="secondary" variant="outlined" />
                </Divider>

                {error && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                {!selectedTemplate ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Select a template above to display its elements.
                  </Typography>
                ) : loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 4,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Paper sx={{ height: 600, width: "100%" }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                      disableRowSelectionOnClick
                    />
                  </Paper>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Delete confirmation dialog */}
          <Dialog open={openDialog} onClose={cancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this element?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete}>Cancel</Button>
              <Button onClick={confirmDelete} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

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
        </Container>
      </Box>
    </Layout>
  );
};

export default ElementsList;
