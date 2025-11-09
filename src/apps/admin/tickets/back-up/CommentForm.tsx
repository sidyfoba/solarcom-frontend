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

// CommentForm component
interface CommentFormProps {
  onAddComment: (newComment: Comment) => void;
}

interface Comment {
  comment: string;
  user: string;
}
const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
  const [comment, setComment] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newComment: Comment = {
      comment,
      user,
    };
    onAddComment(newComment);
    setComment("");
    setUser("");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add a New Comment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
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
              Add Comment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default CommentForm;
