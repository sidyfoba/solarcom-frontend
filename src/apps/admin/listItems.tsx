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
import { ListItem, Menu, MenuItem } from "@mui/material";
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
import WorkIcon from "@mui/icons-material/Work";
import {
  ArrowBack,
  ArrowBackIosOutlined,
  ArrowCircleDownSharp,
} from "@mui/icons-material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BugReportIcon from "@mui/icons-material/BugReport";
import CellTowerIcon from "@mui/icons-material/CellTower";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
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
  // const {
  //   // openSite,
  //   setOpenSite,
  //   openElement,
  //   setOpenElement,
  //   // openTicket,
  //   setOpenTicket,
  //   // openTask,
  //   setOpenTask,
  //   openHr,
  //   setOpenHr,
  //   // openOrg,
  //   setOpenOrg,
  // } = useLayoutContext();
  const navigate = useNavigate();
  // const isAdmin = roles.length > 0 && roles.includes("ADMIN");

  const handleDisconnect = () => {
    localStorage.removeItem("jwt"); // Remove JWT token from localStorage
    // Perform any additional logout actions if needed
    navigate("/login"); // Redirect to login page or another appropriate route
  };

  // const handleSiteClick = () => {
  //   setOpenSite((prev) => !prev);
  // };

  // const handleElementClick = () => {
  //   setOpenElement((prev) => !prev);
  // };

  // const handleTicketClick = () => {
  //   setOpenTicket((prev) => !prev);
  // };

  // const handleTaskClick = () => {
  //   setOpenTask((prev) => !prev);
  // };
  // const handleHrClick = () => {
  //   setOpenHr((prev) => !prev);
  // };
  // const handleOrgClick = () => {
  //   setOpenOrg((prev) => !prev);
  // };
  //
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  // organisation
  const [anchorElOrg, setAnchorElOrg] = React.useState<null | HTMLElement>(
    null
  );
  const handleClickOrg = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOrg(event.currentTarget);
  };
  const handleCloseOrg = () => {
    setAnchorElOrg(null);
  };
  const openOrg = Boolean(anchorElOrg);
  //Ticket
  const [anchorElTicket, setAnchorElTicket] =
    React.useState<null | HTMLElement>(null);
  const handleClickTicket = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTicket(event.currentTarget);
  };
  const handleCloseTicket = () => {
    setAnchorElTicket(null);
  };
  const openTicket = Boolean(anchorElTicket);
  //Task
  const [anchorElTask, setAnchorElTask] = React.useState<null | HTMLElement>(
    null
  );
  const handleClickTask = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTask(event.currentTarget);
  };
  const handleCloseTask = () => {
    setAnchorElTask(null);
  };
  const openTask = Boolean(anchorElTask);
  //Site
  const [anchorElSite, setAnchorElSite] = React.useState<null | HTMLElement>(
    null
  );
  const handleClickSite = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSite(event.currentTarget);
  };
  const handleCloseSite = () => {
    setAnchorElSite(null);
  };
  const openSite = Boolean(anchorElSite);

  //Element
  const [anchorElElement, setAnchorElElement] =
    React.useState<null | HTMLElement>(null);
  const handleClickElement = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElElement(event.currentTarget);
  };
  const handleCloseElement = () => {
    setAnchorElElement(null);
  };
  const openElement = Boolean(anchorElElement);

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
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <Diversity3Icon />
            </ListItemIcon>
            <ListItemText primary="Human ressources" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <ListItemButton
              component={Link}
              to="/admin/hr/employee/job-position"
            >
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Job positions" />
            </ListItemButton>
            <ListItemButton component={Link} to="/admin/hr/employees/create">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Create Employee" />
            </ListItemButton>
            <ListItemButton component={Link} to="/admin/hr/employees/all">
              <ListItemIcon>
                <PeopleAltIcon />
              </ListItemIcon>
              <ListItemText primary="Employees" />
            </ListItemButton>

            {/* Add more menu items here if needed */}
          </Menu>

          {/*Organisations*/}
          <ListItemButton onClick={handleClickOrg}>
            <ListItemIcon>
              <CorporateFareIcon />
            </ListItemIcon>
            <ListItemText primary="Organisation" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <Menu
            anchorEl={anchorElOrg}
            open={openOrg}
            onClose={handleCloseOrg}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <ListItemButton component={Link} to="/admin/hr/teams">
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Teams" />
            </ListItemButton>
          </Menu>

          {/* ticket */}
          <ListItemButton onClick={handleClickTicket}>
            <ListItemIcon>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText primary="Tickets" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <Menu
            anchorEl={anchorElTicket}
            open={openTicket}
            onClose={handleCloseTicket}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {" "}
            <ListItemButton
              component={Link}
              to="/admin/projects/ticket/template/creation"
            >
              <ListItemIcon>
                <NoteAddIcon />
              </ListItemIcon>
              <ListItemText primary="Create Template" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/admin/projects/ticket/template/all"
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Templates" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/admin/projects/ticket/template/create-ticket"
            >
              <ListItemIcon>
                <NoteAddIcon />
              </ListItemIcon>
              <ListItemText primary="Create Ticket from Template" />
            </ListItemButton>
            <ListItemButton component={Link} to="/admin/projects/ticket/create">
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
            <ListItemButton
              component={Link}
              to="/admin/projects/ticket/by/template/all"
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Tickets by template" />
            </ListItemButton>
          </Menu>

          {/* task */}
          <ListItemButton onClick={handleClickTask}>
            <ListItemIcon>
              <AssignmentTurnedInIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <Menu
            anchorEl={anchorElTask}
            open={openTask}
            onClose={handleCloseTask}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {" "}
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
            <ListItemButton component={Link} to="/admin/projects/task/calendar">
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
          </Menu>

          {/* sites */}
          <ListItemButton onClick={handleClickSite}>
            {/* <ListItemIcon>
          <PlaceIcon />
        </ListItemIcon> */}
            <ListItemIcon>
              <PlaceIcon />
            </ListItemIcon>
            <ListItemText primary="Sites" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <Menu
            anchorEl={anchorElSite}
            open={openSite}
            onClose={handleCloseSite}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {" "}
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
          </Menu>
          {/* <Collapse in={openSite} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
             
            </List>
          </Collapse> */}

          {/* elements and components */}
          <ListItemButton onClick={handleClickElement}>
            <ListItemIcon>
              <CellTowerIcon />
            </ListItemIcon>
            <ListItemText primary="Elements" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <Menu
            anchorEl={anchorElElement}
            open={openElement}
            onClose={handleCloseElement}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
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
          </Menu>

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
