import React, { useState } from "react";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const EmailEditor = () => {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [keyValueDocumentId, setKeyValueDocumentId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSendEmail = async () => {
    setLoading(true); // Set loading to true when processing starts
    try {
      const response = await axios.post(
        "http://localhost:8080/api/mails/send",
        {
          recipients: recipients.split(",").map((email) => email.trim()),
          subject,
          message,
          keyValueDocumentId,
        }
      );
      setSnackbarMessage(response.data);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(
        error.response ? error.response.data : "Error sending email"
      );
      setSnackbarSeverity("error");
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
      setSnackbarOpen(true);
      // Clear form fields
      setRecipients("");
      setSubject("");
      setMessage("");
      setKeyValueDocumentId("");
    }
  };

  return (
    <div>
      <TextField
        label="Recipients (comma-separated)"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        rows={4}
        fullWidth
        margin="normal"
      />
      <TextField
        label="KeyValueDocument ID"
        value={keyValueDocumentId}
        onChange={(e) => setKeyValueDocumentId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        onClick={handleSendEmail}
        variant="contained"
        color="primary"
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Send Email"
        )}
      </Button>

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
    </div>
  );
};

export default EmailEditor;
