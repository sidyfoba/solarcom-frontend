import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "N° ticket", width: 90 },
  {
    field: "siteName",
    headerName: "Site name",
    width: 150,
    editable: true,
  },
  {
    field: "idSite",
    headerName: "ID site",
    width: 150,
    editable: true,
  },
  {
    field: "ci",
    headerName: "CI",
    width: 110,
    editable: true,
  },
  // {
  //   field: "ci",
  //   headerName: "CI",
  //   type: "number",
  //   width: 110,
  //   editable: true,
  // },
  // {
  //   field: "fullName",
  //   headerName: "Equipe",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.siteName || ""} ${row.idSite || ""}`,
  // },
];

const rows = [
  { id: 1, idSite: "DKR12", siteName: "DKR12", ci: "DAKAR" },
  { id: 2, idSite: "TB19", siteName: "TB19", ci: "TAMBA" },
  { id: 3, idSite: "ZIG43", siteName: "ZIGU43", ci: "ZIGU" },
  { id: 4, idSite: "KOLDA23", siteName: "KOLDA23", ci: "KOLDA" },
  { id: 5, idSite: "BAMBAY01", siteName: "BAMBAY01", ci: "BAMBAY" },
  { id: 6, idSite: "SL02", siteName: "SL02", ci: "SAINT LOUIS" },
  { id: 7, idSite: "BACKEL12", siteName: "BACKEL12", ci: "BACKEL12" },
  { id: 8, idSite: "FTK23", siteName: "FTK23", ci: "FATICK" },
  { id: 9, idSite: "THS15", siteName: "THS15", ci: "THIES" },
];

export default function UpdateAlarmsTicketsTable() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
