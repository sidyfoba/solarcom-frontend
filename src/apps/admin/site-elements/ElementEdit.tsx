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
  IconButton,
  Container,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

import TowerIcon from "@mui/icons-material/CellTower";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import NetworkCellIcon from "@mui/icons-material/NetworkCell";
import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import StorageIcon from "@mui/icons-material/Storage";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import PowerIcon from "@mui/icons-material/Power";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import CableIcon from "@mui/icons-material/Cable";
import SatelliteIcon from "@mui/icons-material/Satellite";
import RouterIcon from "@mui/icons-material/Router";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import ShieldIcon from "@mui/icons-material/Shield";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";

const icons = [
  {
    value: "cell_tower",
    label: "Cell Towers",
    icon: <TowerIcon fontSize="small" />,
  },
  {
    value: "microwave_tower",
    label: "Microwave Towers",
    icon: <SignalCellularAltIcon fontSize="small" />,
  },
  {
    value: "omni_antenna",
    label: "Omni-Directional Antennas",
    icon: <WifiIcon fontSize="small" />,
  },
  {
    value: "directional_antenna",
    label: "Directional Antennas",
    icon: <WifiTetheringIcon fontSize="small" />,
  },
  {
    value: "bts",
    label: "Base Transceiver Station (BTS)",
    icon: <NetworkCellIcon fontSize="small" />,
  },
  {
    value: "bsc",
    label: "Base Station Controller (BSC)",
    icon: <NetworkWifiIcon fontSize="small" />,
  },
  {
    value: "equipment_shelter",
    label: "Equipment Shelters",
    icon: <StorageIcon fontSize="small" />,
  },
  {
    value: "cooling_system",
    label: "Cooling Systems",
    icon: <AcUnitIcon fontSize="small" />,
  },
  {
    value: "generator",
    label: "Generators",
    icon: <PowerIcon fontSize="small" />,
  },
  {
    value: "ups",
    label: "Uninterruptible Power Supplies (UPS)",
    icon: <BatteryChargingFullIcon fontSize="small" />,
  },
  {
    value: "batteries",
    label: "Batteries",
    icon: <BatteryFullIcon fontSize="small" />,
  },
  {
    value: "microwave_radios",
    label: "Microwave Radios",
    icon: <SignalCellularAltIcon fontSize="small" />,
  },
  {
    value: "fiber_optic_cables",
    label: "Fiber Optic Cables",
    icon: <CableIcon fontSize="small" />,
  },
  {
    value: "satellite_links",
    label: "Satellite Links",
    icon: <SatelliteIcon fontSize="small" />,
  },
  {
    value: "leased_lines",
    label: "Leased Lines",
    icon: <RouterIcon fontSize="small" />,
  },
  {
    value: "network_noc",
    label: "Network Operation Centers (NOCs)",
    icon: <NetworkCheckIcon fontSize="small" />,
  },
  {
    value: "management_software",
    label: "Management Software",
    icon: <SettingsIcon fontSize="small" />,
  },
  {
    value: "physical_security",
    label: "Physical Security",
    icon: <SecurityIcon fontSize="small" />,
  },
  {
    value: "cybersecurity",
    label: "Cybersecurity Measures",
    icon: <ShieldIcon fontSize="small" />,
  },
  {
    value: "fire_suppression",
    label: "Fire Suppression Systems",
    icon: <FireExtinguisherIcon fontSize="small" />,
  },
  {
    value: "power_cables",
    label: "Power Cables",
    icon: <ElectricBoltIcon fontSize="small" />,
  },
  {
    value: "data_cables",
    label: "Data Cables",
    icon: <DataUsageIcon fontSize="small" />,
  },
  {
    value: "monitoring_systems",
    label: "Monitoring Systems",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    value: "maintenance_tools",
    label: "Maintenance Tools",
    icon: <BuildIcon fontSize="small" />,
  },
];

const getIconByValue = (value: string) => {
  const icon = icons.find((icon) => icon.value === value);
  return icon ? icon.icon : null;
};

const ElementEdit = () => {
  const { id } = useParams();
  const [element, setElement] = useState<any | null>(null);
  const [templateId, setTemplateId] = useState<string>("");
  const [templateName, setTemplateName] = useState<string>("");
  const [templateFields, setTemplateFields] = useState<any[]>([]);
  const [elementName, setElementName] = useState<string>("");
  const [formData, setFormData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsLoading, setFieldsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const navigate = useNavigate();

  // Load element
  useEffect(() => {
    const fetchElement = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/infrastructure/element/${id}`
        );
        const data = response.data;
        setElement(data);
        setElementName(data.elementName);
        setTemplateId(data.elementTemplate.id);
        setTemplateName(data.elementTemplate.templateName);
      } catch (err) {
        setError("Failed to load element");
      } finally {
        setLoading(false);
      }
    };

    fetchElement();
  }, [id]);

  // Load template fields
  useEffect(() => {
    if (templateId) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/admin/infrastructure/element/template/${templateId}`
          );
          setTemplateFields(response.data.fields || []);
        } catch (err) {
          setError("Failed to load template fields");
        } finally {
          setFieldsLoading(false);
        }
      };

      fetchTemplateFields();
    }
  }, [templateId]);

  // Initialize formData based on template fields + current element values
  useEffect(() => {
    if (!element || templateFields.length === 0) return;

    const initialFormData = templateFields.map((field, index) => {
      const value =
        element.values && element.values.length > index
          ? element.values[index].value
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
  }, [templateFields, element]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;
    setFormData((prevData) =>
      prevData.map((item) =>
        item.key === fieldName ? { ...item, value } : item
      )
    );
  };

  const handleSelectChange = (e: any, fieldName: string) => {
    const value = e.target.value;
    setFormData((prevData) =>
      prevData.map((item) =>
        item.key === fieldName ? { ...item, value } : item
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!element) return;
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE
        }/api/infrastructure/element/update-from-template`,
        {
          id: element.id,
          elementName,
          elementTemplate: element.elementTemplate,
          values: formData,
        }
      );
      setSnackbarMessage("Element submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update element";
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
          {/* Header */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Update Element
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Modify element information and its template-based attributes.
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
            {loading && !element ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Loading element...
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  {/* Element / Template Info */}
                  <Box>
                    <Divider textAlign="left" sx={{ mb: 3 }}>
                      <Chip
                        label="Element & Template Information"
                        color="primary"
                        variant="outlined"
                      />
                    </Divider>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Template Name"
                          value={templateName}
                          sx={{ mb: { xs: 1, md: 0 } }}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Element Name"
                          value={elementName}
                          onChange={(e) => setElementName(e.target.value)}
                          required
                        />
                      </Grid>
                    </Grid>
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
                      <Box sx={{ textAlign: "center", mt: 2 }}>
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
                        No configurable fields for this template.
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
                                      handleSelectChange(e, field.key)
                                    }
                                    required={field.required}
                                  >
                                    {field.options?.map(
                                      (option: string, index: number) => (
                                        <MenuItem
                                          key={`${field.key}-${index}`}
                                          value={option}
                                        >
                                          {option}
                                        </MenuItem>
                                      )
                                    )}
                                  </Select>
                                </FormControl>
                              )}
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>

                  {/* Error + Submit */}
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
                        disabled={loading}
                        startIcon={
                          loading ? <CircularProgress size={18} /> : null
                        }
                      >
                        {loading ? "Updating..." : "Update Element"}
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </form>
            )}
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
        </Container>
      </Box>
    </Layout>
  );
};

export default ElementEdit;
