import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique id generation

// Interfaces to define structure of data
interface Assignment {
  id: string;
  ticketAssigned: boolean;
  acknowledged: boolean;
  rejected: boolean;
  returned: boolean;
  teamId: string;
  description: string;
  onAssignDate: string;
  onAcknowledgementDate: string | null;
  rejectTicketDate: string | null;
  returnTicketDate: string | null;
}

interface AssignmentsList {
  id: string;
  assignments: Assignment[];
}

interface AssignmentsProps {
  assignmentsList: AssignmentsList;
  setAssignmentsList: React.Dispatch<React.SetStateAction<AssignmentsList>>;
}

// Main component
const Assignments: React.FC<AssignmentsProps> = ({
  assignmentsList,
  setAssignmentsList,
}) => {
  const [open, setOpen] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  // Example team list, this could be fetched from an API or props
  const teams = [
    { id: "team1", name: "Team 1" },
    { id: "team2", name: "Team 2" },
    { id: "team3", name: "Team 3" },
  ];

  // Ensure assignmentsList is initialized properly
  const safeAssignmentsList = assignmentsList || { assignments: [] };

  // Handle opening and closing the dialog
  const handleClickOpen = (assignment?: Assignment) => {
    if (assignment) {
      setSelectedAssignmentId(assignment.id);
      setAssignmentDescription(assignment.description); // Populate description for editing
      setSelectedTeamId(assignment.teamId); // Set the selected team
    } else {
      setSelectedAssignmentId(null);
      setAssignmentDescription(""); // Clear description for new assignment
      setSelectedTeamId(""); // Reset team selection
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle adding or updating an assignment
  const handleSubmit = () => {
    if (assignmentDescription.trim() === "" || !selectedTeamId) return;

    const newAssignment: Assignment = {
      id: uuidv4(), // Generate a unique ID
      description: assignmentDescription,
      onAssignDate: new Date().toISOString(),
      ticketAssigned: false,
      acknowledged: false,
      rejected: false,
      returned: false,
      teamId: selectedTeamId, // Add selected team ID
      onAcknowledgementDate: null,
      rejectTicketDate: null,
      returnTicketDate: null,
    };

    if (selectedAssignmentId) {
      // Update the existing assignment
      const updatedAssignments = safeAssignmentsList.assignments.map(
        (assignment) =>
          assignment.id === selectedAssignmentId
            ? {
                ...assignment,
                description: assignmentDescription,
                teamId: selectedTeamId,
              }
            : assignment
      );
      setAssignmentsList({
        ...safeAssignmentsList,
        assignments: updatedAssignments,
      });
    } else {
      // Add a new assignment
      setAssignmentsList({
        ...safeAssignmentsList,
        assignments: [...safeAssignmentsList.assignments, newAssignment],
      });
    }

    // Reset fields and close the dialog
    setAssignmentDescription("");
    setSelectedTeamId("");
    setSelectedAssignmentId(null);
    setOpen(false);
  };

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id #",
      width: 150,
    },
    {
      field: "description",
      headerName: "Description",
      width: 500,
    },
    {
      field: "teamId",
      headerName: "Assigned Team",
      width: 200,
      renderCell: (params) => {
        const team = teams.find((team) => team.id === params.row.teamId);
        return team ? team.name : "No team assigned";
      },
    },
    {
      field: "onAssignDate",
      headerName: "On Assign Date",
      width: 200,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 90,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleClickOpen(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* DataGrid to display assignments */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={safeAssignmentsList.assignments}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      {/* Button to open the dialog for adding a new assignment */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen()}
      >
        Assign
      </Button>

      {/* Dialog to add or edit an assignment */}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "500px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle>
          {selectedAssignmentId ? "Edit Assignment" : "Add New Assignment"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Assign Team</InputLabel>
            <Select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              label="Assign Team"
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedAssignmentId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assignments;
