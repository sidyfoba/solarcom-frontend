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
import Diffusion from "./components/Diffusion";
import SiteInformationsTabs from "./components/site-view-components/SiteInformationsTabs";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { read, utils, WorkSheet, writeFile } from "xlsx";
import {
  mainListItemsIncidex,
  secondaryListItemsIncidex,
} from "./components/DrawerMenuIncidex";
import Layout from "../../Layout";
import UpdateAlarmsTicketsTable from "./components/update-alarms-components/UpdateAlarmsTicketsTable";
import TicketInformations from "./components/update-alarms-components/TicketInformations";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

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
type Row = any[];
type RowCol = { rows: Row[]; columns: GridColDef[] };

function arrayify(rows: any[]): Row[] {
  return rows.map((row) => {
    if (Array.isArray(row)) return row;
    var length = Object.keys(row).length;
    for (; length > 0; --length) if (row[length - 1] != null) break;
    return Array.from({ length, ...row });
  });
}

const getRowsCols = (data: DataSet, sheetName: string): RowCol => {
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
    .map((r, id) => ({ ...r, id }));

  return {
    rows: rows,
    columns: headers.map((header, index) => ({
      field: String(index),
      headerName: header,
      editable: true,
    })),
  };
};

export default function UpdateAlarms() {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [workBook, setWorkBook] = useState<DataSet>({} as DataSet);
  const [sheets, setSheets] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<GridRowModel | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string[]>([]);

  const dateTimeRegex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;

  function selectSheet(name: string) {
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    const { rows: new_rows, columns: new_columns } = getRowsCols(
      workBook,
      name
    );
    setRows(new_rows);
    setColumns(new_columns);
    setCurrent(name);
  }

  async function handleAB(file: ArrayBuffer): Promise<void> {
    const data = read(file);

    setWorkBook(data.Sheets);
    setSheets(data.SheetNames);

    const name = data.SheetNames[0];
    const { rows: new_rows, columns: new_columns } = getRowsCols(
      data.Sheets,
      name
    );
    setRows(new_rows);
    setColumns(new_columns);
    setCurrent(name);
  }

  async function handleFile(ev: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = await ev.target.files?.[0]?.arrayBuffer();
    if (file) await handleAB(file);
  }

  useEffect(() => {
    (async () => {
      const f = await fetch("https://docs.sheetjs.com/pres.numbers");
      await handleAB(await f.arrayBuffer());
    })();
  }, []);

  function saveFile(ext: string): void {
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    const wb = utils.book_new();
    sheets.forEach((n) => {
      utils.book_append_sheet(wb, workBook[n], n);
    });

    writeFile(wb, "SheetJSMUIDG." + ext);
  }

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

  const handleEditRow = (row: GridRowModel) => {
    setSelectedRow(row);
    setOpenDialog(true);
    const col: string[] = [];
    for (let index = 0; index < columns.length; index++) {
      col.push(columns[index].headerName);
    }
    setHeaders(col);
  };

  const handleSaveChanges = () => {
    if (selectedRow) {
      const updatedRows = [...rows];
      updatedRows[selectedRow.id] = [...selectedRow.row];
      setRows(updatedRows);
      setOpenDialog(false);

      const newRowData = Object.keys(selectedRow.row).reduce((acc, key) => {
        const columnHeader = headers[key];
        acc[columnHeader] = selectedRow.row[key];
        return acc;
      }, {});

      console.log("New Row Data:", newRowData);
      // Use newRowData as needed (e.g., send to API, update state, etc.)
    }
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [recherche, setRecherche] = React.useState("");

  const handleChangeRecheche = (event: SelectChangeEvent) => {
    setRecherche(event.target.value as string);
  };

  const [rechercheSite, setRechercheSite] = React.useState("");

  const handleChangeRechecheSite = (event: SelectChangeEvent) => {
    setRechercheSite(event.target.value as string);
  };

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
              <Item>
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
                      <VisuallyHiddenInput type="file" onChange={handleFile} />
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      sx={{ verticalAlign: "center" }}
                    >
                      Extraire
                    </Button>
                  </Grid>

                  <Grid item xs={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="recherche-label">Statut</InputLabel>
                      <Select
                        labelId="recherche-label"
                        id="recherche-select"
                        value={recherche}
                        label="Site"
                        onChange={handleChangeRecheche}
                      >
                        <MenuItem value={10}>SN</MenuItem>
                        <MenuItem value={20}>ID</MenuItem>
                        <MenuItem value={30}>SITE NAME</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="recherche-label">Country</InputLabel>
                      <Select
                        labelId="recherche-label"
                        id="recherche-select"
                        value={rechercheSite}
                        label="Country"
                        onChange={handleChangeRechecheSite}
                      >
                        <MenuItem value={10}>SN</MenuItem>
                        <MenuItem value={20}>ID</MenuItem>
                        <MenuItem value={30}>SITE NAME</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <UpdateAlarmsTicketsTable
                      rows={rows}
                      columns={columns}
                      onEditRow={handleEditRow}
                      onSaveChanges={handleSaveChanges}
                    />
                  </Grid>
                </Grid>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
}
