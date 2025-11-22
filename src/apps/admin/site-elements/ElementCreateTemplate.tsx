import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { read, utils, WorkSheet, WorkBook } from "xlsx";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState, FC } from "react";
import { v4 as uuidv4 } from "uuid";
import Layout from "../Layout";

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

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type DataSet = { [index: string]: WorkSheet };

type Row = {
  id: number;
  [key: string]: any;
};

type RowCol = { rows: Row[]; columns: GridColDef[] };

interface Field {
  id: string;
  name: string;
  type: "String" | "Number" | "Date" | "Select";
  options: string[];
  required: boolean;
}

type SnackbarSeverity = "success" | "error" | "info" | "warning";

const ElementCreateTemplate: FC = () => {
  const [templateName, setTemplateName] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldName, setFieldName] = useState<string>("");
  const [fieldType, setFieldType] = useState<Field["type"]>("String");
  const [fieldOptions, setFieldOptions] = useState<string>("");
  const [isFieldRequired, setIsFieldRequired] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<Field | null>(null);

  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [loadingExcelData, setLoadingExcelData] = useState<boolean>(false);

  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [workBook, setWorkBook] = useState<DataSet>({} as DataSet);
  const [sheets, setSheets] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string>("");
  const [rawWB, setRawWB] = useState<WorkBook | null>(null);

  const [selectedIcon, setSelectedIcon] = useState<string>("");

  // Auto-generate fields from Excel headers
  useEffect(() => {
    if (excelHeaders.length > 0) {
      setFields(
        excelHeaders.map((header) => ({
          id: uuidv4(),
          name: header,
          type: "String",
          options: [],
          required: false,
        }))
      );
    }
  }, [excelHeaders]);

  const getRowsCols = async (
    data: DataSet,
    sheetName: string
  ): Promise<RowCol> => {
    const sheet = data[sheetName];
    if (!sheet) return { rows: [], columns: [] };

    const range = utils.decode_range(sheet["!ref"] || "A1");
    const headers: string[] = [];

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[utils.encode_cell({ r: range.s.r, c: C })];
      headers.push(cell ? String(cell.v) : `Column ${C + 1}`);
    }
    setExcelHeaders(headers);

    const sheetRows = utils
      .sheet_to_json<any[]>(sheet, { header: 1 })
      .slice(1)
      .map((r, id) => {
        const row: Row = { id: id + 1 };
        r.forEach((value, colIndex) => {
          row[colIndex.toString()] = value;
        });
        return row;
      });

    const updatedColumns: GridColDef[] = headers.map((header, index) => ({
      field: String(index),
      headerName: header,
      flex: 1,
      editable: true,
    }));

    return {
      rows: sheetRows,
      columns: updatedColumns,
    };
  };

  const selectSheet = (name: string) => {
    if (!workBook || !name) return;

    getRowsCols(workBook, name)
      .then(({ rows: newRows, columns: newColumns }) => {
        setRows(newRows);
        setColumns(newColumns);
        setCurrentSheet(name);
      })
      .catch((error) => {
        console.error("Error fetching rows and columns:", error);
        setSnackbarMessage("Error loading sheet data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleAB = async (file: ArrayBuffer): Promise<void> => {
    const wb = read(file);
    setRawWB(wb);
    setWorkBook(wb.Sheets as DataSet);
    setSheets(wb.SheetNames);

    const firstSheet = wb.SheetNames[0];
    const { rows: newRows, columns: newColumns } = await getRowsCols(
      wb.Sheets as DataSet,
      firstSheet
    );

    setRows(newRows);
    setColumns(newColumns);
    setCurrentSheet(firstSheet);
    setLoadingExcelData(false);
  };

  const handleFile = async (
    ev: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = ev.target.files?.[0];

    if (file) {
      setLoadingExcelData(true);
      try {
        const fileArrayBuffer = await file.arrayBuffer();
        await handleAB(fileArrayBuffer);
      } catch (error) {
        console.error("Error handling file:", error);
        setSnackbarMessage("Error handling Excel file");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoadingExcelData(false);
      }
    }
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;

    const newField: Field = {
      id: uuidv4(),
      name: fieldName.trim(),
      type: fieldType,
      options:
        fieldType === "Select"
          ? fieldOptions
              .split(",")
              .map((opt) => opt.trim())
              .filter(Boolean)
          : [],
      required: isFieldRequired,
    };

    setFields((prevFields) => [...prevFields, newField]);
    setFieldName("");
    setFieldType("String");
    setFieldOptions("");
    setIsFieldRequired(false);
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
    setExcelHeaders([]);
    setRows([]);
    setColumns([]);
    setSheets([]);
    setCurrentSheet("");
    setRawWB(null);
    setSelectedIcon("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/infrastructure/element/template/create`,
        {
          templateName,
          fields,
          description,
          icon: selectedIcon || null,
        }
      );
      handleClearForm();
      setSnackbarMessage("Element template submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to create form template";
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
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Element Template
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Define element templates, fields, and optionally bootstrap them
              from an Excel file.
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
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Template info & icon */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Template Information"
                      color="primary"
                      variant="outlined"
                    />
                  </Divider>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Icon</InputLabel>
                        <Select
                          label="Icon"
                          value={selectedIcon}
                          onChange={(e) =>
                            setSelectedIcon(e.target.value as string)
                          }
                        >
                          {iconOptions.map((iconOption) => (
                            <MenuItem
                              key={iconOption.value}
                              value={iconOption.value}
                            >
                              <Box display="flex" alignItems="center" gap={1}>
                                {iconOption.icon}
                                <Typography variant="body2">
                                  {iconOption.label}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        multiline
                        minRows={2}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Fields list */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip label="Fields" color="secondary" variant="outlined" />
                  </Divider>

                  <Box
                    sx={{
                      maxHeight: 240,
                      overflowY: "auto",
                      padding: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? "grey.50"
                          : "background.default",
                    }}
                  >
                    {fields.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        No fields defined yet. Use the form below or import from
                        Excel.
                      </Typography>
                    ) : (
                      fields.map((field) => (
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
                              {field.name} ({field.type}){" "}
                              {field.required ? "(Required)" : ""}
                            </Typography>
                            {field.type === "Select" &&
                              field.options.length > 0 && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Options: {field.options.join(", ")}
                                </Typography>
                              )}
                          </Grid>
                          <Grid item>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleFieldEdit(field)}
                            >
                              Edit
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleFieldDelete(field)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      ))
                    )}
                  </Box>
                </Box>

                {/* Add field */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Add / Edit Field Definition"
                      color="info"
                      variant="outlined"
                    />
                  </Divider>
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
                          onChange={(e) =>
                            setFieldType(e.target.value as Field["type"])
                          }
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
                            onChange={(e) =>
                              setIsFieldRequired(e.target.checked)
                            }
                          />
                        }
                        label="Required"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {fieldType === "Select" && (
                        <TextField
                          fullWidth
                          label="Options (comma separated)"
                          value={fieldOptions}
                          onChange={(e) => setFieldOptions(e.target.value)}
                          placeholder="e.g. low, medium, high"
                        />
                      )}
                    </Grid>
                  </Grid>
                </Box>

                {/* Excel import + actions */}
                <Box>
                  <Divider textAlign="left" sx={{ mb: 3 }}>
                    <Chip
                      label="Import from Excel (optional)"
                      color="default"
                      variant="outlined"
                    />
                  </Divider>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload file
                      <VisuallyHiddenInput
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFile}
                        aria-label="Upload Excel File"
                      />
                    </Button>
                    {loadingExcelData && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CircularProgress size={18} />
                        <Typography variant="body2" color="text.secondary">
                          Processing Excel file...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Form actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    onClick={handleAddField}
                    variant="outlined"
                    color="primary"
                  >
                    Add Field
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Template"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearForm}
                  >
                    Clear
                  </Button>
                </Box>

                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </Stack>
            </form>
          </Paper>

          {/* Excel preview */}
          {loadingExcelData ? (
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            sheets.length > 0 && (
              <Paper sx={{ p: 2, mt: 3 }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Excel Preview
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Utilisez la liste déroulante pour passer à une feuille de
                      calcul :
                    </Typography>
                    <FormControl sx={{ width: 240, mb: 2 }} variant="outlined">
                      <InputLabel id="sheet-select-label">
                        Select Sheet
                      </InputLabel>
                      <Select
                        label="Select Sheet"
                        labelId="sheet-select-label"
                        value={
                          currentSheet
                            ? sheets.indexOf(currentSheet)
                            : ("" as any)
                        }
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          const name = sheets[idx];
                          selectSheet(name);
                        }}
                      >
                        {sheets.map((sheet, idx) => (
                          <MenuItem key={sheet} value={idx}>
                            {sheet}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box sx={{ height: 500, width: "100%" }}>
                      <DataGrid
                        rows={rows}
                        columns={columns}
                        disableRowSelectionOnClick
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )
          )}

          {/* Edit field dialog */}
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
                      setCurrentField({
                        ...currentField,
                        name: e.target.value,
                      })
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
                          type: e.target.value as Field["type"],
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
                            .map((opt) => opt.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  )}
                  <FormControlLabel
                    sx={{ mt: 1 }}
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

          {/* Delete confirmation dialog */}
          <Dialog
            open={confirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this field?
              </Typography>
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

export default ElementCreateTemplate;
