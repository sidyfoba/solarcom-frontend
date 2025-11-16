import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";

interface EmployeeDetailsProps {
  onSnackbarOpen: (message: string, severity: "success" | "error") => void;
  id?: string;
  newID?: string;
}

interface EmployeeDetailsState {
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
  const [details, setDetails] = useState<EmployeeDetailsState>({
    jobTitle: "",
    department: "",
    employeeID: "",
    startDate: "",
    employmentStatus: "",
    workSchedule: "",
  });

  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [loadingTitles, setLoadingTitles] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/hr/employee/${id}`
        );
        setDetails({
          jobTitle: response.data.jobTitle || "",
          department: response.data.department || "",
          employeeID: response.data.employeeID || "",
          startDate: response.data.startDate || "",
          employmentStatus: response.data.employmentStatus || "",
          workSchedule: response.data.workSchedule || "",
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
        onSnackbarOpen("Failed to load employee data.", "error");
      }
    };

    const fetchJobTitles = async () => {
      try {
        setLoadingTitles(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/hr/job-positions`
        );
        setJobTitles(response.data || []);
      } catch (error) {
        console.error("Error fetching job titles:", error);
        onSnackbarOpen("Failed to load job titles.", "error");
      } finally {
        setLoadingTitles(false);
      }
    };

    fetchEmployee();
    fetchJobTitles();
  }, [id, onSnackbarOpen]);

  const handleDetailsChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const targetId = id ?? newID; // decide which ID to use

    if (!targetId) {
      onSnackbarOpen("No employee ID provided for details update.", "error");
      return;
    }

    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE
        }/api/hr/employee/personal-details/${targetId}`,
        details
      );
      onSnackbarOpen("Personal details submitted successfully!", "success");
    } catch (error: any) {
      console.error("There was an error submitting the form!", error);
      const msg =
        error?.response?.data || "Submission failed. Please try again.";
      onSnackbarOpen(msg, "error");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required size="small">
              <InputLabel id="job-title-label">
                {loadingTitles ? "Loading..." : "Job Title / Position"}
              </InputLabel>
              <Select
                labelId="job-title-label"
                label={loadingTitles ? "Loading..." : "Job Title / Position"}
                name="jobTitle"
                value={details.jobTitle}
                onChange={handleDetailsChange}
                disabled={loadingTitles || jobTitles.length === 0}
              >
                <MenuItem value="">
                  <em>Select job title</em>
                </MenuItem>
                {jobTitles.map((job) => (
                  <MenuItem key={job.title} value={job.title}>
                    {job.title}
                  </MenuItem>
                ))}
              </Select>
              {jobTitles.length === 0 && !loadingTitles && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  No job positions available. Please create some in Job
                  Positions.
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Department"
              name="department"
              value={details.department}
              onChange={handleDetailsChange}
              fullWidth
              required
              size="small"
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
              size="small"
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
              required
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required size="small">
              <InputLabel id="employment-status-label">
                Employment Status
              </InputLabel>
              <Select
                labelId="employment-status-label"
                label="Employment Status"
                name="employmentStatus"
                value={details.employmentStatus}
                onChange={handleDetailsChange}
              >
                <MenuItem value="">
                  <em>Select employment status</em>
                </MenuItem>
                <MenuItem value="full-time">Full-Time</MenuItem>
                <MenuItem value="part-time">Part-Time</MenuItem>
                <MenuItem value="temporary">Temporary</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="intern">Intern</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Work Schedule"
              name="workSchedule"
              value={details.workSchedule}
              onChange={handleDetailsChange}
              placeholder="e.g. Mon–Fri, 9:00–17:00"
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
            Save Details
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EmployeeDetails;
