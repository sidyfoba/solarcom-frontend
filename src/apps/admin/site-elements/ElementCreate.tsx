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
import { useNavigate } from "react-router-dom";

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
    icon: <TowerIcon />,
  },
  {
    value: "microwave_tower",
    label: "Microwave Towers",
    icon: <SignalCellularAltIcon />,
  },
  {
    value: "omni_antenna",
    label: "Omni-Directional Antennas",
    icon: <WifiIcon />,
  },
  {
    value: "directional_antenna",
    label: "Directional Antennas",
    icon: <WifiTetheringIcon />,
  },
  {
    value: "bts",
    label: "Base Transceiver Station (BTS)",
    icon: <NetworkCellIcon />,
  },
  {
    value: "bsc",
    label: "Base Station Controller (BSC)",
    icon: <NetworkWifiIcon />,
  },
  {
    value: "equipment_shelter",
    label: "Equipment Shelters",
    icon: <StorageIcon />,
  },
  {
    value: "cooling_system",
    label: "Cooling Systems",
    icon: <AcUnitIcon />,
  },
  {
    value: "generator",
    label: "Generators",
    icon: <PowerIcon />,
  },
  {
    value: "ups",
    label: "Uninterruptible Power Supplies (UPS)",
    icon: <BatteryChargingFullIcon />,
  },
  {
    value: "batteries",
    label: "Batteries",
    icon: <BatteryFullIcon />,
  },
  {
    value: "microwave_radios",
    label: "Microwave Radios",
    icon: <SignalCellularAltIcon />,
  },
  {
    value: "fiber_optic_cables",
    label: "Fiber Optic Cables",
    icon: <CableIcon />,
  },
  {
    value: "satellite_links",
    label: "Satellite Links",
    icon: <SatelliteIcon />,
  },
  {
    value: "leased_lines",
    label: "Leased Lines",
    icon: <RouterIcon />,
  },
  {
    value: "network_noc",
    label: "Network Operation Centers (NOCs)",
    icon: <NetworkCheckIcon />,
  },
  {
    value: "management_software",
    label: "Management Software",
    icon: <SettingsIcon />,
  },
  {
    value: "physical_security",
    label: "Physical Security",
    icon: <SecurityIcon />,
  },
  {
    value: "cybersecurity",
    label: "Cybersecurity Measures",
    icon: <ShieldIcon />,
  },
  {
    value: "fire_suppression",
    label: "Fire Suppression Systems",
    icon: <FireExtinguisherIcon />,
  },
  {
    value: "power_cables",
    label: "Power Cables",
    icon: <ElectricBoltIcon />,
  },
  {
    value: "data_cables",
    label: "Data Cables",
    icon: <DataUsageIcon />,
  },
  {
    value: "monitoring_systems",
    label: "Monitoring Systems",
    icon: <DashboardIcon />,
  },
  {
    value: "maintenance_tools",
    label: "Maintenance Tools",
    icon: <BuildIcon />,
  },
];

const getIconByValue = (value: string) => {
  const icon = icons.find((icon) => icon.value === value);
  return icon ? icon.icon : null;
};

const ElementCreate = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [elementeName, setElementName] = useState("");
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(false); // Add state for fields loading
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/infrastructure/element/template/all"
        );
        console.log("response from element template controller");
        console.log(response.data);
        setTemplates(response.data);
      } catch (err) {
        setError("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateFields = async () => {
        setFieldsLoading(true); // Set fieldsLoading to true when starting the fetch
        try {
          const response = await axios.get(
            `http://localhost:8080/api/admin/infrastructure/element/template/${selectedTemplate}`
          );
          setTemplateFields(response.data.fields);
        } catch (err) {
          setError("Failed to load template fields");
        } finally {
          setFieldsLoading(false); // Set fieldsLoading to false when fetch is complete
        }
      };

      fetchTemplateFields();
    }
  }, [selectedTemplate]);

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
      await axios.post(
        `http://localhost:8080/api/infrastructure/element/create-from-template/${selectedTemplate}`,
        { elementName: elementeName, values: formData }
      );
      // navigate("/sites"); // Redirect after successful site creation
      setSnackbarMessage("Element submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create element");
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Initialize formData based on template fields
  useEffect(() => {
    if (templateFields.length > 0) {
      const initialFormData = templateFields.map((field) => ({
        key: field.name,
        value: "",
        required: field.required,
        valueType: field.type,
        htmlType: field.type === "Select" ? "dropdown" : "inputText",
        options: field.options,
      }));
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
            Create Element from Template
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
                    {getIconByValue(template.icon)}
                    {template.templateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Element Name"
              value={elementeName}
              onChange={(e) => setElementName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            {fieldsLoading ? ( // Show loader when fields are loading
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
                          required={field.required} // Set required attribute based on field data
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
                          required={field.required} // Set required attribute based on field data
                          sx={{ mb: 2 }}
                        />
                      )}
                    {field.htmlType === "inputText" &&
                      field.valueType === "Date" && (
                        <TextField
                          fullWidth
                          type="date"
                          label={field.key}
                          value={field.value}
                          onChange={(e) => handleInputChange(e, field.key)}
                          required={field.required} // Set required attribute based on field data
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
                            value={field.value}
                            onChange={(e) => handleInputChange(e, field.key)}
                            required={field.required} // Set required attribute based on field data
                          >
                            {field.options?.map((option, index) => (
                              <MenuItem key={index} value={option}>
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
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create"}
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

export default ElementCreate;
