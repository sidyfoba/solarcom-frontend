// src/pages/LoginPage.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/LayoutContext";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username, password });
      navigate("/customers");
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Invalid username or password";
      setError(msg);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Brand background (blue + yellow accent)
        background: "linear-gradient(135deg, #004aad 0%, #facc15 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Logo / Brand */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: "#004aad", letterSpacing: 0.5 }}
            >
              Solarcom IAM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your workspace
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              size="small"
              fullWidth
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              size="small"
              fullWidth
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#004aad",
                "&:hover": { backgroundColor: "#003380" },
              }}
              disabled={loading || !username || !password}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          {/* Optional small footer text */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: "block" }}
          >
            Use your Solarcom IAM credentials to sign in.
          </Typography>
        </Paper>

        {/* Snackbar for errors */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
