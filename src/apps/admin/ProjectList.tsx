import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { Edit } from "@mui/icons-material";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/projects/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects.");
        }
        const data = await response.json();
        setProjects(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Typography>Loading projects...</Typography>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography color="error">{error}</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Project List
          </Typography>
          <Button
            component={Link}
            to="/admin/projects/new" // Link to the create project route
            variant="contained"
            color="primary"
          >
            Create New Project
          </Button>
        </Paper>
        <Grid container spacing={3} sx={{ p: 2 }}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {project.projectName}
                  </Typography>
                  <Typography color="textSecondary">
                    {project.projectDescription}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Start Date:</strong>{" "}
                    {new Date(project.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End Date:</strong>{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Manager:</strong> {project.projectManager}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {project.status}
                  </Typography>
                  <IconButton
                    component={Link}
                    to={`/admin/projects/edit/${project.id}`} // Link to the edit project route
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default ProjectList;
