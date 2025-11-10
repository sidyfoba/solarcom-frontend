import React, { useState, useEffect } from "react";
import Layout from "../../Layout";
import { Box, Button, Grid, TextField } from "@mui/material";
import axios from "axios";

interface EmployeeDetailsProps {
  onSnackbarOpen: (message: string, severity: "success" | "error") => void;
  id?: string;
  newID?: string;
}

interface EmployeeDetails {
  jobTitle: string;
  department: string;
  employeeID: string;
  startDate: string;
  employmentStatus: string;
  workSchedule: string;
}

interface JobTitle {
  title: string;
  description: string;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  onSnackbarOpen,
  id,
  newID,
}) => {
  const [details, setDetails] = useState<EmployeeDetails>({
    jobTitle: "",
    department: "",
    employeeID: "",
    startDate: "",
    employmentStatus: "",
    workSchedule: "",
  });

  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE}/api/hr/employee/${id}`
          );
          setDetails({
            jobTitle: response.data.jobTitle,
            department: response.data.department,
            employeeID: response.data.employeeID,
            startDate: response.data.startDate,
            employmentStatus: response.data.employmentStatus,
            workSchedule: response.data.workSchedule,
          });
        } catch (error) {
          console.error("Error fetching employee data:", error);
          onSnackbarOpen("Failed to load employee data.", "error");
        }
      }
    };

    const fetchJobTitles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/hr/job-positions`
        );
        setJobTitles(response.data); // Assuming response.data is an array of objects { title, description }
      } catch (error) {
        console.error("Error fetching job titles:", error);
        onSnackbarOpen("Failed to load job titles.", "error");
      }
    };

    fetchEmployee();
    fetchJobTitles();
  }, [id, onSnackbarOpen]);

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (id) {
        newID = id;
      }
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE
        }/api/hr/employee/personal-details/${newID}`,
        details
      );
      onSnackbarOpen("Personal details submitted successfully!", "success");
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
              label="Job Title/Position"
              name="jobTitle"
              select
              SelectProps={{ native: true }}
              value={details.jobTitle}
              onChange={handleDetailsChange}
              fullWidth
              required
            >
              <option value="" disabled>
                Select job title
              </option>
              {jobTitles.map((job) => (
                <option key={job.title} value={job.title}>
                  {job.title}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Department"
              name="department"
              value={details.department}
              onChange={handleDetailsChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Employee ID"
              name="employeeID"
              value={details.employeeID}
              onChange={handleDetailsChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Employment Start Date"
              name="startDate"
              type="date"
              value={details.startDate}
              onChange={handleDetailsChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Employment Status"
              name="employmentStatus"
              select
              SelectProps={{ native: true }}
              value={details.employmentStatus}
              onChange={handleDetailsChange}
              fullWidth
              required
            >
              <option value="" disabled>
                Select employment status
              </option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="temporary">Temporary</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Work Schedule"
              name="workSchedule"
              value={details.workSchedule}
              onChange={handleDetailsChange}
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

export default EmployeeDetails;
