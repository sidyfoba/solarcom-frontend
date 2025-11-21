// src/pages/CustomersPage.tsx
import { FormEvent, useEffect, useState } from "react";
import { CustomerApi } from "../../../api/customerApi";
import {
  CustomerDto,
  CreateCustomerRequest,
  CustomerStatus,
} from "../types/iam";

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

import Layout from "../Layout";

export function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateCustomerRequest>({
    name: "",
    // tenantKey is optional now, no need to keep in state
  });

  const [submitting, setSubmitting] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  //update customer dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(
    null
  );

  const [editForm, setEditForm] = useState<CreateCustomerRequest>({
    name: "",
    tenantKey: "",
  });
  //update cutomer handlers
  function openEditDialog(customer: CustomerDto) {
    setSelectedCustomer(customer);
    setEditForm({
      name: customer.name,
      tenantKey: customer.tenantKey,
    });
    setEditDialogOpen(true);
  }

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedCustomer) return;

    if (!editForm.name.trim()) {
      showSnackbar("Name is required.", "info");
      return;
    }

    try {
      setEditSubmitting(true);
      await CustomerApi.update(selectedCustomer.id, {
        name: editForm.name,
        tenantKey: editForm.tenantKey, // optional – can allow editing or disable it
      });
      showSnackbar("Customer updated successfully.", "success");
      setEditDialogOpen(false);
      setSelectedCustomer(null);
      await load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to update customer";
      showSnackbar(msg, "error");
    } finally {
      setEditSubmitting(false);
    }
  }

  // Show snackbar helper
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
      const data = await CustomerApi.list();
      setCustomers(data);
    } catch (e: any) {
      const msg = e.message ?? "Failed to load customers";
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
    if (!form.name.trim()) {
      showSnackbar("Please fill in Name.", "info");
      return;
    }

    try {
      setSubmitting(true);
      // tenantKey omitted -> backend auto-generates
      await CustomerApi.create({ name: form.name });
      setForm({ name: "" });
      showSnackbar("Customer created successfully.", "success");
      await load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to create customer";
      showSnackbar(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleChangeStatus(id: number, status: CustomerStatus) {
    try {
      await CustomerApi.changeStatus(id, status);
      showSnackbar("Status updated.", "success");
      await load();
    } catch (e: any) {
      const msg = e.message ?? "Failed to change status";
      showSnackbar(msg, "error");
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Page header */}
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Customers
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage customers, their tenant keys and lifecycle status.
            </Typography>
          </Box>

          {/* Create customer card */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              borderTop: "4px solid #004aad",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Create Customer
            </Typography>

            <form onSubmit={handleCreate}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <TextField
                    label="Name"
                    fullWidth
                    size="small"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
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
                      disabled={submitting || !form.name.trim()}
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

          {/* Customer list card */}
          <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Customer List</Typography>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Tenant Key</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Change Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.tenantKey}</TableCell>
                      <TableCell>{c.status}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                          <InputLabel id={`status-label-${c.id}`}>
                            Status
                          </InputLabel>
                          <Select
                            labelId={`status-label-${c.id}`}
                            label="Status"
                            value={c.status}
                            onChange={(e) =>
                              handleChangeStatus(
                                c.id,
                                e.target.value as CustomerStatus
                              )
                            }
                          >
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                            <MenuItem value="TERMINATED">TERMINATED</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(c)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 1 }}
                        >
                          No customers yet.
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

        {/* Edit Customer Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Customer</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  fullWidth
                  size="small"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <TextField
                  label="Tenant Key"
                  fullWidth
                  size="small"
                  value={editForm.tenantKey ?? ""}
                  disabled
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={editSubmitting || !editForm.name.trim()}
              >
                {editSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Layout>
  );
}
