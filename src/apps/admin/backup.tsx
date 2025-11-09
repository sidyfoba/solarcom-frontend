// src/components/CreateSite.js

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
} from "@mui/material";
import axios from "axios";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const CreateSiteTest = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/infrastruture/site/template/all"
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
        try {
          const response = await axios.get(
            `http://localhost:8080/api/admin/infrastruture/site/template/${selectedTemplate}`
          );
          setTemplateFields(response.data.fields);
        } catch (err) {
          setError("Failed to load template fields");
        }
      };

      fetchTemplateFields();
    }
  }, [selectedTemplate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/infrastruture/site/create-from-template/${selectedTemplate}`,
        { siteName: siteName, fields: formData }
      );
      //   navigate("/sites"); // Redirect after successful site creation
      console.log("fields");
      console.log(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create site");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <Box sx={{ padding: 3, width: "100%" }}>
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
            <Grid container spacing={2}>
              {templateFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  {field.type === "String" && (
                    <TextField
                      fullWidth
                      label={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 2 }}
                    />
                  )}
                  {field.type === "Number" && (
                    <TextField
                      fullWidth
                      type="number"
                      label={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 2 }}
                    />
                  )}
                  {field.type === "Date" && (
                    <TextField
                      fullWidth
                      type="date"
                      label={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 2 }}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  {field.type === "Select" && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>{field.name}</InputLabel>
                      <Select
                        label={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        required
                      >
                        {field.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              ))}
            </Grid>
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
      </Box>
    </Layout>
  );
};

export default CreateSiteTest;
