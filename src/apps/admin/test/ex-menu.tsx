import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PlaceIcon from "@mui/icons-material/Place";
import { ListItem } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import { useLayoutContext } from "./LayoutProvider";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimelineIcon from "@mui/icons-material/Timeline";

// interface Props {
//   roles: string[]; // Define the correct type for roles
// }

// interface Props {
//   openSite: boolean;
//   setOpenSite: (open: boolean) => void;
//   openElement: boolean;
//   setOpenElement: (open: boolean) => void;
// }
const MainListItems: React.FC = ({}) => {
  const {
    openSite,
    setOpenSite,
    openElement,
    setOpenElement,
    openTicket,
    setOpenTicket,
    openTask,
    setOpenTask,
    openHr,
    setOpenHr,
    openOrg,
    setOpenOrg,
  } = useLayoutContext();
  const navigate = useNavigate();
  // const isAdmin = roles.length > 0 && roles.includes("ADMIN");

  const handleDisconnect = () => {
    localStorage.removeItem("jwt"); // Remove JWT token from localStorage
    // Perform any additional logout actions if needed
    navigate("/login"); // Redirect to login page or another appropriate route
  };

  const handleSiteClick = () => {
    setOpenSite((prev) => !prev);
  };

  const handleElementClick = () => {
    setOpenElement((prev) => !prev);
  };

  const handleTicketClick = () => {
    setOpenTicket((prev) => !prev);
  };

  const handleTaskClick = () => {
    setOpenTask((prev) => !prev);
  };
  const handleHrClick = () => {
    setOpenHr((prev) => !prev);
  };
  const handleOrgClick = () => {
    setOpenOrg((prev) => !prev);
  };

  return (
    <React.Fragment>
      <div style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}>
        <List component="nav">
          {/* Always show Dashboard item */}
          <ListItemButton component={Link} to="/admin">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/projects/task/test">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Test" />
          </ListItemButton>
          {/* Conditionally render these items based on user role */}
          <ListItemButton component={Link} to="/admin/comptes">
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Comptes" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/projects/all">
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItemButton>

          {/* Human ressources */}
          <ListItemButton onClick={handleHrClick}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Human ressources" />
            {openHr ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openHr} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/admin/hr/employees/create">
                <ListItemIcon>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Employee" />
              </ListItemButton>
              <ListItemButton component={Link} to="/admin/hr/employees/all">
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Employees" />
              </ListItemButton>
            </List>
          </Collapse>

          {/*Organisations*/}
          <ListItemButton onClick={handleOrgClick}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Organisation" />
            {openOrg ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openOrg} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* <ListItemButton component={Link} to="/admin/hr/employees/create">
                <ListItemIcon>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Employee" />
              </ListItemButton> */}
              <ListItemButton component={Link} to="/admin/hr/employees/all">
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Teams" />
              </ListItemButton>
            </List>
          </Collapse>
          {/* ticket */}
          <ListItemButton onClick={handleTicketClick}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Tickets" />
            {openTicket ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openTicket} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/projects/ticket/create"
              >
                <ListItemIcon>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Ticket" />
              </ListItemButton>
              <ListItemButton component={Link} to="/admin/projects/ticket/all">
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Tickets" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* task */}
          <ListItemButton onClick={handleTaskClick}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
            {openTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openTask} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/admin/projects/task/create">
                <ListItemIcon>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Task" />
              </ListItemButton>

              <ListItemButton component={Link} to="/admin/projects/task/all">
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/admin/projects/task/calendar"
              >
                <ListItemIcon>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Calendar" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/admin/projects/task/time-line"
              >
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText primary="Time line" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* sites */}
          <ListItemButton onClick={handleSiteClick}>
            {/* <ListItemIcon>
          <PlaceIcon />
        </ListItemIcon> */}
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Sites" />
            {openSite ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openSite} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/projects/site/template/create"
              >
                <ListItemIcon>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Template" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/admin/projects/site/template/all"
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Templates" />
              </ListItemButton>
              <ListItemButton component={Link} to="/admin/projects/site/create">
                <ListItemIcon>
                  <AddLocationIcon />
                </ListItemIcon>
                <ListItemText primary="Create site" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/admin/projects/site/template/sites/all"
              >
                <ListItemIcon>
                  <PlaceIcon />
                </ListItemIcon>
                <ListItemText primary="Sites" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* elements and components */}
          <ListItemButton onClick={handleElementClick}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Elements" />
            {openElement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openElement} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/projects/element/template/creation"
              >
                <ListItemIcon>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Template" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/admin/projects/element/template/all"
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Templates" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/admin/projects/element/create"
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create elements" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/admin/projects/element/template/elements/all"
              >
                <ListItemIcon>
                  <FeaturedPlayListIcon />
                </ListItemIcon>
                <ListItemText primary="Elements" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Always show these items */}

          <Divider />
          <ListItemButton component={Link} to="/profil">
            <ListItemIcon>
              <FolderSharedIcon />
            </ListItemIcon>
            <ListItemText primary="Mon profil" />
          </ListItemButton>

          <ListItemButton onClick={handleDisconnect}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Déconnecter" />
          </ListItemButton>
          {/* Logout button */}
          {/* <ListItemButton onClick={handleDisconnect}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Déconnecter" />
      </ListItemButton> */}
        </List>
      </div>
    </React.Fragment>
  );
};
export default MainListItems;
