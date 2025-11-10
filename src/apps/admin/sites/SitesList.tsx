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
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const SitesList = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/admin/infrastructure/site/template/all`
        );
        setTemplates(response.data.datas);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  // Fetch and filter sites based on selected template
  useEffect(() => {
    const fetchSites = async () => {
      if (selectedTemplate) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/admin/infrastructure/site/template/${selectedTemplate}`
          );
          const siteData = response.data;
          console.log("const siteData = response.data;");
          console.log(response.data);
          // Dynamically generate columns based on the template fields
          const valueColumns = siteData.fields.map((field) => ({
            field: field.name,
            headerName:
              field.name.charAt(0).toUpperCase() + field.name.slice(1),
            width: 150,
            type: field.valueType === "Number" ? "number" : "string",
          }));

          setColumns([
            {
              field: "edit",
              headerName: "Edit",
              width: 60,
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
              headerName: "Delete",
              width: 100,
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

          // Fetch sites based on the selected template
          const sitesResponse = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/infrastructure/site/all/${selectedTemplate}`
          );
          const sites = sitesResponse.data;
          console.log("const sites = sitesResponse.data;");
          console.log(sites);

          // Map site data to rows with dynamic fields
          const formattedRows = sites.map((site) => ({
            id: site.id,
            siteName: site.siteName,
            ...site.values?.reduce((acc, value) => {
              acc[value.key] = value.value;
              return acc;
            }, {}),
          }));
          console.log("const formattedRows ");
          console.log(formattedRows);
          setRows(formattedRows);
        } catch (err) {
          setError("Failed to load sites");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSites();
  }, [selectedTemplate]);

  const handleDelete = (id) => {
    setSiteToDelete(id);
    setOpenDialog(true);
  };

  // Handle delete action
  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:8080/api/infrastructure/site/${id}`);
  //     setSnackbarMessage("Site deleted successfully.");
  //     setSnackbarSeverity("success");
  //     setSnackbarOpen(true);

  //     // Refresh the data
  //     const updatedRows = rows.filter((row) => row.id !== id);
  //     setRows(updatedRows);
  //   } catch (err) {
  //     setSnackbarMessage("Failed to delete site.");
  //     setSnackbarSeverity("error");
  //     setSnackbarOpen(true);
  //   }
  // };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/infrastructure/site/${siteToDelete}`
      );
      setSnackbarMessage("Element deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Refresh the data
      const updatedRows = rows.filter((row) => row.id !== siteToDelete);
      setRows(updatedRows);
    } catch (err) {
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
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            List of Sites
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
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
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Paper sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              />
            </Paper>
          )}
        </Paper>
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
      </Box>
    </Layout>
  );
};

export default SitesList;
