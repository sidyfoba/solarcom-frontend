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
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const ElementsList = () => {
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
  const [elementToDelete, setElementToDelete] = useState(null);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/admin/infrastructure/element/template/all`
        );
        setTemplates(response.data);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  // Fetch and filter sites based on selected template
  useEffect(() => {
    const fetchElements = async () => {
      if (selectedTemplate) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/admin/infrastructure/element/template/${selectedTemplate}`
          );
          const elementsData = response.data;
          console.log("const siteData = response.data;");
          console.log(response.data);
          // Dynamically generate columns based on the template fields
          const valueColumns = elementsData.fields.map((field) => ({
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
            { field: "elementName", headerName: "Element Name", width: 200 },
            ...valueColumns,
          ]);

          // Fetch sites based on the selected template
          const elementsResponse = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/infrastructure/element/all/${selectedTemplate}`
          );
          const elements = elementsResponse.data;
          console.log("const elements = sitesResponse.data;");
          console.log(elements);

          const formattedRows = elements.map((element) => ({
            id: element.id,
            elementName: element.elementName,
            ...element.values?.reduce((acc, value) => {
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

    fetchElements();
  }, [selectedTemplate]);

  const handleDelete = (id) => {
    setElementToDelete(id);
    setOpenDialog(true);
  };

  // Handle delete action
  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(
  //       `http://localhost:8080/api/infrastructure/element/${id}`
  //     );
  //     setSnackbarMessage("Element deleted successfully.");
  //     setSnackbarSeverity("success");
  //     setSnackbarOpen(true);

  //     // Refresh the data
  //     const updatedRows = rows.filter((row) => row.id !== id);
  //     setRows(updatedRows);
  //   } catch (err) {
  //     setSnackbarMessage("Failed to delete element.");
  //     setSnackbarSeverity("error");
  //     setSnackbarOpen(true);
  //   }
  // };
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

      // Refresh the data
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
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            List of Elements
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

export default ElementsList;
