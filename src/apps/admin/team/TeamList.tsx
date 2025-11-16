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
  Alert,
  Container,
  Stack,
  Divider,
  CircularProgress,
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/hr/teams`
        );
        setTeams(response.data || []);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Error fetching teams.");
        setSnackbarMessage("Error fetching teams.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/hr/employee/all`
        );
        setEmployees(response.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setSnackbarMessage("Error fetching employees.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
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
    setResponsibilityInput("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentTeam((prev) => ({ ...prev, [name]: value }));
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
      !currentTeam.responsibilities.includes(responsibilityInput.trim())
    ) {
      setCurrentTeam((prev) => ({
        ...prev,
        responsibilities: [
          ...prev.responsibilities,
          responsibilityInput.trim(),
        ],
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
      if (!currentTeam.name.trim()) {
        setSnackbarMessage("Team Name is required.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      if (editMode) {
        const id = currentTeam.id;
        await axios.put(
          `${import.meta.env.VITE_API_BASE}/api/hr/teams/${id}`,
          currentTeam
        );
        setTeams((prev) =>
          prev.map((team) =>
            team.id === currentTeam.id ? { ...team, ...currentTeam } : team
          )
        );
        setSnackbarMessage("Team updated successfully!");
        setSnackbarSeverity("success");
      } else {
        const newTeam = {
          name: currentTeam.name,
          responsibilities: currentTeam.responsibilities,
          teamLeaderID: currentTeam.teamLeaderID,
          memberIDs: currentTeam.memberIDs,
        };
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/hr/teams`,
          newTeam
        );
        setTeams((prev) => [...prev, response.data]);
        setSnackbarMessage("Team added successfully!");
        setSnackbarSeverity("success");
      }

      handleDialogClose();
    } catch (err) {
      console.error("Error saving team:", err);
      setSnackbarMessage("Error saving team. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleEditTeam = (team: Team) => {
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
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/hr/teams/${teamToDelete}`
      );
      setTeams((prev) => prev.filter((team) => team.id !== teamToDelete));
      setSnackbarMessage("Team deleted successfully!");
      setSnackbarSeverity("success");
      handleDeleteDialogClose();
    } catch (err) {
      console.error("Error deleting team:", err);
      setSnackbarMessage("Error deleting team. Please try again.");
      setSnackbarSeverity("error");
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
    { field: "name", headerName: "Team Name", flex: 1, minWidth: 200 },
    {
      field: "teamLeaderID",
      headerName: "Team Leader",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "responsibilities",
      headerName: "Responsibilities",
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {(params.value || []).map((resp: string) => (
            <Chip key={resp} label={resp} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
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
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
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
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "grey.100"
              : theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Teams
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage teams, responsibilities, leaders and members.
              </Typography>
            </Box>

            {/* Main card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Divider
                  sx={{ flexGrow: 1, mr: 2 }}
                  textAlign="left"
                  variant="fullWidth"
                >
                  <Chip label="Teams List" color="primary" variant="outlined" />
                </Divider>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDialogOpen}
                >
                  Add Team
                </Button>
              </Box>

              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 240,
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading teams...
                  </Typography>
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : teams.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No teams found. Create a team to get started.
                </Typography>
              ) : (
                <Box sx={{ height: 450, width: "100%", mt: 1 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                  />
                </Box>
              )}
            </Paper>
          </Stack>

          {/* Add / Edit Team Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>{editMode ? "Edit Team" : "Add New Team"}</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="dense"
                  label="Team Name"
                  name="name"
                  fullWidth
                  required
                  value={currentTeam.name}
                  onChange={handleInputChange}
                />

                {/* Responsibilities */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Responsibilities
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      label="Add Responsibility"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddResponsibility();
                        }
                      }}
                      fullWidth
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddResponsibility}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {currentTeam.responsibilities.map((resp) => (
                      <Chip
                        key={resp}
                        label={resp}
                        onDelete={() => handleDeleteResponsibility(resp)}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Team Leader */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Team Leader
                  </Typography>
                  <Select
                    fullWidth
                    name="teamLeaderID"
                    value={currentTeam.teamLeaderID}
                    onChange={(e) =>
                      setCurrentTeam((prev) => ({
                        ...prev,
                        teamLeaderID: e.target.value as string,
                      }))
                    }
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="">
                      <em>Select Team Leader</em>
                    </MenuItem>
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* Team Members Table */}
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      Team Members ({teamMembers.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleOpenEmployeeDialog}
                    >
                      Manage Members
                    </Button>
                  </Box>
                  <Box sx={{ height: 260, width: "100%" }}>
                    <DataGrid
                      rows={teamMembers}
                      columns={[
                        { field: "id", headerName: "ID", width: 90 },
                        {
                          field: "fullName",
                          headerName: "Full Name",
                          width: 200,
                        },
                        { field: "email", headerName: "Email", width: 220 },
                        { field: "phone", headerName: "Phone", width: 150 },
                        {
                          field: "add",
                          headerName: "In Team",
                          width: 140,
                          renderCell: (params) => (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
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
                      disableSelectionOnClick
                    />
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editMode ? "Update Team" : "Add Team"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Employee Selection Dialog */}
          <Dialog
            open={openEmployeeDialog}
            onClose={handleCloseEmployeeDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>Select Employees</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="dense"
                  label="Search Employees"
                  type="text"
                  fullWidth
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </Box>
              <Box sx={{ height: 320, width: "100%", mt: 2 }}>
                <DataGrid
                  rows={filteredEmployees}
                  columns={[
                    {
                      field: "add",
                      headerName: "In Team",
                      width: 140,
                      renderCell: (params) => (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleMemberChange(params.row.id)}
                        >
                          {currentTeam.memberIDs.includes(params.row.id)
                            ? "Remove"
                            : "Add"}
                        </Button>
                      ),
                    },
                    { field: "id", headerName: "ID", width: 90 },
                    {
                      field: "fullName",
                      headerName: "Full Name",
                      width: 200,
                    },
                    { field: "email", headerName: "Email", width: 220 },
                    { field: "phone", headerName: "Phone", width: 150 },
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEmployeeDialog}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this team?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose}>Cancel</Button>
              <Button
                onClick={handleDeleteTeam}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Layout>
  );
};

export default TeamList;
