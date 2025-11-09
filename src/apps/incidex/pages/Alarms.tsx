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
  IconButton,
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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

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

export default function Alarms() {
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
  const navigate = useNavigate();
  const getRowsColsFromDB = (data: any[]): RowCol => {
    const headers: string[] = [];

    const rows = data.map((obj, index) => ({
      id: obj.id, // Ensure each row has a unique 'id'
      ...obj.data, // Spread your object data here
    }));

    const columns = [
      {
        field: "actions",
        headerName: "Actions",
        width: 100,
        renderCell: (params) => (
          <>
            <IconButton
              color="primary"
              aria-label="View"
              onClick={() => navigate(`/edit/${params.row.id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="secondary"
              aria-label="View"
              onClick={() => navigate(`/view/${params.row.id}`)}
            >
              <VisibilityIcon />
            </IconButton>
            {/* <Button variant="outlined" onClick={() => handleViewRow(params.row)}>
              <VisibilityIcon />
            </Button> */}
          </>
        ),
      },
      ...Object.keys(rows[0] || {})
        .filter((key) => key !== "id")
        .map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          editable: true,
        })),
    ];

    return { rows, columns };
  };
  useEffect(() => {
    (async () => {
      //   const f = await fetch("https://docs.sheetjs.com/pres.numbers");
      //   await handleAB(await f.arrayBuffer());

      try {
        const response = await axios.get(
          `http://localhost:8080/api/getkeyvalue`
        );

        const { rows: new_rows, columns: new_columns } = getRowsColsFromDB(
          response.data
        );
        setRows(new_rows);
        setColumns(new_columns);
      } catch (error) {
        console.error("Error checking row in MongoDB:", error);
        return false;
      }
    })();
  }, []);

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
      // console.log(JSON.stringify(updatedRow));
      const data = JSON.stringify(updatedRow);
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
                    {/* <Button
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
                    </Button> */}
                  </Grid>

                  <Grid item xs={2}>
                    {/* <Button variant="contained" onClick={handleCheck}>
                      Check
                    </Button> */}
                  </Grid>

                  <AlarmsLinkButtons />
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper>
                {rows.length > 0 && (
                  <>
                    <div className="flex-cont" style={{ padding: 5 }}>
                      <b>Alarms:</b>
                    </div>
                    <div style={{ width: "100%", height: 400, padding: 5 }}>
                      <DataGrid
                        rows={rows}
                        columns={columns}
                        processRowUpdate={processRowUpdate}
                        // onRowClick={handleEditRow}
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
