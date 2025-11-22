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
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
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
  };
  editor?: {
    data: string;
  };
  slas: SLA[];
}

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
  };
  editor?: {
    data: string;
  };
  slas: SLA[];
}

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
  return slaObject ? slaObject.sla : undefined;
};

interface Ticket {
  id?: string;
  ticketId: string;
  title: string;
  description: string;
  status: "pending" | "closed" | "paused" | "cancel";
  ticketTemplate?: Template;
  values: Field[] | FormDataItem[];
}
// ---- Types ----
export interface CommentAttachment {
  id: string;
  name: string;
  type: string; // mime type string like "image/png", "application/pdf", etc.
  url?: string; // optional if already uploaded / stored
}

export interface CommentMessage {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO string
  isOwn?: boolean; // true if message is from current user (for alignment)
  attachments?: CommentAttachment[];
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

  // const [assigns, setAssigns] = useState<AssignmentsList>({
  //   id: "",
  //   assignments: [],
  // });
  const [assignmentsList, setAssignmentsList] = useState<AssignmentsList>({
    id: "list-001",
    assignments: [
      {
        id: "a1",
        description: "Investigate network latency issue in Zone A",
        teamId: "team1",
        ticketAssigned: true,
        acknowledged: true,
        rejected: false,
        returned: false,
        onAssignDate: "2025-02-02T09:15:00Z",
        onAcknowledgementDate: "2025-02-02T09:30:00Z",
        rejectTicketDate: null,
        returnTicketDate: null,
      },
      {
        id: "a2",
        description: "Replace faulty router in Control Room",
        teamId: "team2",
        ticketAssigned: true,
        acknowledged: false,
        rejected: false,
        returned: false,
        onAssignDate: "2025-02-04T14:40:00Z",
        onAcknowledgementDate: null,
        rejectTicketDate: null,
        returnTicketDate: null,
      },
      {
        id: "a3",
        description: "Review weekly maintenance checklist",
        teamId: "team3",
        ticketAssigned: false,
        acknowledged: false,
        rejected: false,
        returned: false,
        onAssignDate: "2025-02-05T08:10:00Z",
        onAcknowledgementDate: null,
        rejectTicketDate: null,
        returnTicketDate: null,
      },
      {
        id: "a4",
        description: "Prepare incident report for system outage",
        teamId: "team1",
        ticketAssigned: true,
        acknowledged: true,
        rejected: false,
        returned: true,
        onAssignDate: "2025-02-06T16:25:00Z",
        onAcknowledgementDate: "2025-02-06T16:40:00Z",
        rejectTicketDate: null,
        returnTicketDate: "2025-02-06T18:20:00Z",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState(0);

  const [updateMessages, setUpdateMessages] = useState<UpdateMessages>({
    updatesTitle: "My Updates",
    updates: [],
  });

  const [updateData, setUpdateData] = useState("");
  const [commentData, setCommentData] = useState("");
  // --- comment handler ---
  const [comments, setComments] = useState<CommentMessage[]>([]);
  // --- Handlers for tabs / updates / comments ---

  const handleUpdateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUpdateData(e.target.value);
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setActiveTab(newValue);
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCommentData(e.target.value);
  };

  // --- Fetch templates ---

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/process/ticket/template/all`
        );
        setTemplates(response.data.templates || []);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  // --- Fetch template fields when template changes ---

  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/admin/process/ticket/template/${selectedTemplate}`
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

  // --- Initialize formData based on template fields ---

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
            editor: field.editor,
            slas: field.slas || [],
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
            slas: field.slas || [],
          };
        }

        if (field.type === "Sla-priority") {
          return {
            key: field.name,
            name: field.name,
            value: "",
            priorityValue: "",
            slaValue: 0,
            slas: field.slas || [],
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
          slas: field.slas || [],
        };
      });
      setFormData(initialFormData);
    } else {
      setFormData([]);
    }
  }, [templateFields]);

  // --- SLA / Priority change handler ---

  const handlePriorityChange = (
    e: any,
    fieldName: string,
    slas?: SLA[]
  ): void => {
    const newPriorityValue = e.target.value as string;
    const slaValue = getSlaByPriorityLabel(newPriorityValue, slas || []);
    setFormData((prevData) =>
      prevData.map((item) =>
        item.key === fieldName
          ? {
              ...item,
              value: newPriorityValue,
              slaValue: slaValue || 0,
            }
          : item
      )
    );
  };

  // --- Input change handler (normal + DateRange) ---

  const handleInputChange = (
    e: { target: { value: string } },
    fieldName: string,
    specificity?: string
  ): void => {
    setFormData((prevData) =>
      prevData.map((item) => {
        if (item.key !== fieldName) return item;

        const newValue = e.target.value;

        switch (specificity) {
          case "dateRange.startDateTime":
            return {
              ...item,
              dateRange: {
                ...item.dateRange,
                startDateTime: newValue,
              },
            };
          case "dateRange.endDateTime":
            return {
              ...item,
              dateRange: {
                ...item.dateRange,
                endDateTime: newValue,
              },
            };
          default:
            return { ...item, value: newValue };
        }
      })
    );
  };

  // --- Submit handler ---

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const ticketId = `TICKET-${Math.floor(Math.random() * 1000000)}`;

    const newTicket: Ticket = {
      ticketId,
      title: ticketTitle,
      description: ticketDescription,
      status: "pending",
      values: formData as any,
    };

    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/process/tickets/create-from-template/${selectedTemplate}`,
        { ticket: newTicket, updateMessages, assignmentsList: assignmentsList }
      );
      setSnackbarMessage("Ticket submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create ticket";
      setError(msg);
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (): void => {
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Create Ticket from Template
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Select a ticket template, fill in the required fields, and attach
              updates, comments, and assignments before submitting.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Ticket info & template fields */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                mb: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Stack spacing={3}>
                {/* Template & Ticket Info */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Ticket & Template"
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

                    <TextField
                      fullWidth
                      label="Ticket Title"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      required
                    />

                    <TextField
                      fullWidth
                      label="Ticket Description"
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      required
                      multiline
                      rows={4}
                    />
                  </Stack>
                </Box>

                {/* Dynamic template fields */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Template Fields"
                      color="secondary"
                      variant="outlined"
                    />
                  </Divider>

                  {fieldsLoading ? (
                    <Box sx={{ textAlign: "center", mt: 2, mb: 1 }}>
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
                      Select a template to load its fields.
                    </Typography>
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
                                  value={field.value}
                                  onChange={(e) =>
                                    handleInputChange(e as any, field.key)
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

                          {/* Editor */}
                          {field.htmlType === "Editor" && (
                            <TextField
                              multiline
                              rows={4}
                              fullWidth
                              label={field.key}
                              value={field.value}
                              onChange={(e) => handleInputChange(e, field.key)}
                              required={field.required}
                            />
                          )}

                          {/* SLA / Priority */}
                          {field.htmlType === "Sla-priority" && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <FormControl
                                sx={{ minWidth: 200, mr: 2 }}
                                size="small"
                              >
                                <InputLabel>Priority</InputLabel>
                                <Select
                                  label="Priority"
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    handlePriorityChange(
                                      e,
                                      field.key,
                                      field.slas
                                    )
                                  }
                                  required={field.required}
                                >
                                  <MenuItem value="">
                                    <em>Select priority</em>
                                  </MenuItem>
                                  {field.slas?.map((sla, index) => (
                                    <MenuItem
                                      key={index}
                                      value={sla.priorityLabel}
                                    >
                                      {sla.priorityLabel}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <Fab
                                variant="extended"
                                color="success"
                                size="small"
                              >
                                <AccessAlarmsIcon sx={{ mr: 1 }} />
                                SLA: {field.slaValue || 0} H
                              </Fab>
                            </Box>
                          )}

                          {/* Date range */}
                          {field.htmlType === "datetime" && (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={
                                      field.dateRange?.startName || "Start Date"
                                    }
                                    value={
                                      field.dateRange?.startDateTime
                                        ? dayjs(field.dateRange.startDateTime)
                                        : null
                                    }
                                    onChange={(newValue) => {
                                      handleInputChange(
                                        {
                                          target: {
                                            value:
                                              newValue?.toISOString() || "",
                                          },
                                        },
                                        field.key,
                                        "dateRange.startDateTime"
                                      );
                                    }}
                                  />
                                </LocalizationProvider>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={
                                      field.dateRange?.endName || "End Date"
                                    }
                                    value={
                                      field.dateRange?.endDateTime
                                        ? dayjs(field.dateRange.endDateTime)
                                        : null
                                    }
                                    onChange={(newValue) => {
                                      handleInputChange(
                                        {
                                          target: {
                                            value:
                                              newValue?.toISOString() || "",
                                          },
                                        },
                                        field.key,
                                        "dateRange.endDateTime"
                                      );
                                    }}
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
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                mb: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Divider textAlign="left" sx={{ mb: 2 }}>
                <Chip
                  label="Collaboration"
                  color="primary"
                  variant="outlined"
                />
              </Divider>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="ticket-tabs"
                sx={{ mb: 2 }}
              >
                <Tab label="Updates" />
                <Tab label="Comments" />
                <Tab label="Assignments" />
              </Tabs>

              <Box sx={{ mt: 1 }}>
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

            {/* Submit */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={18} /> : undefined
                  }
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </Button>
              </Box>
            </Paper>
          </form>

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
        </Container>
      </Box>
    </Layout>
  );
};

export default CreateTicket;
