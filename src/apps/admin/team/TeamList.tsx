import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  Chip,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import Layout from "../Layout";

interface Team {
  id: string;
  name: string;
  responsibilities: string[];
  teamLeaderID: string;
  memberIDs: string[];
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team>({
    id: "",
    name: "",
    responsibilities: [],
    teamLeaderID: "",
    memberIDs: [],
  });

  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState("");
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [filter, setFilter] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/hr/teams`
        );
        setTeams(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/hr/employee/all`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchTeams();
    fetchEmployees();
  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentTeam({
      id: "",
      name: "",
      responsibilities: [],
      teamLeaderID: "",
      memberIDs: [],
    });
    setResponsibilityInput(""); // Reset responsibility input
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentTeam({ ...currentTeam, [name]: value });
  };

  const handleMemberChange = (employeeID: string) => {
    setCurrentTeam((prev) => ({
      ...prev,
      memberIDs: prev.memberIDs.includes(employeeID)
        ? prev.memberIDs.filter((id) => id !== employeeID)
        : [...prev.memberIDs, employeeID],
    }));
  };

  const handleAddResponsibility = () => {
    if (
      responsibilityInput.trim() &&
      !currentTeam.responsibilities.includes(responsibilityInput)
    ) {
      setCurrentTeam((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput],
      }));
      setResponsibilityInput("");
    }
  };

  const handleDeleteResponsibility = (resp: string) => {
    setCurrentTeam((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((r) => r !== resp),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentTeam.name) {
        setSnackbarMessage("Team Name is required.");
        setSnackbarOpen(true);
        return;
      }

      if (editMode) {
        console.log("edit mode");
        const id = currentTeam.id;
        console.log("        const id = currentTeam.id = " + id);
        await axios.put(
          `http://localhost:8080/api/hr/teams/${id}`,
          currentTeam
        );
        setTeams((prev) =>
          prev.map((team) =>
            team.id === currentTeam.id ? { ...team, ...currentTeam } : team
          )
        );
      } else {
        const newTeam = {
          name: currentTeam.name,
          responsibilities: currentTeam.responsibilities,
          teamLeaderID: currentTeam.teamLeaderID,
          memberIDs: currentTeam.memberIDs,
        };
        const response = await axios.post(
          "http://localhost:8080/api/hr/teams",
          newTeam
        );
        setTeams((prev) => [...prev, { ...response.data }]);
        setSnackbarMessage("Team added successfully!");
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error saving team:", error);
      setSnackbarMessage("Error saving team. Please try again.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleEditTeam = (team: Team) => {
    console.log(team);
    setCurrentTeam(team);
    setEditMode(true);
    handleDialogOpen();
  };

  const handleDeleteDialogOpen = (id: string) => {
    setTeamToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setTeamToDelete("");
  };

  const handleDeleteTeam = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/hr/teams/${teamToDelete}`);
      setTeams((prev) => prev.filter((team) => team.id !== teamToDelete));
      handleDeleteDialogClose();
      setSnackbarMessage("Team deleted successfully!");
    } catch (error) {
      console.error("Error deleting team:", error);
      setSnackbarMessage("Error deleting team. Please try again.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleOpenEmployeeDialog = () => {
    setOpenEmployeeDialog(true);
  };

  const handleCloseEmployeeDialog = () => {
    setOpenEmployeeDialog(false);
    setFilter("");
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  const teamMembers = employees.filter((employee) =>
    currentTeam.memberIDs.includes(employee.id)
  );

  const columns: GridColDef[] = [
    { field: "name", headerName: "Team Name", width: 200 },
    { field: "teamLeaderID", headerName: "Team Leader", width: 200 },
    {
      field: "responsibilities",
      headerName: "Responsibilities",
      width: 300,
      renderCell: (params) => (
        <Box>
          {params.value.map((resp: string) => (
            <Chip key={resp} label={resp} />
          ))}
        </Box>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            handleEditTeam(teams.find((team) => team.id === params.row.id)!)
          }
        >
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteDialogOpen(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const rows = teams.map((team) => ({
    id: team.id,
    name: team.name,
    teamLeaderID:
      employees.find((emp) => emp.id === team.teamLeaderID)?.fullName || "N/A",
    responsibilities: team.responsibilities,
  }));

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4">Teams</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
          >
            Add Team
          </Button>
          <div style={{ height: 400, width: "100%", marginTop: "16px" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={false}
            />
          </div>

          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            PaperProps={{
              sx: {
                width: "800px",
                maxWidth: "90%",
              },
            }}
          >
            <DialogTitle>{editMode ? "Edit Team" : "Add New Team"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Team Name"
                name="name"
                fullWidth
                required
                value={currentTeam.name}
                onChange={handleInputChange}
                error={!currentTeam.name && editMode}
                helperText={
                  !currentTeam.name && editMode ? "Team Name is required." : ""
                }
              />
              <TextField
                margin="dense"
                label="Add Responsibility"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddResponsibility();
                  }
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
                {currentTeam.responsibilities.map((resp) => (
                  <Chip
                    key={resp}
                    label={resp}
                    onDelete={() => handleDeleteResponsibility(resp)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Select
                fullWidth
                margin="dense"
                name="teamLeaderID"
                value={currentTeam.teamLeaderID}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Team Leader
                </MenuItem>
                {teamMembers.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="subtitle1">Team Members:</Typography>
              <Button variant="outlined" onClick={handleOpenEmployeeDialog}>
                Manage Members
              </Button>
              <Box sx={{ pb: 2 }}></Box>
              <div style={{ height: 260, width: "100%" }}>
                <DataGrid
                  rows={teamMembers}
                  columns={[
                    { field: "id", headerName: "ID", width: 90 },
                    { field: "fullName", headerName: "Full Name", width: 200 },
                    { field: "email", headerName: "Email", width: 200 },
                    { field: "phone", headerName: "Phone", width: 150 },
                    {
                      field: "add",
                      headerName: "Add to Team",
                      width: 150,
                      renderCell: (params) => (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMemberChange(params.row.id)}
                        >
                          {currentTeam.memberIDs.includes(params.row.id)
                            ? "Remove"
                            : "Add"}
                        </Button>
                      ),
                    },
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection={false}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                {editMode ? "Update Team" : "Add Team"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Employee Selection Dialog */}
          <Dialog open={openEmployeeDialog} onClose={handleCloseEmployeeDialog}>
            <DialogTitle>Select Employees</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Search Employees"
                type="text"
                fullWidth
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <div style={{ height: 300, width: "100%" }}>
                <DataGrid
                  rows={filteredEmployees}
                  columns={[
                    {
                      field: "add",
                      headerName: "Add to Team",
                      width: 150,
                      renderCell: (params) => (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMemberChange(params.row.id)}
                        >
                          {currentTeam.memberIDs.includes(params.row.id)
                            ? "Remove"
                            : "Add"}
                        </Button>
                      ),
                    },
                    { field: "id", headerName: "ID", width: 90 },
                    { field: "fullName", headerName: "Full Name", width: 200 },
                    { field: "email", headerName: "Email", width: 200 },
                    { field: "phone", headerName: "Phone", width: 150 },
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection={false}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEmployeeDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confirmation Dialog for Deleting Teams */}
          <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this team?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteTeam} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for Feedback Messages */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />
        </Paper>
      </Box>
    </Layout>
  );
};

export default TeamList;
