import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import axios from "axios"; // For making HTTP requests
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../Layout";
import { ArrowBack } from "@mui/icons-material";

// Define the types for state
interface TicketFormState {
  title: string;
  description: string;
  status: string;
}

// Define the possible statuses
const ticketStatuses = ["open", "in-progress", "closed"] as const;
type TicketStatus = (typeof ticketStatuses)[number];

const TicketEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formState, setFormState] = useState<TicketFormState>({
    title: "",
    description: "",
    status: "open",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tickets/${id}`);
        console.log(response.data);
        setFormState(response.data);
      } catch (err) {
        setError("Failed to fetch ticket details");
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:8080/tickets/${id}`, formState);
      setSnackbarMessage("Ticket updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Redirect or update UI as needed
      navigate("/admin/projects/ticket/all");
    } catch (err) {
      setSnackbarMessage("Failed to update ticket");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" align="center" gutterBottom>
              Edit Ticket
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={formState.status}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {ticketStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                {error && <Typography color="error">{error}</Typography>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Ticket"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default TicketEditForm;
