import React, { useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import {
  Button,
  Typography,
  Box,
  Container,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Face, Done, Close } from "@mui/icons-material";

interface Assignment {
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
type DialogAction = "acknowledge" | "reject" | "return";

interface CommentProps {
  commentData: string; // Example of comment data
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Assignments: React.FC<CommentProps> = ({ commentData, onChange }) => {
  // State to track assignment status and assignment details
  const [assignment, setAssignment] = useState<Assignment>({
    ticketAssigned: false,
    acknowledged: false,
    rejected: false,
    returned: false,
    teamId: "",
    description: "",
    onAssignDate: "",
    onAcknowledgementDate: null,
    rejectTicketDate: null,
    returnTicketDate: null,
  });

  // State for dialog box
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogAction, setDialogAction] = useState<DialogAction | null>(null);

  // Assign Ticket
  const assignTicket = () => {
    if (assignment.acknowledged || assignment.rejected) {
      alert("Ticket has already been acknowledged or rejected.");
      return;
    }
    const currentDate = new Date().toISOString();
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      ticketAssigned: true,
      onAssignDate: currentDate,
    }));
    alert("Ticket assigned successfully!");
  };

  // Acknowledge Ticket
  const acknowledgeTicket = () => {
    if (assignment.acknowledged) {
      alert("Ticket has already been acknowledged.");
      return;
    }
    const currentDate = new Date().toISOString();
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      acknowledged: true,
      onAcknowledgementDate: currentDate,
    }));
    alert("Ticket acknowledged!");
  };
  // Reject Ticket
  const rejectTicket = () => {
    if (assignment.rejected) {
      alert("Ticket has already been rejected.");
      return;
    }
    const currentDate = new Date().toISOString();
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      rejected: true,
      rejectTicketDate: currentDate,
    }));
    alert("Ticket rejected!");
  };

  // Return Ticket
  const returnTicket = () => {
    if (assignment.returned) {
      alert("Ticket has already been returned.");
      return;
    }
    const currentDate = new Date().toISOString();
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      returned: true,
      returnTicketDate: currentDate,
    }));
    alert("Ticket returned!");
  };
  // Handle Dialog open/close for actions
  const handleDialogOpen = (action: DialogAction) => {
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = () => {
    if (!dialogAction) return;
    if (dialogAction === "acknowledge") {
      acknowledgeTicket();
    } else if (dialogAction === "reject") {
      rejectTicket();
    } else if (dialogAction === "return") {
      returnTicket();
    }
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ticket Assignment System
        </Typography>

        {!assignment.ticketAssigned ? (
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Team ID"
              variant="outlined"
              fullWidth
              value={assignment.teamId}
              onChange={(e) =>
                setAssignment({ ...assignment, teamId: e.target.value })
              }
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={assignment.description}
              onChange={(e) =>
                setAssignment({ ...assignment, description: e.target.value })
              }
              sx={{ marginTop: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={assignTicket}
              disabled={!assignment.teamId || !assignment.description}
            >
              Assign Ticket to Team
            </Button>
          </Box>
        ) : (
          <Typography variant="h6" color="success.main">
            Ticket assigned to Team: {assignment.teamId}
            <br />
            Description: {assignment.description}
            <br />
            Assigned on: {new Date(assignment.onAssignDate).toLocaleString()}
          </Typography>
        )}

        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ marginTop: 4 }}
        >
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => handleDialogOpen("acknowledge")}
              disabled={assignment.acknowledged || assignment.rejected}
              startIcon={<Done />}
            >
              Acknowledge
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => handleDialogOpen("reject")}
              disabled={assignment.rejected || assignment.acknowledged}
              startIcon={<Close />}
            >
              Reject
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => handleDialogOpen("return")}
              disabled={
                assignment.returned ||
                assignment.acknowledged ||
                assignment.rejected
              }
              startIcon={<Face />}
            >
              Return
            </Button>
          </Grid>
        </Grid>

        {/* Dialog for Acknowledge/Reject/Return Confirmation */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{`Confirm ${
            dialogAction?.charAt(0).toUpperCase() + dialogAction?.slice(1)
          } Ticket`}</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {dialogAction} the ticket?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Assignments;
