// src/components/Tickets.tsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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
          `${import.meta.env.VITE_API_URL}/api/process/tickets`
        );
        setTickets(response.data || []);
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
      flex: 1,
      minWidth: 180,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 280,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      minWidth: 130,
      renderCell: (params) => {
        const status = String(params.value || "").toLowerCase();
        let color: "default" | "success" | "warning" | "error" = "default";

        if (status === "pending") color = "warning";
        else if (status === "closed") color = "success";
        else if (status === "paused" || status === "cancel") color = "error";

        return (
          <Chip
            label={params.value || "Unknown"}
            color={color === "default" ? undefined : color}
            size="small"
            variant={color === "default" ? "outlined" : "filled"}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEditClick(params.row.id)}
        >
          Edit
        </Button>
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
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Tickets
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Browse and edit tickets created from your templates.
              </Typography>
            </Box>

            {/* Main card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Divider textAlign="left" sx={{ mb: 3 }}>
                <Chip label="Ticket List" color="primary" variant="outlined" />
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
                    Loading tickets...
                  </Typography>
                </Box>
              ) : error ? (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              ) : tickets.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  No tickets found. Create a new ticket to get started.
                </Typography>
              ) : (
                <Box sx={{ height: 500, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                      },
                    }}
                    disableRowSelectionOnClick
                  />
                </Box>
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
      </Box>
    </Layout>
  );
};

export default Tickets;
