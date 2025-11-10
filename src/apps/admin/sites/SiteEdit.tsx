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
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import ElementEditTemplate from "../site-elements/ElementEditTemplate";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// // Function to add item if it does not exist
// function addElementTemplateIfNotExists(array, template) {
//   // Check if item with the same id already exists
//   const exists = array.some(
//     (existingTemplate) => existingTemplate.id === template.id
//   );

//   // If it does not exist, add it to the array
//   if (!exists) {
//     array.push(template);
//   }
// }
const SiteEdit = () => {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState([]);
  const [elementsColumns, setElementsColumns] = useState<GridColDef[]>([]);
  const [elementRows, setElementRows] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newElementName, setNewElementName] = useState("");
  const [newElementId, setNewElementId] = useState("");
  const [newElementTemplateId, setNewElementTemplateId] = useState("");
  const [elementDialogOpen, setElementDialogOpen] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState("");
  const [elementTemplates, setElementTemplates] = useState([]);
  const [elementsByTemplate, setElementsByTemplate] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);

  const navigate = useNavigate();

  const addTemplateIfNotExists = (newTemplate) => {
    setElementTemplates((prevTemplates) => {
      // Check if the item already exists in the array
      const exists = prevTemplates.some(
        (template) => template.id === newTemplate.id
      );

      // If the item does not exist, add it to the array
      if (!exists) {
        // Create a new array with the new template added
        const updatedTemplates = [...prevTemplates, newTemplate];

        // Sort the updated array by templateName
        updatedTemplates.sort((a, b) => {
          const nameA = a.templateName.toLowerCase();
          const nameB = b.templateName.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        return updatedTemplates;
      }

      // If the item exists, return the previous state unchanged
      return prevTemplates;
    });
  };

  const addElementIfNotExists = (newElement) => {
    setElements((prevElements) => {
      // Check if the item already exists in the array
      const exists = prevElements.some(
        (element) => element.id === newElement.id
      );

      // If the item does not exist, add it to the array
      if (!exists) {
        return [...prevElements, newElement];
      }

      // If the item exists, return the previous state unchanged
      return prevElements;
    });
  };

  //useffect 1 : load site information by id
  useEffect(() => {
    const fetchSite = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/infrastructure/site/${id}`
        );

        // console.log(response.data);
        if (response.data.elements) {
          const elements = response.data.elements;
          elements.map((element) => {
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
  // useEffect 2 : load the template fields for form update
  useEffect(() => {
    if (templateId) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
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
  // useEffect 3 : site template fields preparation
  useEffect(() => {
    if (templateFields.length > 0) {
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
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update site");
      setSnackbarMessage(
        err.response?.data?.message || "Failed to update site"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // method to open to load elements templates and open the dialog
  const handleAddElementDialog = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/infrastructure/element/template/all`
      );
      setTemplates(response.data);
      setElementDialogOpen(true);
    } catch (err) {
      setError("Failed to load templates");
    }
  };
  // useEffect 4 : Prepare columns and rows for the elements Dialog to choose elements to add in site
  useEffect(() => {
    const fetchElements = async () => {
      if (selectedTemplate) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/admin/infrastructure/element/template/${selectedTemplate}`
          );
          const siteData = response.data;
          const valueColumns = siteData.fields.map((field) => ({
            field: field.name,
            headerName:
              field.name.charAt(0).toUpperCase() + field.name.slice(1),
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
              import.meta.env.VITE_API_BASE
            }/api/infrastructure/element/all/current-id-site-is-null/${selectedTemplate}`
          );
          const elements = elementsResponse.data;

          const formattedRows = elements.map((element) => ({
            id: element.id,
            elementName: element.elementName,
            ...element.values?.reduce((acc, value) => {
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
      }
    };

    fetchElements();
  }, [selectedTemplate]);

  // method to add new element in site.elements
  const handleElementDialogSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE
        }/api/infrastructure/element/${selectedElementId}`
      );
      // console.log(response.data);
      // Use the function
      const newTemplate = response.data.elementTemplate;
      const newElement = response.data;
      // console.log(response.data.elementTemplate);
      addTemplateIfNotExists(newTemplate);
      addElementIfNotExists(newElement);
      // console.log(elementTemplates);

      setSnackbarMessage("Element added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setElementDialogOpen(false);
      // await fetchSite();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add element");
      setSnackbarMessage(
        err.response?.data?.message || "Failed to add element"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  //useEffect 5 : prepare the view of site.elements
  useEffect(() => {
    console.log("useEffect 5");
    const temp = elementTemplates;
    temp.forEach((template) => {
      const exists = isTemplateInElements(template.id, elements);
      if (!exists) {
        const templates = elementTemplates.filter((t) => t.id !== template.id);
        setElementTemplates(templates);
      }
      console.log(
        `Template '${template.templateName}' exists in elements: ${exists}`
      );
    });
    const elementsByTemplate = {};
    // Iterate over each element
    console.log(elements);
    elements.forEach((element) => {
      // Get the template ID for the current element
      const templateId = element.elementTemplate.id;

      // Initialize the array for this template ID if it doesn't exist
      if (!elementsByTemplate[templateId]) {
        elementsByTemplate[templateId] = [];
      }

      // Push the element into the appropriate array
      elementsByTemplate[templateId].push(element);
    });
    // Print the result to see the mapping
    // console.log(elementsByTemplate);
    console.log(elementsByTemplate);
    setElementsByTemplate(elementsByTemplate);
  }, [elements]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  // useEffect 6 : Prepare columns and rows for the selected tab
  useEffect(() => {
    console.log("useEffect 6");
    const selectedTemplateId = elementTemplates[selectedTab]?.id;
    if (selectedTemplateId && elementsByTemplate[selectedTemplateId]) {
      const elements = elementsByTemplate[selectedTemplateId];

      if (elements.length > 0) {
        // const firstElement = elements[0];
        const valueColumns = elementTemplates[selectedTab]?.fields.map(
          (field) => ({
            field: field.name,
            headerName:
              field.name.charAt(0).toUpperCase() + field.name.slice(1),
            width: 150,
            type: field.valueType === "Number" ? "number" : "string",
          })
        );

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
            headerName: "Delete form this list",
            width: 100,
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

        const formattedRows = elements.map((element) => ({
          id: element.id,
          elementName: element.elementName,
          ...element.values?.reduce((acc, value) => {
            acc[value.key] = value.value;
            return acc;
          }, {}),
        }));

        setElementRows(formattedRows);
      }
    }
  }, [selectedTab, elementsByTemplate, elementTemplates]);

  // Function to check if a specific templateId is in elements
  const isTemplateInElements = (templateId, elements) => {
    return elements.some(
      (element) => element.elementTemplate.id === templateId
    );
  };

  const handleDeleteElementFromSiteElementsList = (id) => {
    // console.log("the id of element to delete = " + id);
    const filteredData = elements.filter((element) => element.id !== id);
    // console.log(filteredData);
    setElements(filteredData);
    // setElements(elements.filter((element) => element.id !== id));
    // Loop through the list of templates and check if each one exists in elements
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Edit Site
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Template name"
              value={templateName}
              sx={{ mb: 2 }}
              disabled
            />
            <TextField
              fullWidth
              label="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            {fieldsLoading ? (
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
                          required={field.required}
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
                          required={field.required}
                          sx={{ mb: 2 }}
                        />
                      )}
                    {field.htmlType === "dropdown" && (
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>{field.key}</InputLabel>
                        <Select
                          value={field.value}
                          onChange={(e) => handleInputChange(e, field.key)}
                          required={field.required}
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
            )}
            <Divider />
            {/* <Paper sx={{ p: 2 }}> */}

            <Tabs
              sx={{ p: 2 }}
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="template tabs"
            >
              {elementTemplates.map((template) => (
                <Tab key={template.id} label={template.templateName} />
              ))}
            </Tabs>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              elementTemplates[selectedTab] && (
                <Paper sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={elementRows}
                    columns={elementsColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                  />
                </Paper>
              )
            )}
            {/* </Paper> */}
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={handleAddElementDialog}
              >
                Add Element
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={elementDialogOpen}
        onClose={() => setElementDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Select an Element</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
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
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  onRowSelectionModelChange={(newSelection) => {
                    console.log("Selection changed:", newSelection); // Debug line
                    if (
                      Array.isArray(newSelection) &&
                      newSelection.length > 0
                    ) {
                      setSelectedElementId(newSelection[0]);
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
            disabled={selectedElementId == ""}
          >
            Add Element
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default SiteEdit;
