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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SiteEdit = () => {
  const { id } = useParams();
  const [site, setSite] = useState<any | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [elementsColumns, setElementsColumns] = useState<GridColDef[]>([]);
  const [elementRows, setElementRows] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateFields, setTemplateFields] = useState<any[]>([]);
  const [siteName, setSiteName] = useState("");
  const [formData, setFormData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [elementDialogOpen, setElementDialogOpen] = useState(false);
  const [elements, setElements] = useState<any[]>([]);
  const [selectedElementId, setSelectedElementId] = useState("");
  const [elementTemplates, setElementTemplates] = useState<any[]>([]);
  const [elementsByTemplate, setElementsByTemplate] = useState<any>({});
  const [selectedTab, setSelectedTab] = useState(0);

  const navigate = useNavigate();

  const addTemplateIfNotExists = (newTemplate: any) => {
    setElementTemplates((prevTemplates) => {
      const exists = prevTemplates.some(
        (template) => template.id === newTemplate.id
      );
      if (!exists) {
        const updated = [...prevTemplates, newTemplate];
        updated.sort((a, b) =>
          a.templateName.toLowerCase() < b.templateName.toLowerCase() ? -1 : 1
        );
        return updated;
      }
      return prevTemplates;
    });
  };

  const addElementIfNotExists = (newElement: any) => {
    setElements((prevElements) => {
      const exists = prevElements.some(
        (element) => element.id === newElement.id
      );
      if (!exists) {
        return [...prevElements, newElement];
      }
      return prevElements;
    });
  };

  // 1) Load site information by id
  useEffect(() => {
    const fetchSite = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/infrastructure/site/${id}`
        );

        if (response.data.elements) {
          const els = response.data.elements;
          els.forEach((element: any) => {
            const template = element.elementTemplate;
            addTemplateIfNotExists(template);
            addElementIfNotExists(element);
          });
        }
        setSite(response.data);
        setSiteName(response.data.siteName);
        setTemplateId(response.data.siteTemplate.id);
        setTemplateName(response.data.siteTemplate.templateName);
      } catch (err) {
        setError("Failed to load site");
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [id]);

  // 2) Load template fields for form update
  useEffect(() => {
    if (templateId) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/admin/infrastructure/site/template/${templateId}`
          );
          setTemplateFields(response.data.fields);
        } catch (err) {
          setError("Failed to load template fields");
        } finally {
          setFieldsLoading(false);
        }
      };

      fetchTemplateFields();
    }
  }, [templateId]);

  // 3) Prepare site template fields
  useEffect(() => {
    if (templateFields.length > 0 && site) {
      const initialFormData = templateFields.map((field, index) => {
        const value =
          site.values && site.values.length > index
            ? site.values[index].value
            : "";
        return {
          key: field.name,
          value: value || "",
          required: field.required,
          valueType: field.type,
          htmlType: field.type === "Select" ? "dropdown" : "inputText",
          options: field.options,
        };
      });
      setFormData(initialFormData);
    }
  }, [templateFields, site]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    setFormData((prevData) =>
      prevData.map((item) =>
        item.key === fieldName ? { ...item, value: e.target.value } : item
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!site) return;
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/infrastructure/site/update-from-template`,
        {
          id: site.id,
          siteName: siteName,
          siteTemplate: site.siteTemplate,
          values: formData,
          elements: elements,
        }
      );
      setSnackbarMessage("Site submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update site";
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

  // Load element templates + open dialog
  const handleAddElementDialog = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/infrastructure/element/template/all`
      );
      setTemplates(response.data);
      setElementDialogOpen(true);
    } catch (err) {
      setError("Failed to load templates");
    }
  };

  // 4) Prepare columns/rows for elements dialog
  useEffect(() => {
    const fetchElements = async () => {
      if (!selectedTemplate) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/infrastructure/element/template/${selectedTemplate}`
        );
        const siteData = response.data;

        const valueColumns = siteData.fields.map((field: any) => ({
          field: field.name,
          headerName: field.name.charAt(0).toUpperCase() + field.name.slice(1),
          width: 150,
          type: field.valueType === "Number" ? "number" : "string",
        }));

        setColumns([
          { field: "id", headerName: "ID", width: 150 },
          { field: "elementName", headerName: "Element Name", width: 200 },
          ...valueColumns,
        ]);

        const elementsResponse = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/infrastructure/element/all/current-id-site-is-null/${selectedTemplate}`
        );
        const els = elementsResponse.data;

        const formattedRows = els.map((element: any) => ({
          id: element.id,
          elementName: element.elementName,
          ...element.values?.reduce((acc: any, value: any) => {
            acc[value.key] = value.value;
            return acc;
          }, {}),
        }));
        setRows(formattedRows);
      } catch (err) {
        setError("Failed to load elements");
      } finally {
        setLoading(false);
      }
    };

    fetchElements();
  }, [selectedTemplate]);

  // Add element to site.elements
  const handleElementDialogSubmit = async () => {
    if (!selectedElementId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/infrastructure/element/${selectedElementId}`
      );
      const newTemplate = response.data.elementTemplate;
      const newElement = response.data;
      addTemplateIfNotExists(newTemplate);
      addElementIfNotExists(newElement);

      setSnackbarMessage("Element added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setElementDialogOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to add element";
      setError(msg);
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 5) Build elementsByTemplate + clean elementTemplates
  useEffect(() => {
    const temp = [...elementTemplates];
    temp.forEach((template) => {
      const exists = isTemplateInElements(template.id, elements);
      if (!exists) {
        const filtered = elementTemplates.filter((t) => t.id !== template.id);
        setElementTemplates(filtered);
      }
    });

    const grouped: any = {};
    elements.forEach((element) => {
      const tid = element.elementTemplate.id;
      if (!grouped[tid]) grouped[tid] = [];
      grouped[tid].push(element);
    });

    setElementsByTemplate(grouped);
  }, [elements]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // 6) Prepare columns/rows for selected tab
  useEffect(() => {
    const selectedTemplateId = elementTemplates[selectedTab]?.id;
    if (
      selectedTemplateId &&
      elementsByTemplate[selectedTemplateId] &&
      elementsByTemplate[selectedTemplateId].length > 0
    ) {
      const els = elementsByTemplate[selectedTemplateId];

      const valueColumns =
        elementTemplates[selectedTab]?.fields?.map((field: any) => ({
          field: field.name,
          headerName: field.name.charAt(0).toUpperCase() + field.name.slice(1),
          width: 150,
          type: field.valueType === "Number" ? "number" : "string",
        })) || [];

      setElementsColumns([
        {
          field: "edit",
          headerName: "Edit",
          width: 60,
          renderCell: (params) => (
            <IconButton
              color="primary"
              onClick={() =>
                navigate(
                  `/admin/projects/element/edit-element/${params.row.id}`
                )
              }
            >
              <EditIcon />
            </IconButton>
          ),
        },
        {
          field: "delete",
          headerName: "Delete from this list",
          width: 160,
          renderCell: (params) => (
            <IconButton
              color="secondary"
              onClick={() =>
                handleDeleteElementFromSiteElementsList(params.row.id)
              }
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
        { field: "id", headerName: "ID", width: 150 },
        { field: "elementName", headerName: "Element Name", width: 200 },
        ...valueColumns,
      ]);

      const formattedRows = els.map((element: any) => ({
        id: element.id,
        elementName: element.elementName,
        ...element.values?.reduce((acc: any, value: any) => {
          acc[value.key] = value.value;
          return acc;
        }, {}),
      }));

      setElementRows(formattedRows);
    } else {
      setElementsColumns([]);
      setElementRows([]);
    }
  }, [selectedTab, elementsByTemplate, elementTemplates, navigate]);

  const isTemplateInElements = (templateId: string, els: any[]) => {
    return els.some((element) => element.elementTemplate.id === templateId);
  };

  const handleDeleteElementFromSiteElementsList = (elementId: string) => {
    const filtered = elements.filter((element) => element.id !== elementId);
    setElements(filtered);
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
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Edit Site
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Update site information, configuration values, and associated
                elements.
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
                {/* Site info */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Site Information"
                      color="primary"
                      variant="outlined"
                    />
                  </Divider>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Template Name"
                      value={templateName}
                      sx={{ mb: 1 }}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="Site Name"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      required
                    />
                  </Stack>
                </Box>

                {/* Site fields */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Site Configuration Fields"
                      color="secondary"
                      variant="outlined"
                    />
                  </Divider>

                  {fieldsLoading ? (
                    <Box sx={{ textAlign: "center", mt: 2, mb: 2 }}>
                      <CircularProgress />
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Loading fields...
                      </Typography>
                    </Box>
                  ) : formData.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      No configurable fields defined for this template.
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
                          {field.htmlType === "dropdown" && (
                            <FormControl fullWidth>
                              <InputLabel>{field.key}</InputLabel>
                              <Select
                                value={field.value}
                                label={field.key}
                                onChange={(e) =>
                                  setFormData((prevData) =>
                                    prevData.map((item) =>
                                      item.key === field.key
                                        ? { ...item, value: e.target.value }
                                        : item
                                    )
                                  )
                                }
                                required={field.required}
                              >
                                {field.options.map((option: string) => (
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
                  )}
                </Box>

                {/* Elements section */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Associated Elements"
                      color="info"
                      variant="outlined"
                    />
                  </Divider>

                  {elementTemplates.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      No elements attached to this site yet. Use "Add Element"
                      to link elements based on element templates.
                    </Typography>
                  ) : (
                    <>
                      <Tabs
                        sx={{ mb: 2 }}
                        value={selectedTab}
                        onChange={handleTabChange}
                        aria-label="element template tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                      >
                        {elementTemplates.map((template) => (
                          <Tab
                            key={template.id}
                            label={template.templateName}
                          />
                        ))}
                      </Tabs>

                      {loading ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 200,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : error && elementsColumns.length === 0 ? (
                        <Typography color="error">{error}</Typography>
                      ) : (
                        elementTemplates[selectedTab] && (
                          <Paper
                            variant="outlined"
                            sx={{ height: 400, width: "100%" }}
                          >
                            <DataGrid
                              rows={elementRows}
                              columns={elementsColumns}
                              pageSize={10}
                              rowsPerPageOptions={[10]}
                              disableRowSelectionOnClick
                            />
                          </Paper>
                        )
                      )}
                    </>
                  )}
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
                    variant="outlined"
                    color="secondary"
                    onClick={handleAddElementDialog}
                  >
                    Add Element
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={18} /> : undefined
                    }
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
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

        {/* Element selection dialog */}
        <Dialog
          open={elementDialogOpen}
          onClose={() => setElementDialogOpen(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>Select an Element</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 1 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Template</InputLabel>
                <Select
                  label="Template"
                  value={selectedTemplate}
                  onChange={(e) =>
                    setSelectedTemplate(e.target.value as string)
                  }
                  required
                >
                  {templates.map((template: any) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.templateName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 200,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error && rows.length === 0 ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    onRowSelectionModelChange={(newSelection) => {
                      if (
                        Array.isArray(newSelection) &&
                        newSelection.length > 0
                      ) {
                        setSelectedElementId(newSelection[0] as string);
                      } else {
                        setSelectedElementId("");
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setElementDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleElementDialogSubmit}
              color="primary"
              disabled={selectedElementId === ""}
            >
              Add Element
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default SiteEdit;
