import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";

// UpdateForm component
interface UpdateFormProps {
  onAddUpdate: (newUpdate: Update) => void;
}

// Define types for updates and comments
interface Update {
  text: string;
  date: string;
  user: string;
}
const UpdateForm: React.FC<UpdateFormProps> = ({ onAddUpdate }) => {
  const [text, setText] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newUpdate: Update = {
      text,
      date,
      user,
    };
    onAddUpdate(newUpdate);
    setText("");
    setDate("");
    setUser("");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add a New Update
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Update Text"
              variant="outlined"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="User"
              variant="outlined"
              fullWidth
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UpdateForm;
