// src/components/EditTicket.tsx

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
  Container,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import Comment from "./Comment";
import Updates from "./Updates";
import Assignments from "./Assignments";
import { useParams } from "react-router-dom";
import { calculateDuration, calculateDurationFromNow } from "../utils/utils";

interface Template {
  id: string;
  templateName: string;
}

interface SLA {
  priorityLabel: string;
  sla: number;
}

interface Field {
  name: string;
  value: string;
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
  slas?: SLA[];
}

// field values backed in ticket
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
    startName?: string;
    endName?: string;
    endDateTime?: string;
    duration?: string;
  };
  editor?: {
    data: string;
  };
  slas?: SLA[];
}

// Update structures
interface Update {
  id: string;
  text: string;
  updateNumber: number;
  date: string;
}

interface UpdateMessages {
  id?: string;
  updatesTitle: string;
  updates: Update[];
}

// Assignments structures
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
  id?: string;
  assignments: Assignment[];
}

const getSlaByPriorityLabel = (
  priorityLabel: string,
  slas: SLA[]
): number | undefined => {
  const slaObject = slas.find((sla) => sla.priorityLabel === priorityLabel);
  return slaObject ? slaObject.sla : undefined;
};

interface Ticket {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: "pending" | "closed" | "paused" | "cancel";
  ticketTemplate: Template;
  values: FormDataItem[];
  updateMessagesId?: string;
  assignmentListId?: string;
}

interface UpdateTicketRequest {
  ticket: Ticket;
  updateMessages?: UpdateMessages;
  assignmentsList?: AssignmentsList;
}

