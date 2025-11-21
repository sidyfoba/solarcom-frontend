// src/pages/AssignUserRolePage.tsx
import { FormEvent, useEffect, useState } from "react";
import { UserApi } from "../../../api/userApi";
import { CustomerApi } from "../../../api/customerApi";
import { RoleApi } from "../../../api/roleApi";
import {
  AssignUserRoleRequest,
  CustomerDto,
  RoleDto,
  UserAccountDto,
  UserRoleDto,
} from "../types/iam";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import Layout from "../Layout";

export function AssignUserRolePage() {
  const [users, setUsers] = useState<UserAccountDto[]>([]);
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");

  const [assignedRoles, setAssignedRoles] = useState<UserRoleDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  function showSnackbar(
    message: string,
    severity: "success" | "error" | "info" = "info"
  ) {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  async function loadInitial() {
    try {
      setLoadingInitial(true);
      setError(null);
      const [u, c, r] = await Promise.all([
        UserApi.list(),
        CustomerApi.list(),
        RoleApi.list(),
      ]);
      setUsers(u);
      setCustomers(c);
      setRoles(r);
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load initial data";
      setError(msg);
      showSnackbar(msg, "error");
    } finally {
      setLoadingInitial(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadUserRoles(userId: number) {
    try {
      const data = await UserApi.listRolesForUser(userId);
      setAssignedRoles(data);
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load user roles";
      setError(msg);
      showSnackbar(msg, "error");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedUserId || !selectedCustomerId || !selectedRoleId) {
      showSnackbar("Please select user, customer and role.", "info");
      return;
    }

    const payload: AssignUserRoleRequest = {
      userId: selectedUserId,
      customerId: selectedCustomerId,
      roleId: selectedRoleId,
    };

    try {
      setSubmitting(true);
      await UserApi.assignRole(payload);
      showSnackbar("Role assigned successfully.", "success");
      await loadUserRoles(payload.userId);
    } catch (e: any) {
      const msg = e?.message ?? "Failed to assign role";
      showSnackbar(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  function handleUserChange(value: string) {
    const id = value ? Number(value) : "";
    setSelectedUserId(id);
    setAssignedRoles([]);
    if (id) {
      loadUserRoles(id);
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Page header */}
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Assign User Roles
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Link users to customers and roles to manage access and
              permissions.
            </Typography>
          </Box>

          {/* Main card */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              borderTop: "4px solid #004aad",
            }}
          >
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="user-select-label">User</InputLabel>
                    <Select
                      labelId="user-select-label"
                      label="User"
                      value={
                        selectedUserId === "" ? "" : String(selectedUserId)
                      }
                      onChange={(e) => handleUserChange(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select user</em>
                      </MenuItem>
                      {users.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.username} (
                          {u.internalUser ? "internal" : "customer"})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="customer-select-label">Customer</InputLabel>
                    <Select
                      labelId="customer-select-label"
                      label="Customer"
                      value={
                        selectedCustomerId === ""
                          ? ""
                          : String(selectedCustomerId)
                      }
                      onChange={(e) =>
                        setSelectedCustomerId(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                    >
                      <MenuItem value="">
                        <em>Select customer</em>
                      </MenuItem>
                      {customers.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      label="Role"
                      value={
                        selectedRoleId === "" ? "" : String(selectedRoleId)
                      }
                      onChange={(e) =>
                        setSelectedRoleId(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                    >
                      <MenuItem value="">
                        <em>Select role</em>
                      </MenuItem>
                      {roles.map((r) => (
                        <MenuItem key={r.id} value={r.id}>
                          {r.code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 1,
                      gap: 1,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        submitting ||
                        !selectedUserId ||
                        !selectedCustomerId ||
                        !selectedRoleId
                      }
                    >
                      {submitting ? "Assigning..." : "Assign Role"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>

            {/* Error banner (optional) */}
            {error && (
              <Box mt={2}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            )}
          </Paper>

          {/* Roles for selected user */}
          {selectedUserId && (
            <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">
                  Roles for selected user (ID #{selectedUserId})
                </Typography>
              </Box>

              {loadingInitial ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading roles...
                  </Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedRoles.map((ur) => (
                      <TableRow key={ur.id}>
                        <TableCell>{ur.id}</TableCell>
                        <TableCell>
                          {ur.customerName} (#{ur.customerId})
                        </TableCell>
                        <TableCell>{ur.roleCode}</TableCell>
                      </TableRow>
                    ))}
                    {assignedRoles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ py: 1 }}
                          >
                            No roles yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Paper>
          )}
        </Stack>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Initial full-page loading (if nothing loaded yet) */}
        {loadingInitial &&
          users.length === 0 &&
          customers.length === 0 &&
          roles.length === 0 && (
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1300,
              }}
            >
              <CircularProgress />
            </Box>
          )}
      </Container>
    </Layout>
  );
}
