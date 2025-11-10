import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { Box, Button, Grid, TextField } from "@mui/material";
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
      if (id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE}/api/hr/employee/${id}`
          );
          setPersonalInfo(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
          onSnackbarOpen("Failed to load employee data.", "error");
        }
      }
    };

    fetchEmployee();
  }, [id, onSnackbarOpen]);

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = id
        ? await axios.put(
            `${import.meta.env.VITE_API_BASE}/api/hr/employee/${id}`,
            personalInfo
          )
        : await axios.post(
            `${import.meta.env.VITE_API_BASE}/api/hr/employee/personal-info`,
            personalInfo
          );

      onSnackbarOpen("Personal information submitted successfully!", "success");
      console.log(response);

      // Notify parent component of successful submission
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // Clear the form fields if needed
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
        setNewID(response.data.employee.id);
        console.log(response.data.employee.id);
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      onSnackbarOpen(error.response?.data || "Submission failed", "error");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Full Name"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
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
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Emergency Contacts"
              name="emergencyContacts"
              multiline
              rows={4}
              value={personalInfo.emergencyContacts}
              onChange={handlePersonalInfoChange}
              fullWidth
              required
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
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "16px" }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </Box>
  );
};

export default PersonalInfo;
