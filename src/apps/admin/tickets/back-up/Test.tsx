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
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface Template {
  id: string;
  templateName: string;
}

interface Field {
  name: string;
  type: string;
  required: boolean;
  options?: string[];
  dateRange?: {
    startName: string;
    endName: string;
  };
}

interface FormDataItem {
  key: string;
  value:
    | string
    | {
        startName: string;
        startDateTime: Date;
        endName: string;
        endDateTime: Date;
      };
  required: boolean;
  valueType: string;
  htmlType: string;
  options?: string[];
}

const EditTicket: React.FC = () => {
  const { id } = useParams();
  const { ticketId } = useParams<{ ticketId: string }>();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateFields, setTemplateFields] = useState<Field[]>([]);
  const [ticketTitle, setTicketTitle] = useState<string>("");
  const [ticketDescription, setTicketDescription] = useState<string>("");
  const [formData, setFormData] = useState<FormDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsLoading, setFieldsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const navigate = useNavigate();

  useEffect(() => {
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

  useEffect(() => {
    const fetchTicketDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/process/tickets/${id}`
        );
        const ticket = response.data;

        setTicketTitle(ticket.title);
        setTicketDescription(ticket.description);
        setSelectedTemplate(ticket.ticketTemplate.id);
        // Populate formData based on ticket fields
        const initialFormData: FormDataItem[] = ticket.fields.map(
          (field: Field) => ({
            key: field.name,
            value:
              field.type === "DateRange"
                ? {
                    startName: field.dateRange?.startName || "",
                    startDateTime:
                      ticket.values[field.name]?.startDateTime || null,
                    endName: field.dateRange?.endName || "",
                    endDateTime: ticket.values[field.name]?.endDateTime || null,
                  }
                : ticket.values[field.name] || "",
            required: field.required,
            valueType: field.type,
            htmlType: field.type === "Select" ? "dropdown" : "inputText",
            options: field.options,
          })
        );
        setFormData(initialFormData);
      } catch (err) {
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/admin/process/ticket/template/${selectedTemplate}`
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
  }, [selectedTemplate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ) => {
    setFormData((prevData) =>
      prevData.map((item) =>
        item.key === fieldName ? { ...item, value: e.target.value } : item
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/process/tickets/${ticketId}`, {
        title: ticketTitle,
        description: ticketDescription,
        values: formData,
      });
      setSnackbarMessage("Ticket updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Optionally navigate to another page
      // navigate("/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket");
      setSnackbarMessage(
        err.response?.data?.message || "Failed to update ticket"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateFields.length > 0) {
      const initialFormData: FormDataItem[] = templateFields.map((field) => {
        if (field.type === "DateRange") {
          return {
            key: field.name,
            value: {
              startName: field.dateRange?.startName || "",
              startDateTime: "",
              endName: field.dateRange?.endName || "",
              endDateTime: "",
            },
            required: field.required,
            valueType: field.type,
            htmlType: "datetime",
            options: [],
          };
        }

        return {
          key: field.name,
          value: "",
          required: field.required,
          valueType: field.type,
          htmlType: field.type === "Select" ? "dropdown" : "inputText",
          options: field.options,
        };
      });
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
            Edit Ticket
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
                    {field.htmlType === "datetime" && (
                      <div style={{ marginBottom: "16px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={field.value.startName}
                            value={
                              (field.value as any).startDateTime
                                ? new Date((field.value as any).startDateTime)
                                : null
                            }
                            onChange={(newValue) => {
                              handleInputChange(
                                { target: { value: newValue?.toISOString() } },
                                `${field.key}.startDateTime`
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required={field.required}
                                sx={{ mb: 2 }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            sx={{ ml: 2 }}
                            label={field.value.endName}
                            value={
                              (field.value as any).endDateTime
                                ? new Date((field.value as any).endDateTime)
                                : null
                            }
                            onChange={(newValue) => {
                              handleInputChange(
                                { target: { value: newValue?.toISOString() } },
                                `${field.key}.endDateTime`
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required={field.required}
                                sx={{ mb: 2 }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
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
                {loading ? <CircularProgress size={24} /> : "Update Ticket"}
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

export default EditTicket;
