import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios"; // For making HTTP requests
import Layout from "../../Layout";

// Define the types for state
interface TicketFormState {
  title: string;
  description: string;
  status: string;
}

// Define the possible statuses
const ticketStatuses = ["open", "in-progress", "closed"] as const;
type TicketStatus = (typeof ticketStatuses)[number];

const TicketCreationForm: React.FC = () => {
  const [formState, setFormState] = useState<TicketFormState>({
    title: "",
    description: "",
    status: "open",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

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
      // Send a POST request to your API to create a new ticket
      await axios.post("http://localhost:8080/tickets", formState);
      // Show success Snackbar
      setSnackbarMessage("Ticket created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Reset the form fields
      setFormState({
        title: "",
        description: "",
        status: "open",
      });
    } catch (err) {
      // Show error Snackbar
      setSnackbarMessage("Failed to create ticket");
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
          <Typography variant="h5" align="center" gutterBottom>
            Create Ticket
          </Typography>
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Ticket"}
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

export default TicketCreationForm;
