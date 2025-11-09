import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";

// Define the type for a ticket
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
}

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const navigate = useNavigate();

  // Fetch tickets from the API
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/process/tickets"
        );
        setTickets(response.data);
      } catch (err) {
        setError("Failed to fetch tickets");
        setSnackbarMessage("Failed to load tickets.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleEditClick = (id: string) => {
    navigate(`/admin/projects/ticket/edit/${id}`);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Columns definition for the DataGrid
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 200,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <button
          onClick={() => handleEditClick(params.row.id)}
          style={{
            padding: "5px 15px",
            backgroundColor: "#3f51b5",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      ),
    },
  ];

  // Map tickets data to rows for the DataGrid
  const rows = tickets.map((ticket) => ({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
  }));

  return (
    <Layout>
      <Container component="main" maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Ticket List
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
              />
            </div>
          )}
        </Paper>

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
    </Layout>
  );
};

export default Tickets;
