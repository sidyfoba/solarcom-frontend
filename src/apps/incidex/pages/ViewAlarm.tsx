import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import axios from "axios";
import Layout from "../../Layout";
import {
  mainListItemsIncidex,
  secondaryListItemsIncidex,
} from "./components/DrawerMenuIncidex";

const ViewAlarm = () => {
  const { id } = useParams(); // Get the row ID from the URL parameters
  const navigate = useNavigate();
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    const fetchRowData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/alarm/${id}`
        );
        setRowData(response.data.data);
      } catch (error) {
        console.error("Error fetching row data:", error);
      }
    };

    fetchRowData();
  }, [id]);

  if (!rowData)
    return (
      <div>
        <Layout
          drawerMenuList={mainListItemsIncidex}
          drawerMenuSecondaryList={secondaryListItemsIncidex}
        >
          Loading...
        </Layout>
      </div>
    );

  return (
    <Layout
      drawerMenuList={mainListItemsIncidex}
      drawerMenuSecondaryList={secondaryListItemsIncidex}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ padding: 2 }}>
          <Paper sx={{ p: 2 }}>
            {" "}
            <Typography variant="h4" gutterBottom>
              View Alarm Details
            </Typography>
            {Object.entries(rowData).map(([key, value]) => (
              <Box key={key} sx={{ marginBottom: 2 }}>
                <Typography variant="body2">{key}:</Typography>
                <Typography variant="body1">{String(value)}</Typography>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => navigate("/incidex-app-alarms")}
              sx={{ marginTop: 2 }}
            >
              Back to Alarms
            </Button>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
};

export default ViewAlarm;
