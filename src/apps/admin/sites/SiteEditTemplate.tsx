// src/components/EditTemplate.tsx (or .tsx)

import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

interface Field {
  id: string;
  name: string;
  type: string;
  options: string[];
  required: boolean;
}

type SnackbarSeverity = "success" | "error" | "info" | "warning";

const SiteEditTemplate = () => {
  const { id } = useParams();
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("String");
  const [fieldOptions, setFieldOptions] = useState("");
  const [isFieldRequired, setIsFieldRequired] = useState<boolean>(false);
  const [description, setDescription] = useState("");
  const [active, setActive] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<Field | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch template on load
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/infrastructure/site/template/${id}`
        );
        const { templateName, fields, description, active } = response.data;

        setTemplateName(templateName);
        if (fields?.length > 0) {
          setFields(
            fields.map((field: any) => ({
              id: uuidv4(),
              name: field.name,
              type: field.type,
              options: field.options || [],
              required: field.required,
            }))
          );
        }
        setDescription(description || "");
        setActive(active);
      } catch (err) {
        setError("Failed to load template");
        setSnackbarMessage("Failed to load template");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleAddField = () => {
    if (!fieldName.trim()) return;

    const newField: Field = {
      id: uuidv4(),
      name: fieldName.trim(),
      type: fieldType,
      options:
        fieldType === "Select"
          ? fieldOptions
              .split(",")
              .map((opt) => opt.trim())
              .filter(Boolean)
          : [],
      required: isFieldRequired,
    };

    setFields((prevFields) => [...prevFields, newField]);
    setFieldName("");
    setFieldType("String");
    setFieldOptions("");
    setIsFieldRequired(false);
  };

  const handleFieldEdit = (field: Field) => {
    setCurrentField(field);
    setDialogOpen(true);
  };

  const handleFieldDelete = (field: Field) => {
    setFieldToDelete(field);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fieldToDelete) {
      setFields((prevFields) =>
        prevFields.filter((f) => f.id !== fieldToDelete.id)
      );
      setConfirmationDialogOpen(false);
      setFieldToDelete(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentField(null);
  };

  const handleFieldUpdate = () => {
    if (currentField) {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.id === currentField.id ? { ...field, ...currentField } : field
        )
      );
      handleDialogClose();
    }
  };

  const handleClearForm = () => {
    setTemplateName("");
    setFields([]);
    setDescription("");
    setError(null);
    setFieldName("");
    setFieldType("String");
    setFieldOptions("");
    setActive(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/infrastructure/site/template/update/${id}`,
        {
          templateName,
          fields,
          description,
          active,
        }
      );
      setSnackbarMessage("Site template submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // navigate("/admin/projects/site/template/all");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update template";
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

  const toggleActiveStatus = () => {
    setActive((prevActive) => !prevActive);
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
          {/* Header */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={600}>
                {t("edit_template")}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Edit the template name, structure, and activation status.
              </Typography>
            </Box>
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
              <Stack spacing={4}>
                {/* Template info */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Template Information"
                      color="primary"
                      variant="outlined"
                    />
                  </Divider>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Tooltip
                        title={
                          active ? "Click to deactivate" : "Click to activate"
                        }
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: {
                              xs: "flex-start",
                              sm: "flex-end",
                            },
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Status:
                          </Typography>
                          <IconButton
                            onClick={toggleActiveStatus}
                            color={active ? "primary" : "default"}
                          >
                            {active ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                          <Typography variant="body2">
                            {active ? "Active" : "Inactive"}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        multiline
                        minRows={2}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Fields list */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip label="Fields" color="secondary" variant="outlined" />
                  </Divider>

                  <Box
                    sx={{
                      maxHeight: 240,
                      overflowY: "auto",
                      padding: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? "grey.50"
                          : "background.default",
                    }}
                  >
                    {fields.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        No fields defined yet. Use the form below to add new
                        fields.
                      </Typography>
                    ) : (
                      fields.map((field) => (
                        <Grid
                          container
                          key={field.id}
                          sx={{
                            mb: 1,
                            p: 1,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                          }}
                          alignItems="center"
                          spacing={2}
                        >
                          <Grid item xs>
                            <Typography variant="body1">
                              {field.name} ({field.type}){" "}
                              {field.required ? "(Required)" : ""}
                            </Typography>
                            {field.type === "Select" &&
                              field.options.length > 0 && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Options: {field.options.join(", ")}
                                </Typography>
                              )}
                          </Grid>
                          <Grid item>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleFieldEdit(field)}
                            >
                              Edit
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleFieldDelete(field)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      ))
                    )}
                  </Box>
                </Box>

                {/* Add field section */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Add / Edit Field Definition"
                      color="info"
                      variant="outlined"
                    />
                  </Divider>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Field Name"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Field Type</InputLabel>
                        <Select
                          label="Field Type"
                          value={fieldType}
                          onChange={(e) =>
                            setFieldType(e.target.value as string)
                          }
                        >
                          <MenuItem value="String">String</MenuItem>
                          <MenuItem value="Number">Number</MenuItem>
                          <MenuItem value="Date">Date</MenuItem>
                          <MenuItem value="Select">Select</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isFieldRequired}
                            onChange={(e) =>
                              setIsFieldRequired(e.target.checked)
                            }
                          />
                        }
                        label="Required"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {fieldType === "Select" && (
                        <TextField
                          fullWidth
                          label="Options (comma separated)"
                          value={fieldOptions}
                          onChange={(e) => setFieldOptions(e.target.value)}
                          placeholder="e.g. low, medium, high"
                        />
                      )}
                    </Grid>
                  </Grid>
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    onClick={handleAddField}
                    variant="outlined"
                    color="primary"
                  >
                    Add Field
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Template"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearForm}
                  >
                    Clear
                  </Button>
                </Box>

                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </Stack>
            </form>
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

          {/* Edit field dialog */}
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogContent>
              {currentField && (
                <Box sx={{ width: 400, p: 2 }}>
                  <TextField
                    fullWidth
                    label="Field Name"
                    value={currentField.name}
                    onChange={(e) =>
                      setCurrentField({
                        ...currentField,
                        name: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Field Type</InputLabel>
                    <Select
                      label="Field Type"
                      value={currentField.type}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          type: e.target.value as string,
                        })
                      }
                    >
                      <MenuItem value="String">String</MenuItem>
                      <MenuItem value="Number">Number</MenuItem>
                      <MenuItem value="Date">Date</MenuItem>
                      <MenuItem value="Select">Select</MenuItem>
                    </Select>
                  </FormControl>
                  {currentField.type === "Select" && (
                    <TextField
                      fullWidth
                      label="Options (comma separated)"
                      value={currentField.options.join(", ")}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          options: e.target.value
                            .split(",")
                            .map((opt) => opt.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  )}
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Checkbox
                        checked={currentField.required}
                        onChange={(e) =>
                          setCurrentField({
                            ...currentField,
                            required: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Required"
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleFieldUpdate}>Update</Button>
            </DialogActions>
          </Dialog>

          {/* Delete confirmation dialog */}
          <Dialog
            open={confirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this field?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default SiteEditTemplate;
