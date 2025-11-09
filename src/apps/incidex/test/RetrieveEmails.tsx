import React, { useState } from "react";
import {
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import axios from "axios";

const RetrieveEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyValueDocumentId, setKeyValueDocumentId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchEmails = async () => {
    if (!keyValueDocumentId) {
      setSnackbarMessage("Please enter a KeyValueDocument ID");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/emails?keyValueDocumentId=${keyValueDocumentId}`
      );
      const fetchedEmails = response.data.map(
        (email: { id: any; recipients: any; subject: any; message: any }) => ({
          id: email.id, // Ensure there's an `id` field
          recipients: email.recipients, // Keep the array
          subject: email.subject,
          message: email.message,
        })
      );
      console.log(fetchedEmails);
      setEmails(fetchedEmails);
      setSnackbarMessage("Emails fetched successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error fetching emails:", error);
      setSnackbarMessage("Error fetching emails");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Define columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "recipients",
      headerName: "Recipients",
      width: 300,
    },
    { field: "subject", headerName: "Subject", width: 300 },
    { field: "message", headerName: "Message", width: 400 },
  ];

  return (
    <Paper style={{ padding: 16 }}>
      <h2>Retrieve Emails by KeyValueDocument ID</h2>
      <TextField
        label="KeyValueDocument ID"
        value={keyValueDocumentId}
        onChange={(e) => setKeyValueDocumentId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={fetchEmails}>
        Fetch Emails
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ height: 400, width: "100%", marginTop: 16 }}>
          <DataGrid
            rows={emails}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            getRowId={(row) => row.id} // Set unique id for each row
          />
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RetrieveEmails;
