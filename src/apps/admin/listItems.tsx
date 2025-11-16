import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PlaceIcon from "@mui/icons-material/Place";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import LogoutIcon from "@mui/icons-material/Logout";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BugReportIcon from "@mui/icons-material/BugReport";
import CellTowerIcon from "@mui/icons-material/CellTower";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLayoutContext } from "./LayoutContext";

interface MainListItemsProps {
  isDrawerOpen: boolean;
}

const MainListItems: React.FC<MainListItemsProps> = ({ isDrawerOpen }) => {
  const navigate = useNavigate();

  const {
    openMenuExclusive,
    isHrOpen,
    isOrgOpen,
    isTicketOpen,
    isTaskOpen,
    isSiteOpen,
    isElementOpen,
  } = useLayoutContext();

  const handleDisconnect = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  // Helper: only show tooltip when drawer is closed
  const tooltipProps = (label: string) => ({
    title: isDrawerOpen ? "" : label,
    placement: "right" as const,
    arrow: true,
    disableHoverListener: isDrawerOpen,
  });

  return (
    <React.Fragment>
      <div style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}>
        <List component="nav">
          {/* Dashboard */}
          <Tooltip {...tooltipProps("Dashboard")}>
            <ListItemButton component={Link} to="/admin">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Tooltip>

          {/* Test */}
          <Tooltip {...tooltipProps("Test")}>
            <ListItemButton component={Link} to="/admin/projects/task/test">
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Test" />
            </ListItemButton>
          </Tooltip>

          {/* Comptes */}
          <Tooltip {...tooltipProps("Comptes")}>
            <ListItemButton component={Link} to="/admin/comptes">
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="Comptes" />
            </ListItemButton>
          </Tooltip>

          {/* Projects */}
          <Tooltip {...tooltipProps("Projects")}>
            <ListItemButton component={Link} to="/admin/projects/all">
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </Tooltip>

          {/* Human Resources */}
          <Tooltip {...tooltipProps("Human ressources")}>
            <ListItemButton onClick={() => openMenuExclusive("hr")}>
              <ListItemIcon>
                <Diversity3Icon />
              </ListItemIcon>
              <ListItemText primary="Human ressources" />
              {isHrOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </Tooltip>
          <Collapse in={isHrOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip {...tooltipProps("Job positions")}>
                <ListItemButton
                  component={Link}
                  to="/admin/hr/employee/job-position"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Job positions" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Create Employee")}>
                <ListItemButton
                  component={Link}
                  to="/admin/hr/employees/create"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Employee" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Employees")}>
                <ListItemButton
                  component={Link}
                  to="/admin/hr/employees/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <PeopleAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Employees" />
                </ListItemButton>
              </Tooltip>
            </List>
          </Collapse>

          {/* Organisation */}
          <Tooltip {...tooltipProps("Organisation")}>
            <ListItemButton onClick={() => openMenuExclusive("org")}>
              <ListItemIcon>
                <CorporateFareIcon />
              </ListItemIcon>
              <ListItemText primary="Organisation" />
              {isOrgOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </Tooltip>
          <Collapse in={isOrgOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip {...tooltipProps("Teams")}>
                <ListItemButton
                  component={Link}
                  to="/admin/hr/teams"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Teams" />
                </ListItemButton>
              </Tooltip>
            </List>
          </Collapse>

          {/* Tickets */}
          <Tooltip {...tooltipProps("Tickets")}>
            <ListItemButton onClick={() => openMenuExclusive("ticket")}>
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Tickets" />
              {isTicketOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </Tooltip>
          <Collapse in={isTicketOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip {...tooltipProps("Create Template")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/ticket/template/creation"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Template" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Templates")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/ticket/template/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Templates" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Create Ticket from Template")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/ticket/template/create-ticket"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Ticket from Template" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Create Ticket")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/ticket/create"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Ticket" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Tickets")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/ticket/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tickets" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Tickets by template")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/ticket/by/template/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tickets by template" />
                </ListItemButton>
              </Tooltip>
            </List>
          </Collapse>

          {/* Tasks */}
          <Tooltip {...tooltipProps("Tasks")}>
            <ListItemButton onClick={() => openMenuExclusive("task")}>
              <ListItemIcon>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
              {isTaskOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </Tooltip>
          <Collapse in={isTaskOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip {...tooltipProps("Create Task")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/task/create"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Task" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Tasks")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/task/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tasks" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Calendar")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/task/calendar"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText primary="Calendar" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Time line")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/task/time-line"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Time line" />
                </ListItemButton>
              </Tooltip>
            </List>
          </Collapse>

          {/* Sites */}
          <Tooltip {...tooltipProps("Sites")}>
            <ListItemButton onClick={() => openMenuExclusive("site")}>
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText primary="Sites" />
              {isSiteOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </Tooltip>
          <Collapse in={isSiteOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip {...tooltipProps("Create Template")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/site/template/create"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Template" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Templates")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/site/template/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Templates" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Create site")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/site/create"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddLocationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create site" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Sites")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/site/template/sites/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <PlaceIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sites" />
                </ListItemButton>
              </Tooltip>
            </List>
          </Collapse>

          {/* Elements */}
          <Tooltip {...tooltipProps("Elements")}>
            <ListItemButton onClick={() => openMenuExclusive("element")}>
              <ListItemIcon>
                <CellTowerIcon />
              </ListItemIcon>
              <ListItemText primary="Elements" />
              {isElementOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </Tooltip>
          <Collapse in={isElementOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip {...tooltipProps("Create Template")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/element/template/creation"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Template" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Templates")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/element/template/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Templates" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Create elements")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/element/create"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create elements" />
                </ListItemButton>
              </Tooltip>
              <Tooltip {...tooltipProps("Elements")}>
                <ListItemButton
                  component={Link}
                  to="/admin/projects/element/template/elements/all"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FeaturedPlayListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Elements" />
                </ListItemButton>
              </Tooltip>
            </List>
          </Collapse>

          <Divider />

          {/* Profile */}
          <Tooltip {...tooltipProps("Mon profil")}>
            <ListItemButton component={Link} to="/profil">
              <ListItemIcon>
                <FolderSharedIcon />
              </ListItemIcon>
              <ListItemText primary="Mon profil" />
            </ListItemButton>
          </Tooltip>

          {/* Logout */}
          <Tooltip {...tooltipProps("Déconnecter")}>
            <ListItemButton onClick={handleDisconnect}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Déconnecter" />
            </ListItemButton>
          </Tooltip>
        </List>
      </div>
    </React.Fragment>
  );
};

export default MainListItems;
