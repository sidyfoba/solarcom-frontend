// AssignmentsDemo.tsx

import React, { useState } from "react";
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
  Paper,
  Stack,
  Typography,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

// ----------------------
// Types & Interfaces
// ----------------------

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

// ----------------------
// Assignments Component
// ----------------------

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

  // Example team list, this could be fetched from an API or passed as prop
  const teams = [
    { id: "1", name: "Team 1" },
    { id: "2", name: "Team 2" },
    { id: "3", name: "Team 3" },
  ];

  // Ensure assignmentsList is initialized properly
  const safeAssignmentsList = assignmentsList || { assignments: [] };

  const handleClickOpen = (assignment?: Assignment) => {
    if (assignment) {
      setSelectedAssignmentId(assignment.id);
      setAssignmentDescription(assignment.description);
      setSelectedTeamId(assignment.teamId);
    } else {
      setSelectedAssignmentId(null);
      setAssignmentDescription("");
      setSelectedTeamId("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (assignmentDescription.trim() === "" || !selectedTeamId) return;

    const newAssignment: Assignment = {
      id: uuidv4(),
      description: assignmentDescription.trim(),
      onAssignDate: new Date().toISOString(),
      ticketAssigned: false,
      acknowledged: false,
      rejected: false,
      returned: false,
      teamId: selectedTeamId,
      onAcknowledgementDate: null,
      rejectTicketDate: null,
      returnTicketDate: null,
    };

    if (selectedAssignmentId) {
      const updatedAssignments = safeAssignmentsList.assignments.map(
        (assignment) =>
          assignment.id === selectedAssignmentId
            ? {
                ...assignment,
                description: assignmentDescription.trim(),
                teamId: selectedTeamId,
              }
            : assignment
      );
      setAssignmentsList({
        ...safeAssignmentsList,
        assignments: updatedAssignments,
      });
    } else {
      setAssignmentsList({
        ...safeAssignmentsList,
        assignments: [...safeAssignmentsList.assignments, newAssignment],
      });
    }

    setAssignmentDescription("");
    setSelectedTeamId("");
    setSelectedAssignmentId(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedAssignments = safeAssignmentsList.assignments.filter(
      (assignment) => assignment.id !== id
    );
    setAssignmentsList({
      ...safeAssignmentsList,
      assignments: updatedAssignments,
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID #",
      width: 160,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 280,
    },
    {
      field: "teamId",
      headerName: "Assigned Team",
      width: 200,
      // valueGetter: (params) =>
      //   teams.find((team) => team.id === params.row.teamId)?.name ||
      //   "No team assigned",
    },
    {
      field: "onAssignDate",
      headerName: "Assigned On",
      width: 210,
      valueFormatter: (params) => formatDate(params.value as string),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="primary"
          size="small"
          onClick={() => onEdit(params.row as Assignment)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          size="small"
          onClick={() => onDelete(params.row.id as string)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  // --------- Timeline / Chronogram data ---------
  const sortedAssignments = [...safeAssignmentsList.assignments].sort(
    (a, b) =>
      new Date(b.onAssignDate).getTime() - new Date(a.onAssignDate).getTime()
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {/* Header */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Assignments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage assignment records, assign tickets to teams, and update
            existing assignments.
          </Typography>
        </Box>

        {/* Table Card */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Divider textAlign="left">
              <Chip label="Assignments List" size="small" />
            </Divider>
          </Box>

          <Box sx={{ height: 360, width: "100%" }}>
            <DataGrid
              rows={safeAssignmentsList.assignments}
              columns={columns}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              disableRowSelectionOnClick
              density="compact"
            />
          </Box>

          {/* Vertical Chronogram / Timeline */}
          <Box sx={{ mt: 3 }}>
            <Divider textAlign="left">
              <Chip label="Assignments Timeline" size="small" color="primary" />
            </Divider>

            {sortedAssignments.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: "center" }}
              >
                No assignments yet. New assignments will appear here in
                chronological order.
              </Typography>
            ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {sortedAssignments.map((assignment, index) => {
                  const team =
                    teams.find((team) => team.id === assignment.teamId) || null;
                  const displayName = team?.name || "Unassigned";
                  const initials = displayName?.charAt(0)?.toUpperCase() || "U";
                  const isLast = index === sortedAssignments.length - 1;

                  return (
                    <Box
                      key={assignment.id}
                      sx={{ display: "flex", alignItems: "flex-start" }}
                    >
                      {/* Left column: avatar + vertical line */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mr: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 14,
                          }}
                        >
                          {initials}
                        </Avatar>
                        {!isLast && (
                          <Box
                            sx={{
                              mt: 0.5,
                              width: 2,
                              flex: 1,
                              bgcolor: "divider",
                            }}
                          />
                        )}
                      </Box>

                      {/* Right column: card with info */}
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          flex: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          {formatDate(assignment.onAssignDate)}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.25 }}
                        >
                          {displayName}
                        </Typography>
                        <Typography variant="body2">
                          {assignment.description || "No description provided."}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClickOpen()}
            >
              Assign
            </Button>
          </Box>
        </Paper>
      </Stack>

      {/* Dialog for add / edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedAssignmentId ? "Edit Assignment" : "Add New Assignment"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Assign Team</InputLabel>
              <Select
                label="Assign Team"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value as string)}
                required
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={assignmentDescription}
              onChange={(e) => setAssignmentDescription(e.target.value)}
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {selectedAssignmentId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ----------------------
// Demo Wrapper with Dummy Data
// ----------------------

const AssignmentsDemo: React.FC = () => {
  const [assignmentsList, setAssignmentsList] = useState<AssignmentsList>({
    id: "list-001",
    assignments: [
      {
        id: "a1",
        description: "Investigate network latency issue in Zone A",
        teamId: "team1",
        ticketAssigned: true,
        acknowledged: true,
        rejected: false,
        returned: false,
        onAssignDate: "2025-02-02T09:15:00Z",
        onAcknowledgementDate: "2025-02-02T09:30:00Z",
        rejectTicketDate: null,
        returnTicketDate: null,
      },
      {
        id: "a2",
        description: "Replace faulty router in Control Room",
        teamId: "team2",
        ticketAssigned: true,
        acknowledged: false,
        rejected: false,
        returned: false,
        onAssignDate: "2025-02-04T14:40:00Z",
        onAcknowledgementDate: null,
        rejectTicketDate: null,
        returnTicketDate: null,
      },
      {
        id: "a3",
        description: "Review weekly maintenance checklist",
        teamId: "team3",
        ticketAssigned: false,
        acknowledged: false,
        rejected: false,
        returned: false,
        onAssignDate: "2025-02-05T08:10:00Z",
        onAcknowledgementDate: null,
        rejectTicketDate: null,
        returnTicketDate: null,
      },
      {
        id: "a4",
        description: "Prepare incident report for system outage",
        teamId: "team1",
        ticketAssigned: true,
        acknowledged: true,
        rejected: false,
        returned: true,
        onAssignDate: "2025-02-06T16:25:00Z",
        onAcknowledgementDate: "2025-02-06T16:40:00Z",
        rejectTicketDate: null,
        returnTicketDate: "2025-02-06T18:20:00Z",
      },
    ],
  });

  return (
    <Box sx={{ p: 3 }}>
      <Assignments
        assignmentsList={assignmentsList}
        setAssignmentsList={setAssignmentsList}
      />
    </Box>
  );
};

export default AssignmentsDemo;
