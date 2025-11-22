import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";

interface PersonalInfoProps {
  onSnackbarOpen: (message: string, severity: "success" | "error") => void;
  id?: string; // Optional ID for the employee
  onSubmitSuccess?: () => void; // Callback for successful submission
  setNewID?: React.Dispatch<React.SetStateAction<string>>;
}

interface EmployeePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  emergencyContacts: string;
  socialSecurityNumber: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  onSnackbarOpen,
  id,
  onSubmitSuccess,
  setNewID,
}) => {
  const [personalInfo, setPersonalInfo] = useState<EmployeePersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    emergencyContacts: "",
    socialSecurityNumber: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/hr/employee/${id}`
        );

        setPersonalInfo({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          dob: response.data.dob || "",
          emergencyContacts: response.data.emergencyContacts || "",
          socialSecurityNumber: response.data.socialSecurityNumber || "",
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
        onSnackbarOpen("Failed to load employee data.", "error");
      }
    };

    fetchEmployee();
  }, [id, onSnackbarOpen]);

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = id
        ? await axios.put(
            `${import.meta.env.VITE_API_URL}/api/hr/employee/${id}`,
            personalInfo
          )
        : await axios.post(
            `${import.meta.env.VITE_API_URL}/api/hr/employee/personal-info`,
            personalInfo
          );

      onSnackbarOpen("Personal information submitted successfully!", "success");

      // Notify parent component of successful submission (used by Stepper)
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // For a create, clear form and expose new ID upward
      if (!id) {
        setPersonalInfo({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          dob: "",
          emergencyContacts: "",
          socialSecurityNumber: "",
        });

        const newEmployeeId = (response as any)?.data?.employee?.id;
        if (newEmployeeId && setNewID) {
          setNewID(newEmployeeId);
          console.log("New employee ID:", newEmployeeId);
        }
      }
    } catch (error: any) {
      console.error("There was an error submitting the form!", error);
      const msg = error?.response?.data || "Submission failed";
      onSnackbarOpen(msg, "error");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Optional small heading inside the step */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
        Personal information
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Full Name"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              label="Address"
              name="address"
              value={personalInfo.address}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={personalInfo.dob}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              label="Emergency Contacts"
              name="emergencyContacts"
              multiline
              rows={3}
              value={personalInfo.emergencyContacts}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
              size="small"
              placeholder="Name, relationship, phone…"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Social Security Number"
              name="socialSecurityNumber"
              value={personalInfo.socialSecurityNumber}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
              size="small"
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" color="primary" type="submit">
            Save & Continue
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PersonalInfo;
