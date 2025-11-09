import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
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
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Layout from "../Layout";

/*TODO
update the dialog edit part at bottom of the file to add daterange , sla etc..

*/

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

interface DateRange {
  startName: string;
  startDateTime: string; // You might consider using Date type if you're working with Date objects
  endName: string;
  endDateTime: string; // Same as above
}
interface Sla {
  priorityLabel: string; // criticity or priority it depends on the context
  sla: number; // in hours
}
interface Editor {
  data: string;
}

interface Field {
  id: number;
  name: string;
  type: string; // dateRange / Text / Editor
  options: string[];
  required: boolean;
  dateRange?: DateRange; // Optional property
  slas?: Sla[]; // Optional array of SLA objects
  editor?: Editor;
}
function arrayify(rows: any[]): Row[] {
  return rows.map((row) => {
    if (Array.isArray(row)) return row;
    var length = Object.keys(row).length;
    for (; length > 0; --length) if (row[length - 1] != null) break;
    return Array.from({ length, ...row });
  });
}

const TicketEditTemplate: React.FC = () => {
  const { id } = useParams();
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

  const [data, setData] = useState<any | null>(null);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  //field custom value
  const [startCustomName, setStartCustomName] = useState<string>("");
  const [endCustomName, setEndCustomName] = useState<string>("");

  //sla management
  const [slas, setSlas] = useState<Sla[]>([]); // State to hold an array of SLA objects

  const addSla = () => {
    setSlas([...slas, { priorityLabel: "", sla: 0 }]); // Add a new SLA object
  };

  const handlePriorityLabelChange = (index: number, value: string) => {
    const updatedSlas = [...slas];
    updatedSlas[index].priorityLabel = value;
    setSlas(updatedSlas);
  };

  const handleSlaChange = (index: number, value: string) => {
    const numberValue = Number(value);
    if (value === "" || numberValue >= 0) {
      const updatedSlas = [...slas];
      updatedSlas[index].sla = numberValue;
      setSlas(updatedSlas);
    }
  };
  // this part concern the field slas list dropdown
  const handleSlaSelectChange = (fieldId: number, selectedSla: Sla | null) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId
          ? { ...field, selectedSla } // Store the selected SLA for the field
          : field
      )
    );
  };

  //useEffect to load an existing template for editing
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/admin/process/ticket/template/${id}`
        );
        const { templateName, fields, description, active } = response.data;
        console.log(response.data);
        setTemplateName(templateName);
        if (fields.length > 0) {
          setFields(
            fields.map((field) => ({
              id: uuidv4(), // Generate unique ID// Use timestamp or other unique method
              name: field.name,
              type: field.type, // Default type, can be adjusted
              options: field.options,
              required: field.required,
              fieldType: field.type,
              dateRange: field.dateRange,
              slas: field.slas,
            }))
          );
        }

        setDescription(description);
        setActive(active); // Set the active status
      } catch (err) {
        setError("Failed to load template");
      }
    };

    fetchTemplate();
  }, [id]);
  // useEffect to load fields with excel file headers
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
      dateRange:
        fieldType === "DateRange"
          ? {
              startName: startCustomName, // this part have to be reviewed
              endName: endCustomName, // this part have to be reviewed
              startDateTime: "",
              endDateTime: "",
            }
          : undefined,
      slas: fieldType === "Sla-priority" ? slas : [],
    };

    setFields((prevFields) => [...prevFields, newField]);
    // Resetting state after adding the field
    setFieldName("");
    setFieldType("String");
    setFieldOptions("");
    setIsFieldRequired(false);
    setStartCustomName(""); // Reset
    setEndCustomName(""); // Reset
    // setPriorityLabel(""); // Reset
    // setSla(0); // Reset
    setSlas([]);
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
    setSelectedIcon("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log(fields);
    try {
      await axios.put(
        `http://localhost:8080/api/admin/process/ticket/template/update/${id}`,
        {
          templateName,
          fields,
          description,
          icon: selectedIcon, // Include the selected icon
        }
      );
      // handleClearForm();
      setSnackbarMessage("Element template submitted successfully.");
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
              Create Ticket Template
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
            {/* display of fields that are added  */}
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
                        <Chip
                          label={`Field name : ${field.name}`}
                          variant="outlined"
                        />
                        <Chip
                          label={`Field type : ${field.type}`}
                          variant="outlined"
                        />
                        {/* displaying added field infos */}
                        {field.type === "DateRange" && (
                          <>
                            <Chip
                              label={`Custom start name : ${
                                field.dateRange?.startName || "Start Date"
                              }`}
                              variant="outlined"
                            />
                            <Chip
                              label={`Custom end name: ${
                                field.dateRange?.endName || "End Date"
                              }`}
                              variant="outlined"
                            />
                          </>
                        )}
                        {/* dont mind the red error they must to be deleted */}
                        {field.type === "Sla-priority" && (
                          <>
                            <FormControl sx={{ minWidth: 200, ml: 1 }}>
                              {/* <InputLabel id={`sla-select-label-${field.id}`}>
                                Select SLA
                              </InputLabel> */}
                              <Select
                                labelId={`sla-select-label-${field.id}`}
                                value={
                                  field.selectedSla
                                    ? field.selectedSla.priorityLabel
                                    : ""
                                }
                                onChange={(e) => {
                                  const selectedSla =
                                    field.slas?.find(
                                      (sla) =>
                                        sla.priorityLabel === e.target.value
                                    ) || null;
                                  handleSlaSelectChange(field.id, selectedSla);
                                }}
                                displayEmpty
                                renderValue={(selected) =>
                                  selected ? selected : <em>Priority/SLA</em>
                                } // Adjust display for selected value
                              >
                                <MenuItem value="">
                                  <em>Priority/SLA</em>
                                </MenuItem>
                                {field.slas?.map((sla, index) => (
                                  <MenuItem
                                    key={index}
                                    value={sla.priorityLabel}
                                  >
                                    {sla.priorityLabel} (SLA: {sla.sla} hours)
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </>
                        )}
                        {field.required ? (
                          <Chip
                            label="(Required *)"
                            variant="outlined"
                            color="error"
                          />
                        ) : (
                          ""
                        )}
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
            {/* add a field */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Field Name"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                />
              </Grid>
              {/* field type selection */}
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
                    {/* new item */}
                    {/* <MenuItem value="Editor">Editor</MenuItem> */}
                    <MenuItem value="DateRange">Date Range</MenuItem>
                    <MenuItem value="Sla-priority">Sla-priority</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    {/* <MenuItem value="Float">Float</MenuItem>
                    <MenuItem value="Location">Location</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>

              {/* if field is required */}
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
              {/* if the field type need addtional element then display those inputs */}
              {/* select */}
              {fieldType === "Select" && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Options (comma separated)"
                      value={fieldOptions}
                      onChange={(e) => setFieldOptions(e.target.value)}
                    />
                  </Grid>
                </>
              )}
              {/* date range */}
              {fieldType === "DateRange" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Time Custom Name"
                      value={startCustomName}
                      onChange={(e) => setStartCustomName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Time Custom Name"
                      value={endCustomName}
                      onChange={(e) => setEndCustomName(e.target.value)}
                    />
                  </Grid>
                </>
              )}
              {/* SLA priority */}
              {fieldType === "Sla-priority" && (
                <>
                  {slas.map((sla, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Priority Label"
                          value={sla.priorityLabel}
                          onChange={(e) =>
                            handlePriorityLabelChange(index, e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="SLA (in Hours)"
                          value={sla.sla}
                          inputProps={{ min: 0 }} // Set minimum value to 0
                          onChange={(e) =>
                            handleSlaChange(index, e.target.value)
                          }
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                  {/* </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <Button
                      onClick={addSla}
                      variant="contained"
                      color="success"
                    >
                      Add SLA
                    </Button>
                  </Grid>
                </>
              )}
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

export default TicketEditTemplate;