const EditTicket: React.FC = () => {
  const { id } = useParams();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [ticketTitle, setTicketTitle] = useState<string>("");
  const [ticketDescription, setTicketDescription] = useState<string>("");
  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
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

  // comments / updates / tabs
  // --- comment handler ---
  const [comments, setComments] = useState<CommentMessage[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [updateMessages, setUpdateMessages] = useState<UpdateMessages>({
    updatesTitle: "Ticket Updates",
    updates: [],
  });
  const [updateData, setUpdateData] = useState("");
  const [commentData, setCommentData] = useState("");

  // --- Handlers for tabs / updates / comments ---

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData(e.target.value);
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setActiveTab(newValue);
  };

  // --- Fetch templates ---

  useEffect(() => {
    const fetchTemplates = async () => {
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

  // --- Fetch ticket details ---

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) return;
      setLoading(true);
      setFieldsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/process/tickets/${id}`
        );
        const ticketData: Ticket = response.data;
        setTicketTitle(ticketData.title);
        setTicketDescription(ticketData.description);
        setSelectedTemplate(ticketData.ticketTemplate.id);
        setTicket(ticketData);
      } catch (err) {
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
        setFieldsLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  // --- Fetch update messages ---

  useEffect(() => {
    const fetchUpdateMessages = async () => {
      if (!ticket?.updateMessagesId) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/process/update/messages/${
            ticket.updateMessagesId
          }/updates`
        );
        setUpdateMessages(response.data);
      } catch (err) {
        setError("Failed to load ticket update messages");
      }
    };

    if (ticket) fetchUpdateMessages();
  }, [ticket]);

  // --- Fetch assignments list ---

  useEffect(() => {
    const fetchAssignmentsList = async () => {
      if (!ticket?.assignmentListId) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/process/assignments-list/${
            ticket.assignmentListId
          }/assignments`
        );
        setAssignmentsList(response.data);
      } catch (err) {
        setError("Failed to load assignments");
      }
    };

    if (ticket) fetchAssignmentsList();
  }, [ticket]);

  // --- Map ticket values into formData ---

  useEffect(() => {
    if (ticket) {
      const initialFormData: FormDataItem[] = ticket.values.map(
        (field: any) => {
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
        }
      );
      setFormData(initialFormData);
    }
  }, [ticket]);

  // --- SLA / Priority handler ---

  const handlePriorityChange = (e: any, fieldName: string, slas?: SLA[]) => {
    const newPriorityValue = e.target.value as string;
    const slaValue = slas ? getSlaByPriorityLabel(newPriorityValue, slas) : 0;

    setFormData((prevData) =>
      prevData.map((item) =>
        item.key === fieldName
          ? {
              ...item,
              priorityValue: newPriorityValue,
              slaValue: slaValue ?? 0,
              value: newPriorityValue,
            }
          : item
      )
    );
  };

  // --- Input change handler (normal + DateRange) ---

  const handleInputChange = (
    e: { target: { value: any } },
    fieldName: string,
    specificity?: string
  ) => {
    setFormData((prevData) =>
      prevData.map((item) => {
        if (item.key !== fieldName) return item;

        const newValue = e.target.value;

        switch (specificity) {
          case "dateRange.startDateTime": {
            if (item.dateRange?.endDateTime) {
              item.dateRange.duration = calculateDuration(
                newValue,
                item.dateRange.endDateTime
              );
            } else {
              item.dateRange!.duration = calculateDurationFromNow(newValue);
            }

            return {
              ...item,
              dateRange: {
                ...item.dateRange,
                startDateTime: newValue,
              },
            };
          }
          case "dateRange.endDateTime": {
            if (item.dateRange?.startDateTime) {
              item.dateRange.duration = calculateDuration(
                item.dateRange.startDateTime,
                newValue
              );
            }
            return {
              ...item,
              dateRange: {
                ...item.dateRange,
                endDateTime: newValue,
              },
            };
          }
          default:
            return { ...item, value: newValue };
        }
      })
    );
  };

  // --- Submit handler ---

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticket) return;

    setLoading(true);

    const ticketId =
      ticket.ticketId || `TICKET-${Math.floor(Math.random() * 1000000)}`;

    const ticketPayload: Ticket = {
      ...(ticket || ({} as Ticket)),
      ticketId,
      title: ticketTitle,
      description: ticketDescription,
      status: ticket.status || "pending",
      values: formData,
      ticketTemplate: ticket.ticketTemplate || {
        id: selectedTemplate,
        templateName: "",
      },
    };

    try {
      const requestData: UpdateTicketRequest = { ticket: ticketPayload };

      if (updateMessages && updateMessages.updates.length > 0) {
        requestData.updateMessages = updateMessages;
      }
      if (assignmentsList && assignmentsList.assignments.length > 0) {
        requestData.assignmentsList = assignmentsList;
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE}/api/process/tickets/update/${id}`,
        requestData
      );

      setSnackbarMessage("Ticket updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update ticket";
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

  // --- comment handler ---
  // const [comments, setComments] = useState<CommentMessage[]>([]);

  const handleSendComment = async ({
    text,
    files,
  }: {
    text: string;
    files: File[];
  }) => {
    // 1) Upload files to your backend / storage
    // 2) Create a new CommentMessage with returned URLs
    const newMessage: CommentMessage = {
      id: crypto.randomUUID(),
      author: "You",
      isOwn: true,
      text,
      createdAt: new Date().toISOString(),
      attachments: files.map((file, index) => ({
        id: `${file.name}-${index}`,
        name: file.name,
        type: file.type,
        // url: "https://your-storage-url" after upload
      })),
    };

    setComments((prev) => [...prev, newMessage]);
  };

  // --- Render ---

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
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Header */}
              <Box>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  Edit Ticket
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Update ticket details, custom fields, SLA and comments.
                </Typography>
              </Box>

              {/* Main card */}
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  backgroundColor: "background.paper",
                }}
              >
                <Stack spacing={3}>
                  {/* Ticket / template info */}
                  <Box>
                    <Divider textAlign="left" sx={{ mb: 3 }}>
                      <Chip
                        label="Ticket Information"
                        color="primary"
                        variant="outlined"
                      />
                    </Divider>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Template</InputLabel>
                          <Select
                            label="Template"
                            value={selectedTemplate}
                            onChange={(e) =>
                              setSelectedTemplate(e.target.value as string)
                            }
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

                      {/* SLA / Duration chips */}
                      {formData.map((field) => (
                        <React.Fragment key={`${field.key}-summary`}>
                          {field.htmlType === "datetime" && (
                            <Grid item xs={12} sm={3}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Fab size="small" color="success">
                                  <AccessAlarmsIcon />
                                </Fab>
                                <Typography variant="body2">
                                  {field.dateRange?.startName || "Duration"}:{" "}
                                  {field.dateRange?.duration} H
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {field.htmlType === "Sla-priority" && (
                            <Grid item xs={12} sm={3}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Fab size="small" color="success">
                                  <AccessAlarmsIcon />
                                </Fab>
                                <Typography variant="body2">
                                  SLA: {field.slaValue} H
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </React.Fragment>
                      ))}

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Ticket Title"
                          value={ticketTitle}
                          onChange={(e) => setTicketTitle(e.target.value)}
                          required
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
                          minRows={3}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Dynamic fields */}
                  <Box>
                    <Divider textAlign="left" sx={{ mb: 3 }}>
                      <Chip
                        label="Ticket Fields"
                        color="secondary"
                        variant="outlined"
                      />
                    </Divider>

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
                            {/* String */}
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

                            {/* Number */}
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

                            {/* Date */}
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

                            {/* Select */}
                            {field.htmlType === "dropdown" &&
                              field.valueType === "Select" && (
                                <FormControl fullWidth>
                                  <InputLabel>{field.key}</InputLabel>
                                  <Select
                                    label={field.key}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      handleInputChange(e as any, field.key)
                                    }
                                    required={field.required}
                                  >
                                    {field.options?.map((option, idx) => (
                                      <MenuItem key={idx} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}

                            {/* Editor */}
                            {field.htmlType === "Editor" && (
                              <TextField
                                multiline
                                rows={4}
                                fullWidth
                                label={field.key}
                                value={field.value}
                                onChange={(e) =>
                                  handleInputChange(e, field.key)
                                }
                                required={field.required}
                              />
                            )}

                            {/* SLA / Priority */}
                            {field.htmlType === "Sla-priority" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  flexWrap: "wrap",
                                }}
                              >
                                <FormControl sx={{ minWidth: 200 }}>
                                  <InputLabel>Priority</InputLabel>
                                  <Select
                                    label={field.key}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      handlePriorityChange(
                                        e,
                                        field.key,
                                        field.slas
                                      )
                                    }
                                  >
                                    <MenuItem value="">
                                      <em>Priority</em>
                                    </MenuItem>
                                    {field.slas?.map((sla, idx) => (
                                      <MenuItem
                                        key={`${field.key}-${idx}`}
                                        value={sla.priorityLabel}
                                      >
                                        {sla.priorityLabel}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Fab size="small" color="success">
                                    <AccessAlarmsIcon />
                                  </Fab>
                                  <Typography variant="body2">
                                    SLA: {field.slaValue} H
                                  </Typography>
                                </Box>
                              </Box>
                            )}

                            {/* DateTime range */}
                            {field.htmlType === "datetime" && (
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DateTimePicker
                                      ampm={false}
                                      label={
                                        field.dateRange?.startName ||
                                        "Start Date"
                                      }
                                      value={
                                        field.dateRange?.startDateTime
                                          ? dayjs(field.dateRange.startDateTime)
                                          : null
                                      }
                                      onChange={(newValue) =>
                                        handleInputChange(
                                          {
                                            target: {
                                              value:
                                                newValue?.toISOString() || "",
                                            },
                                          },
                                          field.key,
                                          "dateRange.startDateTime"
                                        )
                                      }
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DateTimePicker
                                      ampm={false}
                                      label={
                                        field.dateRange?.endName || "End Date"
                                      }
                                      value={
                                        field.dateRange?.endDateTime
                                          ? dayjs(field.dateRange.endDateTime)
                                          : null
                                      }
                                      onChange={(newValue) =>
                                        handleInputChange(
                                          {
                                            target: {
                                              value:
                                                newValue?.toISOString() || "",
                                            },
                                          },
                                          field.key,
                                          "dateRange.endDateTime"
                                        )
                                      }
                                    />
                                  </LocalizationProvider>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </Stack>
              </Paper>

              {/* Updates / Comments / Assignments */}
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                }}
              >
                <Divider textAlign="left" sx={{ mb: 2 }}>
                  <Chip
                    label="Collaborative Information"
                    color="info"
                    variant="outlined"
                  />
                </Divider>

                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="ticket details tabs"
                  sx={{ mb: 2 }}
                >
                  <Tab label="Updates" />
                  <Tab label="Comments" />
                  <Tab label="Assignments" />
                </Tabs>

                <Box sx={{ pt: 2 }}>
                  {activeTab === 0 && (
                    <Updates
                      updateMessages={updateMessages}
                      setUpdateMessages={setUpdateMessages}
                      onChange={handleUpdateInputChange}
                    />
                  )}
                  {activeTab === 1 && (
                    <Comment messages={comments} onSend={handleSendComment} />
                  )}
                  {activeTab === 2 && (
                    <Assignments
                      assignmentsList={assignmentsList}
                      setAssignmentsList={setAssignmentsList}
                    />
                  )}
                </Box>
              </Paper>

              {/* Actions */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {error && (
                  <Typography color="error" sx={{ mr: "auto" }}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} /> : null}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Paper>
            </Stack>
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
        </Container>
      </Box>
    </Layout>
  );
};

export default EditTicket;
