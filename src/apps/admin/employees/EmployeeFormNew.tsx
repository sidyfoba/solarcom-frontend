import * as React from "react";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import JusticeForm from "./JusticeForm";
// import MedicalForm from "./MedicalForm";
// import ProfessionForm from "./ProfessionForm";
// import SwipeableView from "react-swipeable-views-react-18-fix";
// import EducationsForm from "../backup/EducationsForm";
// import InformationGeneralesForm from "./InformationGeneralesForm";
import { Alert, Paper, Snackbar } from "@mui/material";
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
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function EmployeeFormNew() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //   const handleChangeIndex = (index: number) => {
  //     setValue(index);
  //   };

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
      <Box width="100%">
        <Paper sx={{ p: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Dossiers"
          >
            <Tab label="Employee Infos" {...a11yProps(0)} />
            <Tab label="Employee Details" {...a11yProps(1)} />
            <Tab label="Santé" {...a11yProps(2)} />
            <Tab label="Vie sociale et professionelle" {...a11yProps(3)} />
          </Tabs>
          {/* <SwipeableView
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      > */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <PersonalInfo onSnackbarOpen={handleSnackbarOpen} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <EmployeeDetails onSnackbarOpen={handleSnackbarOpen} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <PersonalInfo onSnackbarOpen={handleSnackbarOpen} />
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <PersonalInfo onSnackbarOpen={handleSnackbarOpen} />
          </TabPanel>
          {/* </SwipeableView> */}
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
        </Paper>
      </Box>
    </Layout>
  );
}
