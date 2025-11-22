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
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Container,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SitesList = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [loading, setLoading] = useState(false); // loading for sites
  const [error, setError] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/infrastructure/site/template/all`
        );
        setTemplates(response.data.datas || []);
      } catch (err) {
        setError("Failed to load templates");
        setSnackbarMessage("Failed to load templates");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Fetch and filter sites based on selected template
  useEffect(() => {
    const fetchSites = async () => {
      if (!selectedTemplate) {
        setRows([]);
        setColumns([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get template definition
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/infrastructure/site/template/${selectedTemplate}`
        );
        const siteData = response.data;

        // Dynamically generate columns based on the template fields
        const valueColumns = (siteData.fields || []).map((field) => ({
          field: field.name,
          headerName: field.name.charAt(0).toUpperCase() + field.name.slice(1),
          width: 150,
          type: field.valueType === "Number" ? "number" : "string",
        }));

        setColumns([
          {
            field: "edit",
            headerName: "",
            width: 60,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <IconButton
                color="primary"
                onClick={() =>
                  navigate(`/admin/projects/site/edit-site/${params.row.id}`)
                }
              >
                <EditIcon />
              </IconButton>
            ),
          },
          {
            field: "delete",
            headerName: "",
            width: 60,
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
          { field: "siteName", headerName: "Site Name", width: 200 },
          ...valueColumns,
        ]);

        // Fetch sites for this template
        const sitesResponse = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/infrastructure/site/all/${selectedTemplate}`
        );
        const sites = sitesResponse.data || [];

        // Map site data to rows with dynamic fields
        const formattedRows = sites.map((site) => ({
          id: site.id,
          siteName: site.siteName,
          ...(site.values || []).reduce((acc, value) => {
            acc[value.key] = value.value;
            return acc;
          }, {}),
        }));

        setRows(formattedRows);
      } catch (err) {
        console.error(err);
        setError("Failed to load sites");
        setSnackbarMessage("Failed to load sites");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const handleDelete = (id) => {
    setSiteToDelete(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/infrastructure/site/${siteToDelete}`
      );
      setSnackbarMessage("Element deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Refresh the data in-place
      const updatedRows = rows.filter((row) => row.id !== siteToDelete);
      setRows(updatedRows);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to delete element.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenDialog(false);
      setSiteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setSiteToDelete(null);
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
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Sites
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Filter and manage sites created from your templates. Use the
              actions to edit or delete individual entries.
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
              <Stack spacing={3}>
                {/* Template filter */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Filter by Template"
                      color="primary"
                      variant="outlined"
                    />
                  </Divider>

                  <FormControl fullWidth disabled={templatesLoading}>
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

                  {templatesLoading && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Loading templates...
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Sites grid */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip label="Sites" color="secondary" variant="outlined" />
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
                      Select a template to view its associated sites.
                    </Typography>
                  ) : loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 300,
                      }}
                    >
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading sites...
                      </Typography>
                    </Box>
                  ) : rows.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      No sites found for this template.
                    </Typography>
                  ) : (
                    <Paper
                      variant="outlined"
                      sx={{ height: 600, width: "100%" }}
                    >
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
      </Box>
    </Layout>
  );
};

export default SitesList;
