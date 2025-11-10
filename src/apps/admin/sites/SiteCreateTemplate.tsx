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
} from "@mui/material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";

import { read, utils, WorkSheet } from "xlsx";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
type Row = { id: number } & any[]; // Each row should have an 'id' property
type RowCol = { rows: Row[]; columns: GridColDef[] };

interface Field {
  id: number;
  name: string;
  type: string;
  options: string[];
  required: boolean;
}
function arrayify(rows: any[]): Row[] {
  return rows.map((row) => {
    if (Array.isArray(row)) return row;
    var length = Object.keys(row).length;
    for (; length > 0; --length) if (row[length - 1] != null) break;
    return Array.from({ length, ...row });
  });
}

const SiteCreateTemplate: React.FC = () => {
  const [templateName, setTemplateName] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldName, setFieldName] = useState<string>("");
  const [fieldType, setFieldType] = useState<string>("String");
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
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [workBook, setWorkBook] = useState<DataSet>({} as DataSet);
  const [sheets, setSheets] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");
  // const [selectedRow, setSelectedRow] = useState<GridRowModel | null>(null);
  // const [openDialog, setOpenDialog] = useState<boolean>(false);
  // const [headers, setHeaders] = useState<string[]>([]);
  // const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any | null>(null);
  // const [id, setId] = useState<string>("");
  // const [newData, setNewData] = useState<any | null>({});

  // const navigate = useNavigate();
  //   const location = useLocation();
  //   const headers = (location.state?.headers as string[]) || [];

  useEffect(() => {
    if (excelHeaders.length > 0) {
      setFields(
        excelHeaders.map((header) => ({
          id: uuidv4(), // Generate unique ID// Use timestamp or other unique method
          name: header,
          type: "String", // Default type, can be adjusted
          options: [],
        }))
      );
    }
  }, [excelHeaders]);

  const getRowsCols = async (
    data: DataSet,
    sheetName: string
  ): Promise<RowCol> => {
    const sheet = data[sheetName];
    const range = utils.decode_range(sheet["!ref"] || "A1");
    const headers: string[] = [];

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[utils.encode_cell({ r: range.s.r, c: C })];
      headers.push(cell ? String(cell.v) : `Column ${C + 1}`);
    }
    setExcelHeaders(headers);
    const rows = utils
      .sheet_to_json<Row>(sheet, { header: 1 })
      .slice(1)
      .map((r, id) => ({ id, ...r }));

    const updatedColumns = [
      ...headers.map((header, index) => ({
        field: String(index),
        headerName: header,
        editable: true,
      })),
    ];
    return {
      rows: rows,
      columns: updatedColumns,
    };
  };

  function selectSheet(name: string) {
    // workBook[current] = utils.aoa_to_sheet(arrayify(rows));
    setWorkBook(data.Sheets);
    const new_rows: Row[] = [];
    const new_columns: GridColDef[] = [];

    getRowsCols(workBook, name)
      .then(({ rows: new_rows, columns: new_columns }) => {
        setRows(new_rows);
        setColumns(new_columns);
        setCurrent(name);
      })
      .catch((error) => {
        console.error("Error fetching rows and columns:", error);
      });
  }

  async function handleAB(file: ArrayBuffer): Promise<void> {
    const data = read(file);
    setData(data);
    setWorkBook(data.Sheets);
    setSheets(data.SheetNames);

    const name = data.SheetNames[0];

    getRowsCols(data.Sheets, name)
      .then(({ rows: new_rows, columns: new_columns }) => {
        setRows(new_rows);
        setColumns(new_columns);
        setCurrent(name);
        setLoadingExcelData(false);
        // Further processing or UI updates based on new_rows and new_columns
      })

      .catch((error) => {
        console.error("Error fetching rows and columns:", error);
        // Handle error appropriately
      });
  }

  async function handleFile(ev: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = ev.target.files?.[0];

    if (file) {
      setLoadingExcelData(true); // Set loading to true when file is being processed

      try {
        const fileArrayBuffer = await file.arrayBuffer();
        await handleAB(fileArrayBuffer);
      } catch (error) {
        console.error("Error handling file:", error);
      } finally {
        setLoadingExcelData(false); // Set loading to false when file processing is complete
      }
    }
  }
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
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE
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
    } catch (err) {
      setError(
        (err as any).response?.data?.message || "Failed to create form template"
      );
      setSnackbarMessage(error.message);
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
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            {/* <IconButton onClick={onNavigateToSiteTemplateExcelView} color="primary">
          <ArrowBack />
        </IconButton> */}
            <Typography variant="h6" gutterBottom ml={2}>
              Site Template
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
                        {field.name} ({field.type}){" "}
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
                {loading ? "Creating..." : "Create Template"}
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
              <Button
                sx={{ ml: 2 }}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFile}
                  aria-label="Upload Excel File"
                />
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </form>
        </Paper>
        <br />

        {loadingExcelData ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          sheets.length > 0 && (
            <>
              <Paper sx={{ p: 2 }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12}>
                    <p style={{ padding: 5 }}>
                      Utilisez la liste déroulante pour passer à une feuille de
                      calcul ::&nbsp;
                      <FormControl sx={{ width: 200 }} variant="outlined">
                        <InputLabel id="sheet-select-label">
                          Select Sheet
                        </InputLabel>
                        <Select
                          label=" Select Sheet"
                          labelId="sheet-select-label"
                          onChange={async (e) =>
                            selectSheet(sheets[e.target.value])
                          }
                          defaultValue={current}
                        >
                          {sheets.map((sheet, idx) => (
                            <MenuItem key={sheet} value={idx}>
                              {sheet}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </p>

                    <div style={{ height: 500, width: "100%" }}>
                      <DataGrid rows={rows} columns={columns} />
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )
        )}

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

export default SiteCreateTemplate;
