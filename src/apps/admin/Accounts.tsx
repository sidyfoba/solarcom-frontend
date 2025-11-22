import VisibilityIcon from "@mui/icons-material/Visibility";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Container,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import Layout from "./Layout";
import RoleDialog from "./RoleDialog";
import LoginPwdDialog from "./LoginPwdDialog";

interface User {
  id: string;
  login: string;
  email: string;
  password: string;
  name: string;
  // departement?: string; // add if you need department logic later
}

interface Props {
  roles: string[];
}

type SnackbarSeverity = "success" | "error";

const Accounts: React.FC<Props> = ({ roles }) => {
  const navigate = useNavigate();
  const isAdmin = roles.length > 0 && roles.includes("ADMIN");
  const isDelegate = roles.length > 0 && roles.includes("DÉLÉGUÉ");

  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<User[]>(
          `${import.meta.env.VITE_API_URL}/api/users`
        );
        setRows(response.data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
        setSnackbarMessage("Failed to load users.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    try {
      const fileName = "users_data.xlsx";
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, fileName);
      setSnackbarMessage("Users exported to Excel.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      setSnackbarMessage("Failed to export to Excel.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleOpenLoginDialog = (user: User) => {
    setSelectedUser(user);
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setSelectedUser(null);
    setOpenLoginDialog(false);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    navigate(`/user/${user.id}`);
  };

  const handleAddUser = () => {
    navigate("/admin/user");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: "viewDetails",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleViewDetails(params.row as User)}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      field: "edit",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleOpenDialog(params.row as User)}
        >
          <AssignmentIndIcon />
        </IconButton>
      ),
    },
    {
      field: "loginpwd",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleOpenLoginDialog(params.row as User)}
        >
          <VpnKeyIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "login", headerName: "Login", width: 150 },
    { field: "email", headerName: "Email", width: 220 },
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
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  User Accounts
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  View, manage and export application user accounts.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                {isAdmin && (
                  <Chip
                    label="Admin"
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                )}
                {isDelegate && (
                  <Chip
                    label="Délégué"
                    color="secondary"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Stack>

            <Divider textAlign="left" sx={{ mb: 3 }}>
              <Chip label="Accounts List" color="primary" variant="outlined" />
            </Divider>

            {/* Top actions */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "flex-start" },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddUser}
                  >
                    Add User
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "flex-end" },
                  }}
                >
                  <Button variant="outlined" onClick={exportToExcel}>
                    Export to Excel
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Data grid / loading / error */}
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 260,
                }}
              >
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading users...
                </Typography>
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                <div style={{ height: 500, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                </div>
              </Paper>
            )}
          </Paper>

          {/* Role dialog */}
          <RoleDialog
            open={openDialog}
            onClose={handleCloseDialog}
            signUpRequest={selectedUser}
          />

          {/* Login/password dialog */}
          <LoginPwdDialog
            open={openLoginDialog}
            onClose={handleCloseLoginDialog}
            signUpRequest={selectedUser}
          />

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
        </Container>
      </Box>
    </Layout>
  );
};

export default Accounts;
