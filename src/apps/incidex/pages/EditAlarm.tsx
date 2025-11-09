import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import axios from "axios";
import Layout from "../../Layout";
import {
  mainListItemsIncidex,
  secondaryListItemsIncidex,
} from "./components/DrawerMenuIncidex";
import { DataGrid } from "@mui/x-data-grid";

const EditAlarm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState(null);
  const [rowDataId, setRowDataId] = useState("");
  const [headers, setHeaders] = useState([]);
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [subjectConf, setSubjectConf] = useState([]);

  useEffect(() => {
    const fetchRowData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/alarm/${id}`
        );
        setRowData(response.data.data);
        setRowDataId(response.data.id);
        setHeaders(Object.keys(response.data.data));
        fetchEmails(response.data.id); // Fetch emails when alarm data is loaded
      } catch (error) {
        console.error("Error fetching row data:", error);
      }
    };

    fetchRowData();
  }, [id]);

  const fetchEmails = async (keyValueDocumentId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/emails?keyValueDocumentId=${keyValueDocumentId}`
      );
      const fetchedEmails = response.data.map((email) => ({
        id: email.id,
        recipients: email.recipients.join(", "), // Join recipients for display
        subject: email.subject,
        message: email.message,
      }));
      setEmails(fetchedEmails);

      // Set the last email's recipients as the default
      if (fetchedEmails.length > 0) {
        setRecipients(fetchedEmails[fetchedEmails.length - 1].recipients);
        setSubject(fetchedEmails[fetchedEmails.length - 1].subject);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setSnackbarMessage("Error fetching emails");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setRowData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubjectChange = (e: SelectChangeEvent<string[]>) => {
    const selectedValues = e.target.value;
    setSubjectConf(selectedValues);

    let sub: string = "Update " + emails.length + " =>";
    selectedValues.forEach((value) => {
      sub += `${value} :: ${rowData[value]} | `;
    });

    setSubject(sub);
  };

  const validateEmails = (emailList) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailList.every((email) => emailPattern.test(email));
  };

  const handleSendEmail = async () => {
    const trimmedRecipients = recipients
      .split(",")
      .map((email) => email.trim());

    if (!validateEmails(trimmedRecipients)) {
      setSnackbarMessage("Please enter valid email addresses.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/emails/send",
        {
          recipients: trimmedRecipients,
          subject,
          message,
          keyValueDocumentId: rowDataId,
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
      setLoading(false);
      setSnackbarOpen(true);
      setRecipients("");
      setSubject("");
      setMessage("");
    }
  };

  if (!rowData) {
    return (
      <Layout
        drawerMenuList={mainListItemsIncidex}
        drawerMenuSecondaryList={secondaryListItemsIncidex}
      >
        Loading...
      </Layout>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "recipients", headerName: "Recipients", width: 300 },
    { field: "subject", headerName: "Subject", width: 300 },
    { field: "message", headerName: "Message", width: 400 },
  ];

  return (
    <Layout
      drawerMenuList={mainListItemsIncidex}
      drawerMenuSecondaryList={secondaryListItemsIncidex}
    >
      <Box sx={{ width: "100%" }}>
        <Paper>
          <Box sx={{ padding: 2 }}>
            <h2>Edit Alarm</h2>
            <Grid container spacing={2}>
              {headers.map((header) => (
                <Grid item xs={12} sm={3} key={header}>
                  <TextField
                    label={header}
                    inputProps={{ readOnly: true }}
                    value={rowData[header] || ""}
                    onChange={(e) => handleChange(header, e.target.value)}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
            <TextField
              label="Recipients (comma-separated)"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <FormControl sx={{ marginTop: 2, width: 200 }}>
              <InputLabel>Subject Config</InputLabel>
              <Select
                multiple
                value={subjectConf}
                onChange={handleSubjectChange}
                label="Subject Config"
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => (
                      <Chip key={value} label={value} sx={{ margin: 0.5 }} />
                    ))}
                  </div>
                )}
              >
                {headers.map((header) => (
                  <MenuItem key={header} value={header}>
                    {header}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <Button
              variant="outlined"
              onClick={() => navigate("/incidex-app-alarms")}
              sx={{ marginTop: 2, marginLeft: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendEmail}
              sx={{ marginTop: 2, marginLeft: 2 }}
              disabled={loading}
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
            {loading ? (
              <CircularProgress />
            ) : (
              <div style={{ height: 400, width: "100%", marginTop: 16 }}>
                <DataGrid
                  rows={emails}
                  columns={columns}
                  getRowId={(row) => row.id}
                />
              </div>
            )}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default EditAlarm;
