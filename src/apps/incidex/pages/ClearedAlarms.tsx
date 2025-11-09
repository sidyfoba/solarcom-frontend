import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { read, utils, WorkSheet, writeFile } from "xlsx";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import "./test.css";
import axios from "axios";
import { DataArray } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import Layout from "../../Layout";
import {
  mainListItemsIncidex,
  secondaryListItemsIncidex,
} from "./components/DrawerMenuIncidex";
import { Link } from "react-router-dom";
import AlarmsLinkButtons from "./components/AlarmsLinkButtons";

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
interface ComparisonResult {
  found: boolean;
  keysPercentage: number;
  valuesPercentage: number;
}

function arrayify(rows: any[]): Row[] {
  return rows.map((row) => {
    if (Array.isArray(row)) return row;
    var length = Object.keys(row).length;
    for (; length > 0; --length) if (row[length - 1] != null) break;
    return Array.from({ length, ...row });
  });
}

function arrayToObject(
  array: any[],
  headers: string[]
): { [key: string]: any } {
  array.splice(0, 1);
  let obj: { [key: string]: any } = {};

  headers.forEach((header, index) => {
    obj["" + header] = array[index];
  });
  return obj;
}

function compareJsonObjects(
  obj1: any,
  obj2: any,
  keys: string[],
  headers: string[]
): ComparisonResult {
  // Counters for matching keys and values
  let matchingKeys = 0;
  let totalKeys = 0;
  let matchingValues = 0;
  let totalValues = 0;
  let matchs = false;

  // // Iterate over keys in obj1

  const updatedRow = {};
  headers.forEach((header, index) => {
    updatedRow[header] = obj1[index] || null;
  });
  obj1 = updatedRow;

  for (let index = 0; index < keys.length; index++) {
    for (let index in keys) {
    }
    if (obj1.hasOwnProperty(keys[index])) {
      // Increment totalKeys counter
      totalKeys++;

      // Check if key exists in obj2
      if (obj2 != null && obj2.hasOwnProperty(keys[index])) {
        // Increment matchingKeys counter
        matchingKeys++;

        // Compare values of corresponding keys
        const val1 = obj1[keys[index]];
        const val2 = obj2[keys[index]];

        totalValues++;

        if (typeof val1 === "object" && typeof val2 === "object") {
          // Recursively compare nested objects and accumulate matching values
          const nestedResult = compareJsonObjects(val1, val2, keys, headers);
          matchingValues += nestedResult.valuesPercentage;
          totalValues += nestedResult.totalValues;
        } else if (val1 === val2) {
          console.log("matching string val1 = " + val1 + " val2 =" + val2);
          matchingValues++; // Increment matchingValues counter
        }
      }
    }
  }
  if (matchingValues > 0 && matchingValues >= keys.length) {
    matchs = true;
  }

  // Calculate percentage of matching keys
  // const keysPercentage = (matchingKeys / totalKeys) * 100;
  const keysPercentage = matchingKeys;

  // Calculate percentage of matching values
  // const valuesPercentage = (matchingValues / totalValues) * 100;
  const valuesPercentage = matchingValues;

  // Round percentages to two decimal places
  const roundedKeysPercentage = Math.round(keysPercentage * 100) / 100;
  const roundedValuesPercentage = Math.round(valuesPercentage * 100) / 100;

  return {
    found: matchs,
    keysPercentage: matchingKeys,
    valuesPercentage: matchingValues,
  };
}

const rowExistsInMongo = async (
  row: GridRowModel,
  selectedHeaders: string[],
  headers: string[]
): Promise<boolean> => {
  try {
    const response = await axios.get(`http://localhost:8080/api/getkeyvalue`);

    let result: ComparisonResult = {
      found: false,
      keysPercentage: 0,
      valuesPercentage: 0,
    };
    for (const obj of response.data) {
      result = compareJsonObjects(row, obj.data, selectedHeaders, headers);
      // console.log(
      //   "results = total keys = " +
      //     result.keysPercentage +
      //     " values = " +
      //     result.valuesPercentage
      // );
      if (result.found === true) {
        break;
      }
    }
    return result.found;
  } catch (error) {
    console.error("Error checking row in MongoDB:", error);
    return false;
  }
};

