import { Box, Button, Grid, Menu } from "@mui/material";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import Layout from "./Layout";
import SatelliteAlt from "@mui/icons-material/SatelliteAlt";
import SignalCellularAlt from "@mui/icons-material/SignalCellularAlt";
import Satellite from "@mui/icons-material/Satellite";
import Radar from "@mui/icons-material/Radar";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Router from "@mui/icons-material/Router";
import ControlCamera from "@mui/icons-material/ControlCamera";
import NetworkCell from "@mui/icons-material/NetworkCell";
import NetworkWifi from "@mui/icons-material/NetworkWifi";
import BatteryChargingFull from "@mui/icons-material/BatteryChargingFull";
import Power from "@mui/icons-material/Power";
import BatteryFull from "@mui/icons-material/BatteryFull";
import Storage from "@mui/icons-material/Storage";
import AcUnit from "@mui/icons-material/AcUnit";
import Cable from "@mui/icons-material/Cable";
import Security from "@mui/icons-material/Security";
import Lock from "@mui/icons-material/Lock";
import Fingerprint from "@mui/icons-material/Fingerprint";
import Thunderstorm from "@mui/icons-material/Thunderstorm";
import FireExtinguisher from "@mui/icons-material/FireExtinguisher";
import ShowChart from "@mui/icons-material/ShowChart";
import Build from "@mui/icons-material/Build";
import CellTowerIcon from "@mui/icons-material/CellTower";
import RoofingIcon from "@mui/icons-material/Roofing";
import { DataGrid } from "@mui/x-data-grid";
import PlaceIcon from "@mui/icons-material/Place";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";

export default function Configs() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MyApp
            </Typography>
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <Button color="inherit">Home</Button>
              <Button color="inherit">About</Button>
              <Button color="inherit">Services</Button>
              <Button color="inherit">Contact</Button>
            </Box>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="account"
              onClick={handleMenuClick}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ width: 320, maxWidth: "100%" }}>
              <MenuList>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Site management</ListItemText>
                </MenuItem>
                {/*  */}
                <MenuItem>
                  <ListItemIcon>
                    <CellTowerIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Towers (Pilone)</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <BatteryChargingFull fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Power Supply (Energie)</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <BatteryChargingFull fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Network</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <RoofingIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Shelters</ListItemText>
                </MenuItem>
              </MenuList>
            </Paper>
          </Grid>
          <Grid item xs={8}>
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
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
