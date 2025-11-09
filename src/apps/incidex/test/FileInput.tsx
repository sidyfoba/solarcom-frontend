import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface RowObject {
  [key: string]: any;
}

function FileInput() {
  console.log(`test`);
  const [data, setData] = useState<RowObject[] | null>(null);
  const [columns, setColumns] = useState<String[] | null>(null);
  const [__html, setHTML] = React.useState("");

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target || !event.target.result) return;

      const binaryString = event.target.result as string;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet) as RowObject[];

      const table = XLSX.utils.sheet_to_html(sheet);
      setHTML(table);
      console.log("on load data");
      setData(sheetData);
      if (sheetData != null) {
        let i = 0;
        let cols = [];
        for (const row of sheetData) {
          // 'row' is of type RowObject here

          for (let key in row) {
            if (row.hasOwnProperty(key)) {
              cols.push(key);
              let value = row[key];
              console.log(`Key: ${key}, Value: ${value}`);
            }
          }
          i++;
          if (i > 0) {
            setColumns(cols);
            break;
          }
        }
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {data && (
        <div>
          <h2>Imported Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html }} />
    </div>
  );
}

export default FileInput;
