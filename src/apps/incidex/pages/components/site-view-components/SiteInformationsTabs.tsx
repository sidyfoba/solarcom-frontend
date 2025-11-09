import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Diffusion from "../Diffusion";
import Outages from "../Outages";
import { Alarm } from "@mui/icons-material";
import Alarms from "../Alarms";
import Ecarts from "../Ecarts";
import Activites from "../Activites";
import TPIL from "../../TPIL";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SiteInformationsTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Diffusion" {...a11yProps(0)} />
          <Tab label="Outages" {...a11yProps(1)} />
          <Tab label="Alarms" {...a11yProps(2)} />
          <Tab label="Ecarts" {...a11yProps(3)} />
          <Tab label="Activités" {...a11yProps(4)} />
          <Tab label="TPIL" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Diffusion />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Outages />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Alarms />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Ecarts />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Activites />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <TPIL />
      </CustomTabPanel>
    </Box>
  );
}
