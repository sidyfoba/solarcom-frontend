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
  Fab,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";

import Comment from "./Comment";
import Updates from "./Updates";
import Assignments from "./Assignments";

interface Template {
  id: string;
  templateName: string;
}

interface Field {
  name: string;
  value: string; //priorityValue , string , and other
  priorityValue: string;
  slaValue: number;
  type: string;
  required: boolean;
  options?: string[];
  dateRange?: {
    startName: string;
    startDateTime: "";
    endName: string;
    endDateTime: "";
  };
  editor?: {
    data: string;
  };
  slas: [];
}

//field values to be backed in ticket
interface FormDataItem {
  key: string;
  name: string;
  value: string;
  priorityValue: string;
  slaValue: number;
  type: string;
  required: boolean;
  options?: string[];
  valueType: string;
  htmlType: string;
  dateRange?: {
    startDateTime?: string;
    startName?: string; // Make sure this is defined as string, not string | undefined
    endName?: string; // Same as above
    endDateTime?: string;
  };
  editor?: {
    data: string;
  };
  slas: [];
}

// Define types for the Update data structure
interface Update {
  id: string; // Unique ID for each update
  text: string;
  updateNumber: number;
  date: string; // ISO string representation of the date
}

interface UpdateMessages {
  id: string;
  updatesTitle: string;
  updates: Update[];
}

interface Assignment {
  id: string;
  ticketAssigned: boolean;
  acknowledged: boolean;
  rejected: boolean;
  returned: boolean;
  teamId: string;
  description: string;
  onAssignDate: string;
  onAcknowledgementDate: string | null;
  rejectTicketDate: string | null;
  returnTicketDate: string | null;
}

interface AssignmentsList {
  id: string;
  assignments: Assignment[];
}

const getSlaByPriorityLabel = (
  priorityLabel: string,
  slas: SLA[]
): number | undefined => {
  const slaObject = slas.find((sla) => sla.priorityLabel === priorityLabel);
  return slaObject ? slaObject.sla : undefined; // Return the sla value or undefined if not found
};

interface Ticket {
  id: string; // corresponds to @Id in Java
  ticketId: string; // combination of number + template code + ticket number
  title: string; // title of the ticket
  description: string; // description of the ticket
  status: "pending" | "closed" | "paused" | "cancel"; // enum-like for status
  ticketTemplate: Template; // associated ticket template
  values: Field[]; // list of fields associated with the ticket
}

