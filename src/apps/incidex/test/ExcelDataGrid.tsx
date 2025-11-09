import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { read, utils, WorkSheet, writeFile } from "xlsx";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Grid, TextField } from "@mui/material";

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

/* this method returns `rows` and `columns` data for sheet change */
const getRowsCols = (data: DataSet, sheetName: string): RowCol => {
  const sheet = data[sheetName];
  const range = utils.decode_range(sheet["!ref"] || "A1");
  const headers: string[] = [];

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = sheet[utils.encode_cell({ r: range.s.r, c: C })];
    headers.push(cell ? String(cell.v) : `Column ${C + 1}`);
  }
  // Get all rows starting from the second row (index 1)
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

export default function ExcelDataGrid() {
  const [rows, setRows] = useState<Row[]>([]); // data rows
  const [columns, setColumns] = useState<GridColDef[]>([]); // columns
  const [workBook, setWorkBook] = useState<DataSet>({} as DataSet); // workbook
  const [sheets, setSheets] = useState<string[]>([]); // list of sheet names
  const [current, setCurrent] = useState<string>(""); // selected sheet
  const [selectedRow, setSelectedRow] = useState<GridRowModel | null>(null); // selected row for editing
  const [openDialog, setOpenDialog] = useState<boolean>(false); // dialog open state

  /* called when sheet dropdown is changed */
  function selectSheet(name: string) {
    /* update workbook cache in case the current worksheet was changed */
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    /* get data for desired sheet and update state */
    const { rows: new_rows, columns: new_columns } = getRowsCols(
      workBook,
      name
    );
    setRows(new_rows);
    setColumns(new_columns);
    setCurrent(name);
  }

  /* this method handles refreshing the state with new workbook data */
  async function handleAB(file: ArrayBuffer): Promise<void> {
    /* read file data */
    const data = read(file);

    /* update workbook state */
    setWorkBook(data.Sheets);
    setSheets(data.SheetNames);

    /* select the first worksheet */
    const name = data.SheetNames[0];
    const { rows: new_rows, columns: new_columns } = getRowsCols(
      data.Sheets,
      name
    );
    setRows(new_rows);
    setColumns(new_columns);
    setCurrent(name);
  }

  /* called when file input element is used to select a new file */
  async function handleFile(ev: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = await ev.target.files?.[0]?.arrayBuffer();
    if (file) await handleAB(file);
  }

  /* when page is loaded, fetch and process worksheet */
  useEffect(() => {
    (async () => {
      const f = await fetch("https://docs.sheetjs.com/pres.numbers");
      await handleAB(await f.arrayBuffer());
    })();
  }, []);

  /* method is called when one of the save buttons is clicked */
  function saveFile(ext: string): void {
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

  /* Open dialog and set selected row for editing */
  const handleEditRow = (row: GridRowModel) => {
    setSelectedRow(row);
    setOpenDialog(true);
    console.log("affichage de info de row");
    console.log(row);
    console.log("id row");
    console.log(row.id);
    // console.log("columns");
    console.log("row as object");
    console.log(row.row);
    // row.row.forEach((element) => {
    //   console.log(element);
    // });
    console.log("liste des elements de row object");
    Object.keys(row.row).forEach((key) => {
      const value = row.row[key];
      console.log(`${key}: ${value}`);
    });
  };

  /* Save changes from dialog */
  const handleSaveChanges = () => {
    if (selectedRow) {
      // Ensure selectedRow is treated as an array and update rows
      const updatedRows = [...rows];
      updatedRows[selectedRow.id] = [...selectedRow];
      setRows(updatedRows);
      setOpenDialog(false);
    }
  };

  return (
    <>
      <h3>SheetJS × MUI Data Grid Demo</h3>
      <input type="file" onChange={handleFile} />
      {sheets.length > 0 && (
        <>
          <p>
            Use the dropdown to switch to a worksheet:&nbsp;
            <select
              onChange={async (e) => selectSheet(sheets[+e.target.value])}
            >
              {sheets.map((sheet, idx) => (
                <option key={sheet} value={idx}>
                  {sheet}
                </option>
              ))}
            </select>
          </p>
          <div className="flex-cont">
            <b>Current Sheet: {current}</b>
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <DataGrid
              columns={columns}
              rows={rows}
              processRowUpdate={processRowUpdate}
              onRowClick={handleEditRow} // Handle row click to open dialog
            />
          </div>
          <p>
            Click one of the buttons to create a new file with the modified data
          </p>
          <div className="flex-cont">
            {["xlsx", "xlsb", "xls"].map((ext) => (
              <button key={ext} onClick={() => saveFile(ext)}>
                export [.{ext}]
              </button>
            ))}
          </div>
        </>
      )}

      {/* Dialog for editing selected row */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth={"xl"}
        sx={{ width: "100%" }}
      >
        <DialogTitle>Upate alarm</DialogTitle>
        <DialogContent>
          {/* Render fields for editing */}
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {" "}
            {selectedRow &&
              Object.keys(selectedRow.row).map((key, index) => (
                <Grid item xs={12} sm={3}>
                  <div key={index}>
                    {/* Render each key-value pair */}
                    <TextField
                      key={key}
                      type="text"
                      value={selectedRow.row[key] || "vide"}
                      style={{ marginBottom: "10px", width: "100%" }}
                    />
                  </div>
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
    </>
  );
}
