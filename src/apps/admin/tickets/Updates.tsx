import React, { useState } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique id generation

// Define types for the Update data structure
interface Update {
  id: string;
  text: string;
  updateNumber: number;
  date: string;
}

interface UpdateMessages {
  id: string;
  updatesTitle: string;
  updates: Update[];
}

interface UpdateProps {
  setUpdateMessages: React.Dispatch<React.SetStateAction<UpdateMessages>>;
  updateMessages: UpdateMessages; // Pass the current update messages to the component
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Update: React.FC<UpdateProps> = ({
  setUpdateMessages,
  updateMessages,
  onChange,
}) => {
  // console.log(updateMessages);
  // console.log(setUpdateMessages);
  const [open, setOpen] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);

  // Handle opening and closing the dialog
  const handleClickOpen = (update?: Update) => {
    if (update) {
      setSelectedUpdateId(update.id);
      setUpdateText(update.text);
    } else {
      setSelectedUpdateId(null);
      setUpdateText("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle adding or updating an update
  const handleSubmit = () => {
    if (updateText.trim() === "") return;

    const newUpdate: Update = {
      id: uuidv4(), // Use uuidv4 to generate a unique ID
      text: updateText,
      updateNumber: updateMessages.updates.length + 1,
      date: new Date().toISOString(),
    };

    if (selectedUpdateId) {
      // Update the existing update
      const updatedUpdates = updateMessages.updates.map((update) =>
        update.id === selectedUpdateId
          ? { ...update, text: updateText }
          : update
      );
      setUpdateMessages({ ...updateMessages, updates: updatedUpdates });
    } else {
      // Add a new update
      setUpdateMessages({
        ...updateMessages,
        updates: [...updateMessages.updates, newUpdate],
      });
    }

    // Reset fields and close the dialog
    setUpdateText("");
    setSelectedUpdateId(null);
    setOpen(false);
  };

  // Handle deleting an update
  const handleDelete = (id: string) => {
    const updatedUpdates = updateMessages.updates.filter(
      (update) => update.id !== id
    );
    const reorderedUpdates = updatedUpdates.map((update, index) => ({
      ...update,
      updateNumber: index + 1, // Reassign the updateNumber based on the new index
    }));
    setUpdateMessages({
      ...updateMessages,
      updates: reorderedUpdates,
    });
  };

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    {
      field: "updateNumber",
      headerName: "Update #",
      width: 150,
    },
    {
      field: "text",
      headerName: "Text",
      width: 500,
    },
    {
      field: "date",
      headerName: "Date",
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
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.id as string)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Update Title */}
      <TextField
        label="Enter update information (update title)"
        fullWidth
        variant="outlined"
        margin="normal"
        value={updateMessages.updatesTitle}
        onChange={onChange}
      />

      {/* DataGrid to display updates */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={updateMessages.updates}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      {/* Button to open the dialog for adding a new update */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen()}
      >
        Add Update
      </Button>

      {/* Dialog to add or edit an update */}
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
          {selectedUpdateId ? "Edit Update" : "Add New Update"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Update Text"
            fullWidth
            multiline
            rows={4}
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedUpdateId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Update;
