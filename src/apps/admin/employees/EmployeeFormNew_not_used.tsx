import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Chip,
  Container,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Layout from "../Layout";
import PersonalInfo from "./EmployeeComponents/PersonalInfo";
import EmployeeDetails from "./EmployeeComponents/EmployeeDetails";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `employee-tab-${index}`,
    "aria-controls": `employee-tabpanel-${index}`,
  };
}

const EmployeeFormNew: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbarOpen = (
    message: string,
    severity: "success" | "error"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

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
                Employee Record
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Capture general information, employment details, health, and
                social/professional life of the employee.
              </Typography>
            </Box>

            {/* Main card with tabs */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Divider textAlign="left" sx={{ mb: 3 }}>
                <Chip
                  label="Employee Profile"
                  color="primary"
                  variant="outlined"
                />
              </Divider>

              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Employee sections"
              >
                <Tab label="Employee Infos" {...a11yProps(0)} />
                <Tab label="Employee Details" {...a11yProps(1)} />
                <Tab label="Santé" {...a11yProps(2)} />
                <Tab label="Vie sociale et professionnelle" {...a11yProps(3)} />
              </Tabs>

              <Box sx={{ mt: 1 }}>
                <TabPanel value={value} index={0} dir={theme.direction}>
                  <PersonalInfo onSnackbarOpen={handleSnackbarOpen} />
                </TabPanel>

                <TabPanel value={value} index={1} dir={theme.direction}>
                  <EmployeeDetails onSnackbarOpen={handleSnackbarOpen} />
                </TabPanel>

                <TabPanel value={value} index={2} dir={theme.direction}>
                  {/* Replace with your future Health/Santé form */}
                  <PersonalInfo onSnackbarOpen={handleSnackbarOpen} />
                </TabPanel>

                <TabPanel value={value} index={3} dir={theme.direction}>
                  {/* Replace with your future Social/Professional life form */}
                  <PersonalInfo onSnackbarOpen={handleSnackbarOpen} />
                </TabPanel>
              </Box>
            </Paper>
          </Stack>

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

export default EmployeeFormNew;
