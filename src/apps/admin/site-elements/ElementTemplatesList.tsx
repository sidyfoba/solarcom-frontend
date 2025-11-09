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

const getIconByValue = (value: string) => {
  const icon = icons.find((icon) => icon.value === value);
  return icon ? icon.icon : null;
};

const ElementTemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/infrastructure/element/template/all"
        );
        setTemplates(response.data);
        console.log(response.data);
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

  const handleDelete = async (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/admin/infrastructure/element/template/delete/${templateId}`
        );
        const temps = templates.filter(
          (template) => template.id !== templateId
        );
        setTemplates(temps);
      } catch (err) {
        setError("Failed to delete template");
      }
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 3, width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Template List
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {templates.map((template) => (
                <ListItem key={template.id} divider>
                  <ListItemIcon>{getIconByValue(template.icon)}</ListItemIcon>
                  <ListItemText
                    primary={template.templateName}
                    secondary={template.description || "No description"}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(template.id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ElementTemplatesList;
