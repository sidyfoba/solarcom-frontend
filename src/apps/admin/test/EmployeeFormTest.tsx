import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import Layout from "../Layout";
import axios from "axios";

interface EmployeePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  emergencyContacts: string;
  socialSecurityNumber: string;
}

interface EmployeeDetails {
  jobTitle: string;
  department: string;
  employeeID: string;
  startDate: string;
  employmentStatus: string;
  workSchedule: string;
}

interface CompensationBenefits {
  salary: number | string;
  paymentSchedule: string;
  benefits: string;
  bonuses: string;
  leaveEntitlements: string;
}

interface PerformanceDevelopment {
  performanceReviews: string;
  performanceGoals: string;
  trainingPrograms: string;
  promotionsHistory: string;
}

interface SkillsQualifications {
  educationHistory: string;
  skills: string;
  languages: string;
  professionalDevelopment: string;
}

interface JobHistory {
  previousEmployment: string;
  reasonForLeaving: string;
}

const EmployeeFormTest: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<EmployeePersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    emergencyContacts: "",
    socialSecurityNumber: "",
  });

  const [details, setDetails] = useState<EmployeeDetails>({
    jobTitle: "",
    department: "",
    employeeID: "",
    startDate: "",
    employmentStatus: "",
    workSchedule: "",
  });

  const [compensation, setCompensation] = useState<CompensationBenefits>({
    salary: "",
    paymentSchedule: "",
    benefits: "",
    bonuses: "",
    leaveEntitlements: "",
  });

  const [performance, setPerformance] = useState<PerformanceDevelopment>({
    performanceReviews: "",
    performanceGoals: "",
    trainingPrograms: "",
    promotionsHistory: "",
  });

  const [skills, setSkills] = useState<SkillsQualifications>({
    educationHistory: "",
    skills: "",
    languages: "",
    professionalDevelopment: "",
  });

  const [jobHistory, setJobHistory] = useState<JobHistory>({
    previousEmployment: "",
    reasonForLeaving: "",
  });

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleCompensationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompensation({ ...compensation, [name]: value });
  };

  const handlePerformanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPerformance({ ...performance, [name]: value });
  };

  const handleSkillsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSkills({ ...skills, [name]: value });
  };

  const handleJobHistoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobHistory({ ...jobHistory, [name]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    formType: string
  ) => {
    e.preventDefault();
    try {
      switch (formType) {
        case "personalInfo":
          console.log("Personal Information:", personalInfo);
          const response = await axios.post(
            "http://localhost:8080/api/hr/employee/personal-info",
            personalInfo
          );
          console.log("Response:", response.data);
          break;
        case "details":
          console.log("Employee Details:", details);
          break;
        case "compensation":
          console.log("Compensation & Benefits:", compensation);
          break;
        case "performance":
          console.log("Performance & Development:", performance);
          break;
        case "skills":
          console.log("Skills & Qualifications:", skills);
          break;
        case "jobHistory":
          console.log("Job History:", jobHistory);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h1" gutterBottom>
            Create Employee
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="employee form tabs"
          >
            <Tab label="Personal Information" />
            <Tab label="Employee Details" />
            <Tab label="Compensation & Benefits" />
            <Tab label="Performance and Development" />
            <Tab label="Skills and Qualifications" />
            <Tab label="Job History" />
          </Tabs>
          <form
            onSubmit={(e) =>
              handleSubmit(
                e,
                tabValue === 0
                  ? "personalInfo"
                  : tabValue === 1
                  ? "details"
                  : tabValue === 2
                  ? "compensation"
                  : tabValue === 3
                  ? "performance"
                  : tabValue === 4
                  ? "skills"
                  : "jobHistory"
              )
            }
          >
            {/* Personal Information Tab */}
            <Box hidden={tabValue !== 0}>
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
            </Box>
            {/* Employee Details Tab */}

            <Box hidden={tabValue !== 1}>
              <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Job Title/Position"
                    name="jobTitle"
                    value={details.jobTitle}
                    onChange={handleDetailsChange}
                    fullWidth
                    required
                  />
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
            </Box>
            {/* Compensation & Benefits Tab */}
            <Box hidden={tabValue !== 2}>
              <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Salary"
                    name="salary"
                    type="number"
                    value={compensation.salary}
                    onChange={handleCompensationChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Payment Schedule"
                    name="paymentSchedule"
                    select
                    SelectProps={{ native: true }}
                    value={compensation.paymentSchedule}
                    onChange={handleCompensationChange}
                    fullWidth
                    required
                  >
                    <option value="" disabled>
                      Select payment schedule
                    </option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Benefits Enrollment"
                    name="benefits"
                    value={compensation.benefits}
                    onChange={handleCompensationChange}
                    fullWidth
                    helperText="e.g., health insurance, retirement plans"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Bonuses and Incentives"
                    name="bonuses"
                    value={compensation.bonuses}
                    onChange={handleCompensationChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Leave Entitlements"
                    name="leaveEntitlements"
                    value={compensation.leaveEntitlements}
                    onChange={handleCompensationChange}
                    fullWidth
                    helperText="e.g., vacation, sick leave, parental leave"
                  />
                </Grid>
              </Grid>
            </Box>
            {/* Performance and Development Tab */}
            <Box hidden={tabValue !== 3}>
              <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Performance Reviews"
                    name="performanceReviews"
                    multiline
                    rows={4}
                    value={performance.performanceReviews}
                    onChange={handlePerformanceChange}
                    fullWidth
                    helperText="e.g., dates and feedback"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Goals and Objectives"
                    name="performanceGoals"
                    multiline
                    rows={4}
                    value={performance.performanceGoals}
                    onChange={handlePerformanceChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Training and Development Programs"
                    name="trainingPrograms"
                    multiline
                    rows={4}
                    value={performance.trainingPrograms}
                    onChange={handlePerformanceChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Promotions and Raises History"
                    name="promotionsHistory"
                    multiline
                    rows={4}
                    value={performance.promotionsHistory}
                    onChange={handlePerformanceChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            {/* Skills and Qualifications Tab */}
            <Box hidden={tabValue !== 4}>
              <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Education History"
                    name="educationHistory"
                    multiline
                    rows={4}
                    value={skills.educationHistory}
                    onChange={handleSkillsChange}
                    fullWidth
                    helperText="Degrees and certifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Skills and Competencies"
                    name="skills"
                    multiline
                    rows={4}
                    value={skills.skills}
                    onChange={handleSkillsChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Languages Spoken"
                    name="languages"
                    multiline
                    rows={2}
                    value={skills.languages}
                    onChange={handleSkillsChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Professional Development Courses Completed"
                    name="professionalDevelopment"
                    multiline
                    rows={4}
                    value={skills.professionalDevelopment}
                    onChange={handleSkillsChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            {/* Job History Tab */}
            <Box hidden={tabValue !== 5}>
              <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Previous Employment"
                    name="previousEmployment"
                    multiline
                    rows={4}
                    value={jobHistory.previousEmployment}
                    onChange={handleJobHistoryChange}
                    fullWidth
                    helperText="e.g., positions, companies, dates"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Reason for Leaving Previous Jobs"
                    name="reasonForLeaving"
                    multiline
                    rows={4}
                    value={jobHistory.reasonForLeaving}
                    onChange={handleJobHistoryChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: "16px" }}
              >
                Submit{" "}
                {tabValue === 0
                  ? "Personal Info"
                  : tabValue === 1
                  ? "Details"
                  : tabValue === 2
                  ? "Compensation"
                  : tabValue === 3
                  ? "Performance"
                  : tabValue === 4
                  ? "Skills"
                  : "Job History"}
              </Button>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
};

export default EmployeeFormTest;
