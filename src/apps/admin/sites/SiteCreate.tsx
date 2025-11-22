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
  Container,
  Stack,
  Divider,
  Chip,
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
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/infrastructure/site/template/all`
        );
        setTemplates(response.data.datas || []);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  // Fetch template fields when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/admin/infrastructure/site/template/${selectedTemplate}`
          );
          setTemplateFields(response.data.fields || []);
        } catch (err) {
          setError("Failed to load template fields");
        } finally {
          setFieldsLoading(false);
        }
      };

      fetchTemplateFields();
    } else {
      setTemplateFields([]);
      setFormData([]);
    }
  }, [selectedTemplate]);

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
    } else {
      setFormData([]);
    }
  }, [templateFields]);

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
    setError(null);

    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/infrastructure/site/create-from-template/${selectedTemplate}`,
        { siteName, values: formData }
      );
      setSnackbarMessage("Site submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // navigate("/sites");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create site";
      setError(msg);
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Create Site from Template
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Choose a template, fill in the required fields, and generate a
              site configuration in a few clicks.
            </Typography>
          </Box>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Template & Site Info */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Template & Site Information"
                      color="primary"
                      variant="outlined"
                    />
                  </Divider>
                  <Stack spacing={2}>
                    <FormControl fullWidth>
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
                      placeholder="e.g. Production Cluster A"
                    />
                  </Stack>
                </Box>

                {/* Template Fields */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Template Fields"
                      color="secondary"
                      variant="outlined"
                    />
                  </Divider>

                  {fieldsLoading ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        mt: 2,
                        mb: 1,
                      }}
                    >
                      <CircularProgress />
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Loading fields...
                      </Typography>
                    </Box>
                  ) : !selectedTemplate ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Select a template to see its fields.
                    </Typography>
                  ) : formData.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      This template has no configurable fields.
                    </Typography>
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
                                onChange={(e) =>
                                  handleInputChange(e, field.key)
                                }
                                required={field.required}
                              />
                            )}

                          {field.htmlType === "inputText" &&
                            field.valueType === "Number" && (
                              <TextField
                                fullWidth
                                type="number"
                                label={field.key}
                                value={field.value}
                                onChange={(e) =>
                                  handleInputChange(e, field.key)
                                }
                                required={field.required}
                              />
                            )}

                          {field.htmlType === "inputText" &&
                            field.valueType === "Date" && (
                              <TextField
                                fullWidth
                                type="date"
                                label={field.key}
                                value={field.value}
                                onChange={(e) =>
                                  handleInputChange(e, field.key)
                                }
                                required={field.required}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}

                          {field.htmlType === "dropdown" &&
                            field.valueType === "Select" && (
                              <FormControl fullWidth>
                                <InputLabel>{field.key}</InputLabel>
                                <Select
                                  label={field.key}
                                  value={field.value}
                                  onChange={(e) =>
                                    handleInputChange(e, field.key)
                                  }
                                  required={field.required}
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
                </Box>

                {/* Submit */}
                <Box>
                  {error && (
                    <Typography color="error" sx={{ mb: 1 }}>
                      {error}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading || !selectedTemplate}
                      startIcon={
                        loading ? <CircularProgress size={18} /> : null
                      }
                    >
                      {loading ? "Creating..." : "Create Site"}
                    </Button>
                  </Box>
                </Box>
              </Stack>
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
        </Container>
      </Box>
    </Layout>
  );
};

export default SiteCreate;