const getRowsCols = async (
  data: DataSet,
  sheetName: string,
  selectedHeaders: string[]
): Promise<RowCol> => {
  const sheet = data[sheetName];
  const range = utils.decode_range(sheet["!ref"] || "A1");
  const headers: string[] = [];

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = sheet[utils.encode_cell({ r: range.s.r, c: C })];
    headers.push(cell ? String(cell.v) : `Column ${C + 1}`);
  }

  const rows = utils
    .sheet_to_json<Row>(sheet, { header: 1 })
    .slice(1)
    .map((r, id) => ({ id, ...r }));

  const updatedRowsPromises = rows.map(async (row) => {
    const result = await rowExistsInMongo(row, selectedHeaders, headers); // Wait for the async function to resolve
    return { ...row, existsInMongo: result };
  });

  // Now use Promise.all() to await all the promises and get the resolved values
  const updatedRows = await Promise.all(updatedRowsPromises);
  return {
    rows: updatedRows,
    columns: headers.map((header, index) => ({
      field: String(index),
      headerName: header,
      editable: true,
    })),
  };
};

export default function ClearedAlarms() {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [workBook, setWorkBook] = useState<DataSet>({} as DataSet);
  const [sheets, setSheets] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<GridRowModel | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any | null>(null);
  ArrayBuffer;

  const dateTimeRegex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;

  function selectSheet(name: string) {
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    const new_rows: Row[] = [];
    const new_columns: GridColDef[] = [];

    getRowsCols(workBook, name, selectedHeaders)
      .then(({ rows: new_rows, columns: new_columns }) => {
        setRows(new_rows);
        setColumns(new_columns);
        setCurrent(name);
      })
      .catch((error) => {
        console.error("Error fetching rows and columns:", error);
        // Handle error appropriately
      });
  }

  async function handleAB(file: ArrayBuffer): Promise<void> {
    const data = read(file);
    setData(data);
    setWorkBook(data.Sheets);
    setSheets(data.SheetNames);

    const name = data.SheetNames[0];
    // const new_rows: Row[] = [];
    // const new_columns: GridColDef[] = [];

    getRowsCols(data.Sheets, name, selectedHeaders)
      .then(({ rows: new_rows, columns: new_columns }) => {
        // Use new_rows and new_columns here
        // console.log("New Rows:", new_rows);
        // console.log("New Columns:", new_columns);
        setRows(new_rows);
        setColumns(new_columns);
        setCurrent(name);
        // Further processing or UI updates based on new_rows and new_columns
      })

      .catch((error) => {
        console.error("Error fetching rows and columns:", error);
        // Handle error appropriately
      });
  }

  async function handleFile(ev: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = await ev.target.files?.[0]?.arrayBuffer();
    if (file) await handleAB(file);
  }

  // useEffect(() => {
  //   (async () => {
  //     const f = await fetch("https://docs.sheetjs.com/pres.numbers");
  //     await handleAB(await f.arrayBuffer());
  //   })();
  // }, []);

  const processRowUpdate = useCallback(
    (rowNew: GridRowModel, rowOld: GridRowModel) => {
      for (var j = 0; j < columns.length; ++j)
        if (rowNew[j] != null)
          rows[rowNew.id][j] = isNaN(+rowNew[j]) ? rowNew[j] : +rowNew[j];
      setRows([...rows]);
      return rowNew;
    },
    [columns, rows]
  );

  // const settingHeaders = () => {

  // };
  const handleEditRow = (row: GridRowModel) => {
    setSelectedRow(row);
    setOpenDialog(true);

    const col: string[] = [];
    for (let index = 0; index < columns.length; index++) {
      col.push(columns[index].headerName);
    }
    setHeaders(col);
  };

  const handleSaveChanges = async () => {
    if (selectedRow) {
      const updatedRows = [...rows];
      updatedRows[selectedRow.id] = { ...selectedRow.row, id: selectedRow.id }; // Ensure id is included
      setRows(updatedRows);
      setOpenDialog(false);
      const updatedRow = { id: selectedRow.id };
      headers.forEach((header, index) => {
        updatedRow[header] = selectedRow.row[index] || null;
      });
      const { id, ...newObj } = updatedRow;
      // console.log(JSON.stringify(updatedRow));
      const data = JSON.stringify(newObj);
      const dataToSend = `{
        "data": 
          ${data}
        
      }`;
      try {
        const response = await fetch("http://localhost:8080/api/keyvalue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: dataToSend,
        });

        if (!response.ok) {
          throw new Error("Failed to save changes");
        }

        // Optionally, fetch updated data after successful save
        // const data = await response.json();
        // console.log('Saved data:', data);
      } catch (error) {
        console.error("Error saving changes:", error);
        // Handle error state or retry logic
      }
    }
  };

  const handleCheck = async () => {
    const name = data.SheetNames[0];
    getRowsCols(data.Sheets, name, selectedHeaders)
      .then(({ rows: new_rows, columns: new_columns }) => {
        // Use new_rows and new_columns here
        // console.log("New Rows:", new_rows);
        // console.log("New Columns:", new_columns);
        setRows(new_rows);
        setColumns(new_columns);
        setCurrent(name);
        // Further processing or UI updates based on new_rows and new_columns
      })

      .catch((error) => {
        console.error("Error fetching rows and columns:", error);
        // Handle error appropriately
      });
  };
  /* method is called when one of the save buttons is clicked */
  function saveFile(ext: string): void {
    console.log(rows);
    /* update current worksheet in case changes were made */
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    /* construct workbook and loop through worksheets */
    const wb = utils.book_new();
    sheets.forEach((n) => {
      utils.book_append_sheet(wb, workBook[n], n);
    });

    /* generate a file and download it */
    writeFile(wb, "SheetJSMUIDG." + ext);
  }
  return (
    <>
      <Layout
        drawerMenuList={mainListItemsIncidex}
        drawerMenuSecondaryList={secondaryListItemsIncidex}
      >
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={2}>
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
                        onChange={handleFile}
                        aria-label="Upload Excel File"
                      />
                    </Button>
                  </Grid>

                  <Grid item xs={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="header-select-label">
                        Select Headers
                      </InputLabel>
                      <Select
                        label="Select Headers"
                        labelId="header-select-label"
                        id="header-select"
                        multiple
                        value={selectedHeaders}
                        onChange={(event) =>
                          setSelectedHeaders(event.target.value)
                        }
                        renderValue={(selected) => (
                          <div>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </div>
                        )}
                      >
                        {columns.map((header) => (
                          <MenuItem
                            key={header.headerName}
                            value={header.headerName}
                          >
                            <Checkbox
                              checked={
                                selectedHeaders.indexOf(header.headerName) > -1
                              }
                            />
                            {header.headerName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <Button variant="contained" onClick={handleCheck}>
                      Check
                    </Button>
                  </Grid>

                  <AlarmsLinkButtons />
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper>
                {sheets.length > 0 && (
                  <>
                    <p style={{ padding: 5 }}>
                      Utilisez la liste déroulante pour passer à une feuille de
                      calcul ::&nbsp;
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
                    <div className="flex-cont" style={{ padding: 5 }}>
                      <b>Feuille actuelle: {current}</b>
                    </div>
                    <div style={{ width: "100%", height: 400, padding: 5 }}>
                      <DataGrid
                        rows={rows}
                        columns={columns}
                        processRowUpdate={processRowUpdate}
                        onRowClick={handleEditRow}
                        getRowClassName={(params: { row: GridRowModel }) =>
                          params.row.existsInMongo ? "highlighted-row" : ""
                        }
                      />
                    </div>
                    <p>
                      Cliquez sur l'un des boutons pour créer un nouveau fichier
                      avec les données modifiées
                    </p>
                    <div className="flex-cont">
                      {["xlsx", "xlsb", "xls"].map((ext) => (
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ m: 1 }}
                          key={ext}
                          onClick={() => saveFile(ext)}
                        >
                          Export [.{ext}]
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Dialog for editing selected row */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth={"xl"}
          sx={{ width: "100%" }}
        >
          <DialogTitle>Update alarm</DialogTitle>
          <DialogContent>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ m: 4 }}
            >
              {selectedRow &&
                Object.keys(selectedRow.row).map((key, index) => (
                  <Grid item xs={12} sm={3} key={index}>
                    <TextField
                      label={headers[index]}
                      key={key}
                      type="text"
                      value={selectedRow.row[key] || ""}
                      style={{ marginBottom: "10px", width: "100%" }}
                      onChange={(e) => {
                        const updatedRow = {
                          ...selectedRow,
                          row: {
                            ...selectedRow.row,
                            [key]: e.target.value,
                          },
                        };
                        setSelectedRow(updatedRow);
                      }}
                    />
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
}
