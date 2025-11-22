import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  Container,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { read, utils, WorkBook, WorkSheet } from "xlsx";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState, FC } from "react";
import { v4 as uuidv4 } from "uuid";
import Layout from "../Layout";

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

const SiteCreateTemplate: FC = () => {
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

  // When Excel headers change, auto-generate fields
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
      editable: true,
      flex: 1,
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
      .catch((err) => {
        console.error("Error fetching rows and columns:", err);
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

    const first = wb.SheetNames[0];
    const { rows: newRows, columns: newColumns } = await getRowsCols(
      wb.Sheets as DataSet,
      first
    );

    setRows(newRows);
    setColumns(newColumns);
    setCurrentSheet(first);
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
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/infrastructure/site/template/create`,
        {
          templateName,
          fields,
          description,
        }
      );
      handleClearForm();
      setSnackbarMessage("Site template submitted successfully.");
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
          {/* Page header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Create Site Template
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Define reusable site templates by configuring fields manually or
              importing them from an Excel file.
            </Typography>
          </Box>

          <Stack spacing={3}>
            {/* Main card: template config + field builder + upload */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Template info */}
                  <Box>
                    <Divider textAlign="left" sx={{ mb: 3 }}>
                      <Chip
                        label="Template Information"
                        color="primary"
                        variant="outlined"
                      />
                    </Divider>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        required
                        placeholder="e.g. Site Template - Production"
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        multiline
                        minRows={2}
                        placeholder="Short description of what this template is used for."
                      />
                    </Stack>
                  </Box>

                  {/* Fields section */}
                  <Box>
                    <Divider textAlign="left" sx={{ mb: 3 }}>
                      <Chip
                        label="Fields Configuration"
                        color="secondary"
                        variant="outlined"
                      />
                    </Divider>

                    {/* Existing fields list */}
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Defined Fields
                      </Typography>
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
                        {fields.length === 0 && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            No fields added yet. Use the form below to add your
                            first field or import them from Excel.
                          </Typography>
                        )}
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
                        ))}
                      </Box>
                    </Box>

                    {/* Add field form */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Add New Field
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Field Name"
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            placeholder="e.g. Environment"
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
                              placeholder="e.g. dev, staging, prod"
                            />
                          )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: {
                                xs: "flex-start",
                                sm: "flex-end",
                              },
                            }}
                          >
                            <Button onClick={handleAddField} variant="outlined">
                              Add Field
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Excel import / Data preview */}
                  <Box>
                    <Divider textAlign="left" sx={{ mb: 3 }}>
                      <Chip
                        label="Excel Import & Preview"
                        color="info"
                        variant="outlined"
                      />
                    </Divider>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{ xs: "stretch", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" color="text.secondary">
                        Import field definitions from an Excel file. The first
                        row will be used as column headers.
                      </Typography>
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
                    </Stack>

                    {loadingExcelData && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mt: 3,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}

                    {!loadingExcelData && sheets.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          sx={{ mb: 2 }}
                        >
                          <Typography variant="body2">
                            Utilisez la liste déroulante pour passer à une
                            feuille de calcul :
                          </Typography>
                          <FormControl
                            sx={{ minWidth: 200 }}
                            variant="outlined"
                          >
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
                        </Stack>

                        <Paper
                          variant="outlined"
                          sx={{ height: 400, width: "100%" }}
                        >
                          <DataGrid
                            rows={rows}
                            columns={columns}
                            disableRowSelectionOnClick
                          />
                        </Paper>
                      </Box>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box>
                    {error && (
                      <Typography color="error" sx={{ mb: 1 }}>
                        {error}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={handleClearForm}
                      >
                        Clear
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={
                          loading ? <CircularProgress size={18} /> : null
                        }
                      >
                        {loading ? "Creating..." : "Create Template"}
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </form>
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
          </Stack>
        </Container>
      </Box>

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
    </Layout>
  );
};

export default SiteCreateTemplate;
