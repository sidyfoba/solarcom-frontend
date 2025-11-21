// src/pages/UsersPage.tsx
import { FormEvent, useEffect, useState } from "react";
import { UserApi } from "../../../api/userApi";
import { CreateUserRequest, UserAccountDto } from "../types/iam";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  Stack,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

import Layout from "../Layout";

export function UsersPage() {
  const [users, setUsers] = useState<UserAccountDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateUserRequest>({
    username: "",
    email: "",
    password: "",
    internalUser: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  //user update
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccountDto | null>(null);

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    internalUser: false,
    enabled: true,
  });

  const [newPassword, setNewPassword] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);

  //user update handlers
  function openEditDialog(user: UserAccountDto) {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      internalUser: user.internalUser,
      enabled: user.enabled,
    });
    setEditDialogOpen(true);
  }

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setEditSubmitting(true);
      await UserApi.update(selectedUser.id, {
        username: editForm.username,
        email: editForm.email,
        internalUser: editForm.internalUser,
        enabled: editForm.enabled,
      });
      showSnackbar("User updated successfully", "success");
      setEditDialogOpen(false);
      setSelectedUser(null);
      load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to update user";
      showSnackbar(msg, "error");
    } finally {
      setEditSubmitting(false);
    }
  }

  function openPasswordDialog(user: UserAccountDto) {
    setSelectedUser(user);
    setNewPassword("");
    setPasswordDialogOpen(true);
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    if (!newPassword.trim()) {
      showSnackbar("New password is required", "info");
      return;
    }

    try {
      setResetSubmitting(true);
      await UserApi.resetPassword(selectedUser.id, { newPassword });
      showSnackbar("Password reset successfully", "success");
      setPasswordDialogOpen(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch (e: any) {
      const msg = e.message ?? "Failed to reset password";
      showSnackbar(msg, "error");
    } finally {
      setResetSubmitting(false);
    }
  }

  function showSnackbar(
    msg: string,
    severity: "success" | "error" | "info" = "info"
  ) {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await UserApi.list();
      setUsers(data);
    } catch (e: any) {
      const msg = e.message ?? "Failed to load users";
      setError(msg);
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      showSnackbar("All fields are required.", "info");
      return;
    }

    try {
      setSubmitting(true);

      await UserApi.create(form);

      showSnackbar("User created successfully!", "success");

      setForm({
        username: "",
        email: "",
        password: "",
        internalUser: false,
      });

      load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to create user";
      showSnackbar(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleUserEnabled(user: UserAccountDto) {
    try {
      await UserApi.setEnabled(user.id, !user.enabled);
      showSnackbar("User updated.", "success");
      load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to update user";
      showSnackbar(msg, "error");
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Page Header */}
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Users
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Create users and manage their activation status.
            </Typography>
          </Box>

          {/* Create User Card */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              borderTop: "4px solid #004aad",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Create User
            </Typography>

            <form onSubmit={handleCreate}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Username"
                    fullWidth
                    size="small"
                    required
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    size="small"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    size="small"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.internalUser}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            internalUser: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Internal User"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        submitting ||
                        !form.username.trim() ||
                        !form.email.trim() ||
                        !form.password.trim()
                      }
                    >
                      {submitting ? "Creating..." : "Create User"}
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

          {/* User List Card */}
          <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">User List</Typography>

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
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Internal</TableCell>
                    <TableCell>Enabled</TableCell>
                    <TableCell align="center">Toggle</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.internalUser ? "Yes" : "No"}</TableCell>
                      <TableCell>{u.enabled ? "Yes" : "No"}</TableCell>

                      <TableCell align="center">
                        <Switch
                          checked={u.enabled}
                          onChange={() => toggleUserEnabled(u)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(u)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openPasswordDialog(u)}
                          >
                            <LockResetIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {users.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 1 }}
                        >
                          No users yet.
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
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Full-page loading overlay */}
        {loading && users.length === 0 && (
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

        {/* Edit User Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit User</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  fullWidth
                  required
                  size="small"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  size="small"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editForm.internalUser}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          internalUser: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Internal User"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editForm.enabled}
                      onChange={(e) =>
                        setEditForm({ ...editForm, enabled: e.target.checked })
                      }
                    />
                  }
                  label="Enabled"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  editSubmitting ||
                  !editForm.username.trim() ||
                  !editForm.email.trim()
                }
              >
                {editSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Reset Password {selectedUser ? `for ${selectedUser.username}` : ""}
          </DialogTitle>
          <form onSubmit={handleResetPassword}>
            <DialogContent sx={{ pt: 2 }}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                required
                size="small"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={resetSubmitting || !newPassword.trim()}
              >
                {resetSubmitting ? "Updating..." : "Reset Password"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Layout>
  );
}
