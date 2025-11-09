import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import InformationsGenerales from "./InformationsGenerales";
import AES from "./AES";
import Batteries from "./Batteries";
import Solaire from "./Solaire";
import GE from "./GE";
import Climatisation from "./Climatisation";
import Pylone from "./Pylone";
import Gardien from "./Gardien";
import MP from "./Mp";
import Extincteur from "./Extincteur";

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

export default function TpilTabs() {
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
          <Tab label="Informations générales" {...a11yProps(0)} />
          <Tab label="AES" {...a11yProps(1)} />
          <Tab label="Batteries" {...a11yProps(2)} />
          <Tab label="Solaire" {...a11yProps(3)} />
          <Tab label="GE" {...a11yProps(4)} />
          <Tab label="Climatisation" {...a11yProps(5)} />
          <Tab label="Pylone" {...a11yProps(6)} />
          <Tab label="Gardien" {...a11yProps(7)} />
          <Tab label="MP" {...a11yProps(8)} />
          <Tab label="Extincteur" {...a11yProps(9)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <InformationsGenerales />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AES />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Batteries />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Solaire />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <GE />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <Climatisation />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <Pylone />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <Gardien />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={8}>
        <MP />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={9}>
        <Extincteur />
      </CustomTabPanel>
    </Box>
  );
}
