// src/components/TemplateList.js

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  ListItemIcon,
  Container,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
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

const getIconByValue = (value) => {
  const icon = icons.find((icon) => icon.value === value);
  return icon ? icon.icon : null;
};

const ElementTemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE
          }/api/admin/infrastructure/element/template/all`
        );
        setTemplates(response.data || []);
      } catch (err) {
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (templateId) => {
    navigate(`/admin/projects/element/template/edit/${templateId}`);
  };

  const handleDeleteClick = (templateId) => {
    setTemplateToDelete(templateId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/infrastructure/element/template/delete/${templateToDelete}`
      );
      setTemplates((prev) =>
        prev.filter((template) => template.id !== templateToDelete)
      );
      setSnackbarMessage("Template deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to delete template.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTemplateToDelete(null);
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Element Templates
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Browse, edit, and manage your element templates.
            </Typography>
          </Box>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Divider textAlign="left" sx={{ mb: 3 }}>
                  <Chip label="Templates" color="primary" variant="outlined" />
                </Divider>

                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={4}
                  >
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : templates.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    No templates found.
                  </Typography>
                ) : (
                  <List>
                    {templates.map((template) => (
                      <ListItem
                        key={template.id}
                        divider
                        sx={{
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <ListItemIcon>
                          {getIconByValue(template.icon)}
                        </ListItemIcon>
                        <ListItemText
                          primary={template.templateName}
                          secondary={template.description || "No description"}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEdit(template.id)}
                            sx={{ mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteClick(template.id)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Delete confirmation dialog */}
          <Dialog open={confirmOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this template?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

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

export default ElementTemplatesList;
