// src/pages/PermissionsPage.tsx
import { FormEvent, useEffect, useState } from "react";
import { PermissionApi } from "../../../api/permissionApi";
import { PermissionDto } from "../types/iam";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
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

export function PermissionsPage() {
  const [perms, setPerms] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<PermissionDto>({
    id: 0,
    code: "",
    description: "",
  });

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
      const data = await PermissionApi.list();
      setPerms(data);
    } catch (e: any) {
      const msg = e.message ?? "Failed to load permissions";
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
    if (!form.code.trim()) {
      showSnackbar("Permission code is required.", "info");
      return;
    }

    try {
      setSubmitting(true);
      await PermissionApi.create({
        code: form.code,
        description: form.description,
      });
      setForm({ id: 0, code: "", description: "" });
      showSnackbar("Permission created successfully.", "success");
      await load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to create permission";
      showSnackbar(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Page header */}
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Permissions
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Define and manage system permissions used by roles and users.
            </Typography>
          </Box>

          {/* Create Permission card */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              borderTop: "4px solid #004aad",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Create Permission
            </Typography>

            <form onSubmit={handleCreate}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Code (e.g. INVENTORY_VIEW)"
                    fullWidth
                    size="small"
                    value={form.code}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, code: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Description"
                    fullWidth
                    size="small"
                    value={form.description ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
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
                      variant="contained"
                      disabled={submitting || !form.code.trim()}
                    >
                      {submitting ? "Creating..." : "Create"}
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

          {/* Permission list card */}
          <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Permission List</Typography>
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
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {perms.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.code}</TableCell>
                      <TableCell>{p.description}</TableCell>
                    </TableRow>
                  ))}
                  {perms.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 1 }}
                        >
                          No permissions yet.
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
