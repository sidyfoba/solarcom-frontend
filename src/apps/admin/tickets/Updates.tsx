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
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

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
  updateMessages: UpdateMessages;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Update: React.FC<UpdateProps> = ({
  setUpdateMessages,
  updateMessages,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);

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

  const handleSubmit = () => {
    if (updateText.trim() === "") return;

    const newUpdate: Update = {
      id: uuidv4(),
      text: updateText,
      updateNumber: updateMessages.updates.length + 1,
      date: new Date().toISOString(),
    };

    if (selectedUpdateId) {
      const updatedUpdates = updateMessages.updates.map((update) =>
        update.id === selectedUpdateId
          ? { ...update, text: updateText }
          : update
      );
      setUpdateMessages({ ...updateMessages, updates: updatedUpdates });
    } else {
      setUpdateMessages({
        ...updateMessages,
        updates: [...updateMessages.updates, newUpdate],
      });
    }

    setUpdateText("");
    setSelectedUpdateId(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedUpdates = updateMessages.updates.filter(
      (update) => update.id !== id
    );
    const reorderedUpdates = updatedUpdates.map((update, index) => ({
      ...update,
      updateNumber: index + 1,
    }));
    setUpdateMessages({
      ...updateMessages,
      updates: reorderedUpdates,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "updateNumber",
      headerName: "Update #",
      width: 110,
    },
    {
      field: "text",
      headerName: "Text",
      flex: 1,
      minWidth: 300,
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      valueFormatter: (params) => {
        const d = new Date(params.value as string);
        return isNaN(d.getTime())
          ? ""
          : d.toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
      },
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
          onClick={() => handleClickOpen(params.row as Update)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          size="small"
          onClick={() => handleDelete(params.id as string)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {/* Title / meta section */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Updates
          </Typography>
          <TextField
            label="Update title"
            placeholder="Enter update information (update title)"
            fullWidth
            variant="outlined"
            size="small"
            value={updateMessages.updatesTitle}
            onChange={onChange}
          />
        </Box>

        {/* Table card */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
          }}
        >
          <Box sx={{ height: 350, width: "100%" }}>
            <DataGrid
              rows={updateMessages.updates}
              columns={columns}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              disableRowSelectionOnClick
              density="compact"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClickOpen()}
            >
              Add Update
            </Button>
          </Box>
        </Paper>
      </Stack>

      {/* Dialog for add / edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {selectedUpdateId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Update;
