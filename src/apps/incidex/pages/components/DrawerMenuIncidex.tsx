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
import PlaceIcon from "@mui/icons-material/Place";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import RouteIcon from "@mui/icons-material/Route";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

// const handleListItemClicked = () => {
//   setOpen(!open);
// };

export const mainListItemsIncidex = (
  <React.Fragment>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/incidex-app-site-view">
      <ListItemIcon>
        <PlaceIcon />
      </ListItemIcon>
      <ListItemText primary="Site Information" />
    </ListItemButton>
    <ListItemButton component={Link} to="/incidex-app-new-alarms">
      <ListItemIcon>
        <NotificationImportantIcon />
      </ListItemIcon>
      <ListItemText primary="Update Alarms" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <RouteIcon />
      </ListItemIcon>
      <ListItemText primary="Trajets" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contact">
      <ListItemIcon>
        <NotificationsNoneIcon />
      </ListItemIcon>
      <ListItemText primary="Alarms Clear" />
    </ListItemButton>
    <ListItemButton component={Link} to="/test-file-input">
      <ListItemIcon>
        <NotificationsNoneIcon />
      </ListItemIcon>
      <ListItemText primary="TEST" />
    </ListItemButton>
    <ListItemButton component={Link} to="/test-file-ExcelDataGrid">
      <ListItemIcon>
        <NotificationsNoneIcon />
      </ListItemIcon>
      <ListItemText primary="ExcelDataGrid" />
    </ListItemButton>
    <ListItemButton component={Link} to="/email-editor">
      <ListItemIcon>
        <NotificationsNoneIcon />
      </ListItemIcon>
      <ListItemText primary="EmailEditor" />
    </ListItemButton>
    <ListItemButton component={Link} to="/email-retrieve-emails">
      <ListItemIcon>
        <NotificationsNoneIcon />
      </ListItemIcon>
      <ListItemText primary="Fetch mails" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItemsIncidex = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
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
    </ListItemButton> */}
  </React.Fragment>
);
