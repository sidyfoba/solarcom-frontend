import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

const SiteCreate = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(false); // Add state for fields loading
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

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

  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true); // Set fieldsLoading to true when starting the fetch
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/admin/infrastructure/site/template/${selectedTemplate}`
          );
          setTemplateFields(response.data.fields);
        } catch (err) {
          setError("Failed to load template fields");
        } finally {
          setFieldsLoading(false); // Set fieldsLoading to false when fetch is complete
        }
      };

      fetchTemplateFields();
    }
  }, [selectedTemplate]);

  const handleInputChange = (e, fieldName) => {
    setFormData((prevData) =>
      prevData.map((item) =>
        item.key === fieldName ? { ...item, value: e.target.value } : item
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE
        }/api/infrastructure/site/create-from-template/${selectedTemplate}`,
        { siteName, values: formData }
      );
      // navigate("/sites"); // Redirect after successful site creation
      setSnackbarMessage("Site submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create site");
      setSnackbarMessage(
        err.response?.data?.message || "Failed to create site"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Initialize formData based on template fields
  useEffect(() => {
    if (templateFields.length > 0) {
      const initialFormData = templateFields.map((field) => ({
        key: field.name,
        value: "",
        required: field.required,
        valueType: field.type,
        htmlType: field.type === "Select" ? "dropdown" : "inputText",
        options: field.options,
      }));
      setFormData(initialFormData);
    }
  }, [templateFields]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Create Site from Template
          </Typography>
          <form onSubmit={handleSubmit}>
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
            <TextField
              fullWidth
              label="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            {fieldsLoading ? ( // Show loader when fields are loading
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Loading fields...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {formData.map((field) => (
                  <Grid item xs={12} sm={6} key={field.key}>
                    {field.htmlType === "inputText" &&
                      field.valueType === "String" && (
                        <TextField
                          fullWidth
                          label={field.key}
                          value={field.value}
                          onChange={(e) => handleInputChange(e, field.key)}
                          required={field.required} // Set required attribute based on field data
                          sx={{ mb: 2 }}
                        />
                      )}
                    {field.htmlType === "inputText" &&
                      field.valueType === "Number" && (
                        <TextField
                          fullWidth
                          type="number"
                          label={field.key}
                          value={field.value}
                          onChange={(e) => handleInputChange(e, field.key)}
                          required={field.required} // Set required attribute based on field data
                          sx={{ mb: 2 }}
                        />
                      )}
                    {field.htmlType === "inputText" &&
                      field.valueType === "Date" && (
                        <TextField
                          fullWidth
                          type="date"
                          label={field.key}
                          value={field.value}
                          onChange={(e) => handleInputChange(e, field.key)}
                          required={field.required} // Set required attribute based on field data
                          sx={{ mb: 2 }}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    {field.htmlType === "dropdown" &&
                      field.valueType === "Select" && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>{field.key}</InputLabel>
                          <Select
                            label={field.key}
                            value={field.value}
                            onChange={(e) => handleInputChange(e, field.key)}
                            required={field.required} // Set required attribute based on field data
                          >
                            {field.options?.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Site"}
              </Button>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </form>
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
      </Box>
    </Layout>
  );
};

export default SiteCreate;
