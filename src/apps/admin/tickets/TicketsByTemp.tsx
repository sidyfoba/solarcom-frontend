// src/components/Tickets.js

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
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TicketsByTemp = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/process/ticket/template/all"
        );
        setTemplates(response.data.templates);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  // Fetch tickets based on selected template
  useEffect(() => {
    if (!selectedTemplate) return; // Do nothing if no template is selected

    const fetchTickets = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `http://localhost:8080/api/admin/process/ticket/template/${selectedTemplate}`
        );
        const ticketsData = response.data;
        console.log("list of tickets");
        console.log(response.data);
        // Dynamically generate columns based on the template fields
        const valueColumns = ticketsData.fields.map((field) => ({
          field: field.name,
          headerName: field.name.charAt(0).toUpperCase() + field.name.slice(1),
          width: 150,
          type: field.valueType === "Number" ? "number" : "string",
        }));

        // Setting up columns with edit and delete actions
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
                    `/admin/projects/ticket/by/template/edit/${params.row.id}`
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
          { field: "title", headerName: "Title", width: 200 },
          ...valueColumns,
        ]);

        // Fetch tickets for the selected template
        const ticketsResponse = await axios.get(
          `http://localhost:8080/api/process/tickets/all/${selectedTemplate}`
        );
        const tickets = ticketsResponse.data;

        // Map ticket data to rows with dynamic fields
        const formattedRows = tickets.map((ticket) => ({
          id: ticket.id,
          title: ticket.title,
          ...ticket.values?.reduce((acc, value) => {
            acc[value.key] = value.value;
            return acc;
          }, {}),
        }));

        setRows(formattedRows);
      } catch (err) {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [selectedTemplate]);

  // Handle delete button click
  const handleDelete = (ticketId) => {
    setTicketToDelete(ticketId);
    setOpenDialog(true); // Show confirmation dialog
  };

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/infrastructure/site/${ticketToDelete}`
      );
      setSnackbarMessage("Ticket deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Refresh the rows by removing the deleted ticket
      setRows(rows.filter((row) => row.id !== ticketToDelete));
    } catch (err) {
      setSnackbarMessage("Failed to delete ticket.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenDialog(false);
      setTicketToDelete(null);
    }
  };

  // Cancel delete action
  const cancelDelete = () => {
    setOpenDialog(false);
    setTicketToDelete(null);
  };

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            List of Tickets
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDialog} onClose={cancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this ticket?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button onClick={confirmDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for success/error messages */}
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

export default TicketsByTemp;