const CreateTicket: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateFields, setTemplateFields] = useState<Field[]>([]);
  const [ticketTitle, setTicketTitle] = useState<string>("");
  const [ticketDescription, setTicketDescription] = useState<string>("");
  const [ticket, setTicket] = useState<Ticket>();
  const [formData, setFormData] = useState<FormDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsLoading, setFieldsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [assigns, setAssigns] = useState<AssignmentsList>({
    id: "",
    assignments: [],
  });

  //commetns and updates
  // Handle the input change
  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData(e.target.value);
  };
  const [activeTab, setActiveTab] = useState(0); // State to track which tab is active

  //updates
  const [updateMessages, setUpdateMessages] = useState<UpdateMessages>({
    updatesTitle: "My Updates", // Default title
    updates: [], // Empty array for updates
  });

  // const [updateData, setUpdateData] = useState(""); // State for the update input field
  const [commentData, setCommentData] = useState(""); // State for the comment input field

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle the update input change
  // const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUpdateData(e.target.value);
  // };

  // Handle the comment input change
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData(e.target.value);
  };

  //
  // const navigate = useNavigate();

  //fetch all templates
  useEffect(() => {
    const fetchTemplates = async () => {
      console.log(
        "assignements******************************************************************"
      );
      console.log(assigns);
      console.log(setAssigns);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/admin/process/ticket/template/all`
        );
        setTemplates(response.data.templates);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  // template selection and load templates fields
  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/admin/process/ticket/template/${selectedTemplate}`
          );
          setTemplateFields(response.data.fields);
          // console.log(response.data.fields);
        } catch (err) {
          setError("Failed to load template fields");
        } finally {
          setFieldsLoading(false);
        }
      };

      fetchTemplateFields();
    }
  }, [selectedTemplate]);
  // configure the templates for use as values in new ticket
  useEffect(() => {
    if (templateFields.length > 0) {
      const initialFormData: FormDataItem[] = templateFields.map((field) => {
        if (field.type === "DateRange") {
          return {
            key: field.name,
            name: field.name,
            value: "",
            priorityValue: "",
            slaValue: 0,
            dateRange: {
              startName: field.dateRange?.startName || "",
              startDateTime: "",
              endName: field.dateRange?.endName || "",
              endDateTime: "",
            },

            required: field.required,
            valueType: field.type,
            type: field.type,
            htmlType: "datetime",
            options: [],
          };
        }
        if (field.type === "Editor") {
          return {
            key: field.name,
            name: field.name,
            value: "",
            priorityValue: "",
            slaValue: 0,
            editor: {
              data: field.editor?.data || "",
            },
            required: field.required,
            valueType: field.type,
            type: field.type,
            htmlType: "Editor",
            options: [],
          };
        }
        if (field.type === "Sla-priority") {
          return {
            key: field.name,
            name: field.name,
            value: "",
            priorityValue: "",
            slaValue: 0,
            slas: field.slas,
            required: field.required,
            valueType: field.type,
            type: field.type,
            htmlType: "Sla-priority",
            options: [],
          };
        }

        return {
          key: field.name,
          name: field.name,
          value: "",
          priorityValue: "",
          slaValue: 0,
          required: field.required,
          valueType: field.type,
          type: field.type,
          htmlType: field.type === "Select" ? "dropdown" : "inputText",
          options: field.options,
        };
      });
      setFormData(initialFormData);
    }
  }, [templateFields]);

  // SLA / PRIORITY handler method
  const handlePriorityChange = (
    e: React.ChangeEvent<{ value: unknown }>, // Change event for Select
    fieldName: string,
    slas?: []
  ) => {
    const newPriorityValue = e.target.value as string; // Get the new priority value from the event
    const slaValue = getSlaByPriorityLabel(newPriorityValue, slas || []);
    setFormData((prevData) =>
      prevData.map((item) => {
        if (item.key === fieldName) {
          return {
            ...item,
            value: newPriorityValue, // Update the priority value for this field
            slaValue: slaValue,
          };
        }
        return item; // Return the unchanged item if key doesn't match
      })
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string,
    specificity?: string
  ) => {
    setFormData((prevData) =>
      prevData.map((item) => {
        // Check if the field name matches
        if (item.key === fieldName) {
          const newValue = e.target.value;

          // console.log(
          //   `Updating item with key: ${item.key}, new value: ${newValue}`
          // );

          // Use switch to handle different innerFieldNames
          switch (specificity) {
            case "dateRange.startDateTime":
              return {
                ...item,
                dateRange: {
                  ...item.dateRange,
                  startDateTime: newValue, // Update startDateTime
                },
              };
            case "dateRange.endDateTime":
              return {
                ...item,
                dateRange: {
                  ...item.dateRange,
                  endDateTime: newValue, // Update endDateTime
                },
              };
            // case "priority":
            //   return {
            //     ...item,
            //     priorityValue: newValue,
            //     slaValue: item.slas?.length,
            //   };
            default:
              // For any other field (if innerFieldName is not matched)
              return { ...item, value: newValue }; // Update value as the default
          }
        }

        return item; // Return unchanged item if no match found
      })
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // Generate a unique ID for the ticket and ticketId (this can vary depending on your business logic)
    const ticketId = `TICKET-${Math.floor(Math.random() * 1000000)}`;
    const id = `ID-${Math.floor(Math.random() * 1000000)}`;

    // Create the Ticket object
    const ticket: Ticket = {
      ticketId: ticketId,
      title: ticketTitle,
      description: ticketDescription,
      status: "pending", // Initial status can be set as pending
      values: formData,
    };

    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE
        }/api/process/tickets/create-from-template/${selectedTemplate}`,
        { ticket, updateMessages }
      );
      setSnackbarMessage("Ticket submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Optionally navigate to another page
      // navigate("/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
      setSnackbarMessage(
        err.response?.data?.message || "Failed to create ticket"
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

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Create Ticket from Template
              </Typography>
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
                label="Ticket Title"
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Ticket Description"
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                required
                multiline
                rows={4}
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
                            value={field.value as string}
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
                            value={field.value as string}
                            onChange={(e) => handleInputChange(e, field.key)}
                            required={field.required}
                            sx={{ mb: 2 }}
                          />
                        )}
                      {field.htmlType === "inputText" &&
                        field.valueType === "Date" && (
                          <TextField
                            fullWidth
                            type="date"
                            label={field.key}
                            value={field.value as string}
                            onChange={(e) => handleInputChange(e, field.key)}
                            required={field.required}
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
                              value={field.value as string}
                              onChange={(e) => handleInputChange(e, field.key)}
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
                      {field.htmlType === "Editor" && (
                        <TextField
                          multiline
                          rows={4}
                          fullWidth
                          label={field.key}
                          value={field.value as string}
                          onChange={(e) => handleInputChange(e, field.key)}
                          required={field.required}
                        />
                      )}
                      {field.htmlType === "Sla-priority" && (
                        <>
                          <FormControl sx={{ minWidth: 200, ml: 1 }}>
                            <InputLabel>Priority</InputLabel>
                            <Select
                              label={field.key}
                              value={field.value || ""}
                              onChange={(e) =>
                                handlePriorityChange(e, field.key, field.slas)
                              }
                            >
                              <MenuItem value="">
                                <em>Priority</em>
                              </MenuItem>
                              {field.slas?.map((sla, index) => (
                                <MenuItem key={index} value={sla.priorityLabel}>
                                  {sla.priorityLabel}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <Fab
                            variant="extended"
                            color="success"
                            sx={{ ml: 2 }}
                          >
                            <AccessAlarmsIcon sx={{ mr: 1 }} />
                            SLA : {field.slaValue} H
                          </Fab>
                        </>
                      )}
                      {/* it must be daterange in place of datetime */}
                      {field.htmlType === "datetime" && (
                        <Grid container spacing={2}>
                          {/* 2 spacing units */}
                          <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={
                                  field.dateRange?.startName || "Start Date"
                                }
                                value={
                                  field.dateRange?.startDateTime
                                    ? dayjs(field.dateRange.startDateTime) // Ensure this returns a Day.js object
                                    : null
                                }
                                onChange={(newValue) => {
                                  handleInputChange(
                                    {
                                      target: {
                                        value: newValue?.toISOString(),
                                      },
                                    },
                                    `${field.key}`,
                                    "dateRange.startDateTime"
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    required={field.required}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={field.dateRange?.endName || "End Date"}
                                value={
                                  field.dateRange?.endDateTime
                                    ? dayjs(field.dateRange.endDateTime) // Ensure this returns a Day.js object
                                    : null
                                }
                                onChange={(newValue) => {
                                  handleInputChange(
                                    {
                                      target: {
                                        value: newValue?.toISOString(),
                                      },
                                    },
                                    `${field.key}`,
                                    "dateRange.endDateTime"
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    required={field.required}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Box>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Paper sx={{ p: 2 }}>
              {/* Tabs Component */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="tabs"
              >
                <Tab label="Update" />
                <Tab label="Comment" />
                <Tab label="Assignments" />
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ p: 3 }}>
                {activeTab === 0 && (
                  <Updates
                    updateMessages={updateMessages}
                    setUpdateMessages={setUpdateMessages}
                    onChange={handleUpdateInputChange}
                  />
                )}
                {activeTab === 1 && (
                  <Comment
                    commentData={commentData}
                    onChange={handleCommentChange}
                  />
                )}
                {activeTab === 2 && (
                  <Assignments
                    assignmentsList={assigns}
                    setAssignmentsList={setAssigns}
                  />
                )}
              </Box>
            </Paper>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Ticket"}
              </Button>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Paper>
          </Box>
        </form>

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

export default CreateTicket;
