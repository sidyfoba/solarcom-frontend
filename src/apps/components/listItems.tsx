import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { AccountTree, AllInclusive, Construction } from "@mui/icons-material";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Link } from "react-router-dom";

// const handleListItemClicked = () => {
//   setOpen(!open);
// };

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="En cours" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="En cours" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);

export const centralOneitems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      CentralOne
    </ListSubheader>

    <ListItemButton component={Link} to="/incidex-app">
      <ListItemIcon>
        <Construction />
      </ListItemIcon>
      <ListItemText primary="IncideX" />
    </ListItemButton>
    <ListItemButton component={Link} to="/anadex-app">
      <ListItemIcon>
        <AllInclusiveIcon />
      </ListItemIcon>
      <ListItemText primary="AnadeX" />
    </ListItemButton>
    <ListItemButton component={Link} to="/pbr-app">
      <ListItemIcon>
        <AccountTree />
      </ListItemIcon>
      <ListItemText primary="P.B.R" />
    </ListItemButton>
    <ListItemButton component={Link} to="/it-mobile-app">
      <ListItemIcon>
        <DirectionsCarIcon />
      </ListItemIcon>
      <ListItemText primary="IT Mobile" />
    </ListItemButton>
  </React.Fragment>
);
