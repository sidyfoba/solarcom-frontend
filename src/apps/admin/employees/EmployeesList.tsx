// EmployeeDataGrid.tsx
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import Layout from "../Layout";
import {
  Box,
  Paper,
  Button,
  Typography,
  Container,
  Stack,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  emergencyContacts: string;
  socialSecurityNumber: string;
  jobTitle?: string;
  department?: string;
  employeeID?: string;
  startDate?: string;
  employmentStatus?: string;
  workSchedule?: string;
}

const EmployeesList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Employee[]>(
          `${import.meta.env.VITE_API_BASE}/api/hr/employee/all`
        );
        setEmployees(response.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees");
        setSnackbarMessage("Failed to load employees");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/hr/employee/${employeeToDelete}`
      );
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete));
      setSnackbarMessage("Employee deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setSnackbarMessage("Failed to delete employee.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddEmployee = () => {
    navigate("/employee-form");
  };

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 120,
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEdit(params.row.id)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row.id)}
          />
        </>
      ),
    },
    { field: "id", headerName: "ID", width: 100 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 220 },
    { field: "dob", headerName: "Date of Birth", width: 140 },
    {
      field: "emergencyContacts",
      headerName: "Emergency Contacts",
      width: 200,
    },
    {
      field: "socialSecurityNumber",
      headerName: "Social Security Number",
      width: 180,
    },
    { field: "jobTitle", headerName: "Job Title", width: 180 },
    { field: "department", headerName: "Department", width: 160 },
    { field: "employeeID", headerName: "Employee ID", width: 130 },
    { field: "startDate", headerName: "Start Date", width: 130 },
    {
      field: "employmentStatus",
      headerName: "Employment Status",
      width: 180,
    },
    { field: "workSchedule", headerName: "Work Schedule", width: 160 },
  ];

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
                Employees
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                View, edit, and manage all registered employees.
              </Typography>
            </Box>

            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Divider textAlign="left" sx={{ mb: 2 }}>
                <Chip
                  label="Employee List"
                  color="primary"
                  variant="outlined"
                />
              </Divider>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                }}
              >
                <Button variant="contained" onClick={handleAddEmployee}>
                  Add Employee
                </Button>
              </Box>

              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 250,
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading employees...
                  </Typography>
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : employees.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No employees found. Add an employee to get started.
                </Typography>
              ) : (
                <Box sx={{ height: 500, width: "100%" }}>
                  <DataGrid
                    rows={employees}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                  />
                </Box>
              )}
            </Paper>

            {/* Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Stack>
        </Container>

        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this employee?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default EmployeesList;
