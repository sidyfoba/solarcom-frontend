// src/components/EditTemplate.js

import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

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

const iconOptions = [
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

interface Field {
  id: number;
  name: string;
  type: string;
  options: string[];
  required: boolean;
}

const ElementEditTemplate = () => {
  const { id } = useParams();
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("String");
  const [fieldOptions, setFieldOptions] = useState("");
  const [isFieldRequired, setIsFieldRequired] = useState<boolean>(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<Field | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/admin/infrastructure/element/template/${id}`
        );
        console.log("response in edit element template");
        console.log(response.data);
        const { templateName, fields, description, active, icon } =
          response.data;
        setTemplateName(templateName);
        if (fields.length > 0) {
          setFields(
            fields.map((field) => ({
              id: uuidv4(), // Generate unique ID// Use timestamp or other unique method
              name: field.name,
              type: field.type, // Default type, can be adjusted
              options: field.options,
              required: field.required,
            }))
          );
        }

        setDescription(description);
        setActive(active); // Set the active status
        setSelectedIcon(icon);
      } catch (err) {
        setError("Failed to load template");
      }
    };

    fetchTemplate();
  }, [id]);

  const handleAddField = () => {
    if (!fieldName) return;

    const newField: Field = {
      id: uuidv4(),
      name: fieldName,
      type: fieldType,
      options:
        fieldType === "Select"
          ? fieldOptions.split(",").map((opt) => opt.trim())
          : [],
      required: isFieldRequired,
    };

    setFields((prevFields) => [...prevFields, newField]);
    setFieldName("");
    setFieldType("String");
    setFieldOptions("");
    setIsFieldRequired(false); // Reset the required state
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
        prevFields.filter((field) => field.id !== fieldToDelete.id)
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
    setSelectedIcon("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/infrastructure/element/template/update/${id}`,
        {
          templateName,
          fields,
          description,
          active,
          icon: selectedIcon,
        }
      );
      setSnackbarMessage("Element template submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // navigate("/admin/projects/site/template/all"); // Redirect after successful update
    } catch (err) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setError(err.response?.data?.message || "Failed to update template");
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
      <Box sx={{ padding: 3, width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" gutterBottom ml={2}>
              {t("edit_template")}
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Icon</InputLabel>
                <Select
                  label="Icon"
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value as string)}
                >
                  {iconOptions.map((iconOption) => (
                    <MenuItem key={iconOption.value} value={iconOption.value}>
                      <Box display="flex" alignItems="center">
                        {iconOption.icon}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {iconOption.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body">Fields</Typography>
              <Box
                sx={{
                  maxHeight: 240, // Adjust this value as needed
                  overflowY: "auto", // Enable vertical scrolling
                  padding: 1, // Optional: add some padding inside the scrollable area
                }}
              >
                {fields.map((field) => (
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
                        {field.name} ({field.type})
                        {field.required ? "(Required)" : ""}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => handleFieldEdit(field)}
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleFieldDelete(field)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Box>
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
                    onChange={(e) => setFieldType(e.target.value as string)}
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
                      onChange={(e) => setIsFieldRequired(e.target.checked)}
                    />
                  }
                  label="Required"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                {fieldType === "Select" && (
                  <TextField
                    fullWidth
                    label="Options (comma separated)"
                    value={fieldOptions}
                    onChange={(e) => setFieldOptions(e.target.value)}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Tooltip
                  title={active ? "Click to deactivate" : "Click to activate"}
                >
                  <IconButton
                    onClick={toggleActiveStatus}
                    color={active ? "primary" : "default"}
                  >
                    {active ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Button onClick={handleAddField} variant="outlined">
                Add Field
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Template"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={handleClearForm}
              >
                Clear
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </form>

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
                      setCurrentField({ ...currentField, name: e.target.value })
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
                            .map((opt) => opt.trim()),
                        })
                      }
                    />
                  )}
                  <FormControlLabel
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

        <Dialog
          open={confirmationDialogOpen}
          onClose={() => setConfirmationDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this field?</Typography>
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
      </Box>
    </Layout>
  );
};

export default ElementEditTemplate;
