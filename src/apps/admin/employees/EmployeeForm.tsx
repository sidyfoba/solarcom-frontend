import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Stack,
} from "@mui/material";
import Layout from "../Layout";
import PersonalInfo from "./EmployeeComponents/PersonalInfo";
import EmployeeDetails from "./EmployeeComponents/EmployeeDetails";

const steps = ["Employee Infos", "Employee Details"];

const EmployeeForm: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  const [isPersonalInfoSubmitted, setIsPersonalInfoSubmitted] =
    React.useState(false);
  const [newID, setNewID] = React.useState("");

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

  const handleNext = () => {
    if (activeStep === 0 && isPersonalInfoSubmitted) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsPersonalInfoSubmitted(false);
    setNewID("");
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
            {/* Page header */}
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Employee Onboarding
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Complete the employee’s personal information and employment
                details step by step.
              </Typography>
            </Box>

            {/* Main card */}
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
                  label="Step-by-step Form"
                  color="primary"
                  variant="outlined"
                />
              </Divider>

              <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed – you are finished.
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 1, mb: 2 }}
                    color="text.secondary"
                  >
                    Step {activeStep + 1}: {steps[activeStep]}
                  </Typography>

                  {/* Step content */}
                  <Box sx={{ mb: 3 }}>
                    {activeStep === 0 && (
                      <PersonalInfo
                        onSnackbarOpen={handleSnackbarOpen}
                        onSubmitSuccess={() => setIsPersonalInfoSubmitted(true)}
                        setNewID={setNewID}
                      />
                    )}
                    {activeStep === 1 && (
                      <EmployeeDetails
                        onSnackbarOpen={handleSnackbarOpen}
                        newID={newID}
                      />
                    )}
                  </Box>

                  {/* Navigation buttons */}
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button
                      onClick={handleNext}
                      disabled={activeStep === 0 && !isPersonalInfoSubmitted}
                      variant="contained"
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </Box>
                </React.Fragment>
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
      </Box>
    </Layout>
  );
};

export default EmployeeForm;
