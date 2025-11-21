// src/pages/RolesPage.tsx
import { FormEvent, useEffect, useState } from "react";
import { RoleApi } from "../../../api/roleApi";
import { PermissionApi } from "../../../api/permissionApi";
import { CreateRoleRequest, PermissionDto, RoleDto } from "../types/iam";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
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
  TableContainer,
} from "@mui/material";

import Layout from "../Layout";

export function RolesPage() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<CreateRoleRequest>({
    code: "",
    name: "",
    description: "",
  });

  const [permRoleCode, setPermRoleCode] = useState("");
  const [permPermissionCode, setPermPermissionCode] = useState("");

  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [submittingAttach, setSubmittingAttach] = useState(false);

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

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [r, p] = await Promise.all([RoleApi.list(), PermissionApi.list()]);
      setRoles(r);
      setPermissions(p);
    } catch (e: any) {
      const msg = e.message ?? "Failed to load roles/permissions";
      setError(msg);
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreateRole(e: FormEvent) {
    e.preventDefault();
    if (!createForm.code.trim() || !createForm.name.trim()) {
      showSnackbar("Code and Name are required.", "info");
      return;
    }

    try {
      setSubmittingCreate(true);
      await RoleApi.create(createForm);
      setCreateForm({ code: "", name: "", description: "" });
      showSnackbar("Role created successfully.", "success");
      await load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to create role";
      showSnackbar(msg, "error");
    } finally {
      setSubmittingCreate(false);
    }
  }

  async function handleAddPermission(e: FormEvent) {
    e.preventDefault();
    if (!permRoleCode || !permPermissionCode) {
      showSnackbar("Please select role and permission.", "info");
      return;
    }

    try {
      setSubmittingAttach(true);
      await RoleApi.addPermissionToRole(permRoleCode, permPermissionCode);
      showSnackbar("Permission added to role.", "success");
    } catch (e: any) {
      const msg = e.message ?? "Failed to add permission";
      showSnackbar(msg, "error");
    } finally {
      setSubmittingAttach(false);
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Page header */}
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Roles
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage application roles and attach permissions to them.
            </Typography>
          </Box>

          {/* Create Role card */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              borderTop: "4px solid #004aad",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Create Role
            </Typography>

            <form onSubmit={handleCreateRole}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Code (e.g. TENANT_ADMIN)"
                    fullWidth
                    size="small"
                    value={createForm.code}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Name"
                    fullWidth
                    size="small"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Description"
                    fullWidth
                    size="small"
                    value={createForm.description ?? ""}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 1,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        submittingCreate ||
                        !createForm.code.trim() ||
                        !createForm.name.trim()
                      }
                    >
                      {submittingCreate ? "Creating..." : "Create Role"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>

            {error && (
              <Box mt={2}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            )}
          </Paper>

          {/* Attach Permission to Role card */}
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Attach Permission to Role
            </Typography>

            <form onSubmit={handleAddPermission}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      label="Role"
                      value={permRoleCode}
                      onChange={(e) => setPermRoleCode(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select role</em>
                      </MenuItem>
                      {roles.map((r) => (
                        <MenuItem key={r.id} value={r.code}>
                          {r.code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="perm-select-label">Permission</InputLabel>
                    <Select
                      labelId="perm-select-label"
                      label="Permission"
                      value={permPermissionCode}
                      onChange={(e) => setPermPermissionCode(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select permission</em>
                      </MenuItem>
                      {permissions.map((p) => (
                        <MenuItem key={p.id} value={p.code}>
                          {p.code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="outlined"
                      disabled={
                        submittingAttach || !permRoleCode || !permPermissionCode
                      }
                    >
                      {submittingAttach ? "Adding..." : "Add Permission"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Role list card */}
          <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Role List</Typography>
              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Loading...</Typography>
                </Box>
              )}
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.code}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.description}</TableCell>
                    </TableRow>
                  ))}
                  {roles.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={4}>
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
            </TableContainer>
          </Paper>
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
      </Container>
    </Layout>
  );
}
