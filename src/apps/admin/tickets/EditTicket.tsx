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
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";

import Comment from "./Comment";
import Updates from "./Updates";
import Assignment from "./Assignments";
import Assignments from "./Assignments";
import { useNavigate, useParams } from "react-router-dom";
import { duration } from "moment";
import { calculateDuration, calculateDurationFromNow } from "../utils/utils";

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
    duration: "";
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
    duration?: string;
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
  values: FormDataItem[]; // list of fields associated with the ticket
}

interface UpdateTicketRequest {
  ticket: Ticket; // Replace with the appropriate type for 'ticket'
  updateMessages?: UpdateMessages; // Replace with the appropriate type for 'updateMessages'
  assignmentsList?: AssignmentsList; // Optional array for 'assignmentsList', or adjust the type accordingly
}

const EditTicket: React.FC = () => {
  const { id } = useParams();
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
  const [assignmentsList, setAssignmentsList] = useState<AssignmentsList>({
    assignments: [],
  });
  //commetns and updates
  // Handle the input change
  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData(e.target.value);
  };
  const [activeTab, setActiveTab] = useState(0); // State to track which tab is active
  const [updateMessages, setUpdateMessages] = useState<UpdateMessages>({
    updatesTitle: "My Updates", // Default title
    updates: [], // Empty array for updates
  });
  const [updateData, setUpdateData] = useState(""); // State for the update input field
  const [commentData, setCommentData] = useState(""); // State for the comment input field

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle the update input change
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData(e.target.value);
  };

  // Handle the comment input change
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData(e.target.value);
  };

  //
  const navigate = useNavigate();

  //fetch all templates
  useEffect(() => {
    // console.log(
    //   "hello *********************************************************************************"
    // );
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/process/ticket/template/all"
        );
        setTemplates(response.data.templates);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  //fecth ticket fields and related data
  useEffect(() => {
    const fetchTicketDetails = async () => {
      setLoading(true);
      setFieldsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/process/tickets/${id}`
        );
        const ticket = response.data;
        // console.log(response.data);
        setTicketTitle(ticket.title);
        setTicketDescription(ticket.description);
        setSelectedTemplate(ticket.ticketTemplate.id);
        setTicket(response.data);
      } catch (err) {
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
        setFieldsLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  //load ticket update messages if they exist
  useEffect(() => {
    const fetchUpdateMessages = async () => {
      // setLoading(true);
      // setFieldsLoading(true);
      try {
        const id = ticket?.updateMessagesId;
        const response = await axios.get(
          `http://localhost:8080/api/process/update/messages/${id}/updates`
        );
        const updateMessages = response.data;
        console.log(response.data);
        setUpdateMessages(updateMessages);
      } catch (err) {
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
        setFieldsLoading(false);
      }
    };

    fetchUpdateMessages();
  }, [ticket]);

  //load ticket assignments  list if they exist
  useEffect(() => {
    const fetchAssignmentsList = async () => {
      // setLoading(true);
      // setFieldsLoading(true);
      try {
        const id = ticket?.assignmentListId;
        const response = await axios.get(
          `http://localhost:8080/api/process/assignments-list/${id}/assignments`
        );
        const assignmentsList = response.data;
        console.log(response.data);
        setAssignmentsList(assignmentsList);
      } catch (err) {
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
        setFieldsLoading(false);
      }
    };

    fetchAssignmentsList();
  }, [ticket]);

  // load ticket fields
  useEffect(() => {
    if (ticket) {
      console.log("ticket");
      console.log(ticket);
      const initialFormData: FormDataItem[] = ticket.values.map((field) => {
        if (field.type === "DateRange") {
          return {
            key: field.name,
            name: field.name,
            value: field.value,
            priorityValue: "",
            slaValue: 0,
            dateRange: {
              startName: field.dateRange?.startName || "",
              startDateTime: field.dateRange?.startDateTime || "",
              endName: field.dateRange?.endName || "",
              endDateTime: field.dateRange?.endDateTime || "",
              duration: field.dateRange?.duration || "0",
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
            value: field.value,
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
          // const slaValue = getSlaByPriorityLabel(field.value, field.slas || []);
          return {
            key: field.name,
            name: field.name,
            value: field.value,

            priorityValue: field.priorityValue,
            slaValue: field.slaValue as number,
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
          value: field.value,
          priorityValue: "",
          slaValue: 0,
          required: field.required,
          valueType: field.type,
          htmlType: field.type === "Select" ? "dropdown" : "inputText",
          options: field.options,
          type: field.type,
        };
      });
      console.log(initialFormData);
      setFormData(initialFormData);
    }
  }, [ticket]);

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
            priorityValue: newPriorityValue, // Update the priority value for this field
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
              // comppute duration
              //if enddate is not null compute diff start & end
              if (item.dateRange!.endDateTime) {
                console.log("if enddate is not null compute diff start & end");
                item.dateRange!.duration = calculateDuration(
                  newValue,
                  item.dateRange!.endDateTime
                );
              } else {
                //if enddate is null compute diff start & now
                console.log("if enddate is null compute diff start & now");
                item.dateRange!.duration = calculateDurationFromNow(newValue);
              }

              return {
                ...item,
                dateRange: {
                  ...item.dateRange,
                  startDateTime: newValue, // Update startDateTime
                },
              };
            case "dateRange.endDateTime":
              // if start is not null  compute diff start & end
              if (item.dateRange!.startDateTime) {
                console.log("if start is not null  compute diff start & end");
                item.dateRange!.duration = calculateDuration(
                  item.dateRange!.startDateTime,
                  newValue
                );
                console.log("duration = " + item.dateRange!.duration);
              }
              // if start is null do nothing
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
    // const id = `ID-${Math.floor(Math.random() * 1000000)}`;
    console.log("formData");
    console.log(formData);
    // Create the Ticket object
    const ticket: Ticket = {
      ticketId: ticketId,
      title: ticketTitle,
      description: ticketDescription,
      status: "pending", // Initial status can be set as pending
      values: formData,
    };

    try {
      // console.log("assigns values");
      // console.log(assignmentsList);
      const requestData: UpdateTicketRequest = { ticket };

      if (updateMessages && updateMessages.updates.length > 0) {
        requestData.updateMessages = updateMessages;
      }
      if (assignmentsList && assignmentsList.assignments.length > 0) {
        requestData.assignmentsList = assignmentsList;
      }

      // id comes form  const { id } = useParams();
      await axios.put(
        `http://localhost:8080/api/process/tickets/update/${id}`,
        requestData
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
                Edit Ticket from Template
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                {/*  */}

                {formData.map((field) => (
                  <>
                    {" "}
                    {field.htmlType === "datetime" && (
                      <>
                        <Grid item xs={12} sm={3}>
                          <Grid container spacing={2}>
                            {/* 2 spacing units */}
                            {/* field.dateRange?.startDateTime */}
                            <Grid item xs={12} sm={12}>
                              <Fab size="small" color="success">
                                <AccessAlarmsIcon />
                              </Fab>
                              Duration : {field.dateRange?.duration} H
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {field.htmlType === "Sla-priority" && (
                      <Grid item xs={12} sm={3}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12}>
                            <Fab size="small" color="success">
                              <AccessAlarmsIcon />
                            </Fab>
                            SLA : {field.slaValue} H
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </>
                ))}

                {/*  */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ticket Title"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12}>
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
                </Grid>
              </Grid>

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
                          <Fab size="small" color="success">
                            <AccessAlarmsIcon />
                          </Fab>
                          SLA : {field.slaValue} H
                        </>
                      )}
                      {/* it must be daterange in place of datetime */}
                      {field.htmlType === "datetime" && (
                        <Grid container spacing={2}>
                          {/* 2 spacing units */}
                          <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DateTimePicker
                                ampm={false}
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
                              <DateTimePicker
                                ampm={false}
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
                    assignmentsList={assignmentsList}
                    setAssignmentsList={setAssignmentsList}
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
                {loading ? <CircularProgress size={24} /> : "Submit"}
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

export default EditTicket;
