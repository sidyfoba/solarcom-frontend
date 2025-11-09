// src/components/TabsContainer.js
import { Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "./Layout";
import SiteCreateTemplateFromExcel from "./SiteCreateTemplateFromExcel";
import SiteCreateTemplateFromScratch from "./SiteCreateTemplateFromScratch";
import SiteTemplateFromExcelView from "./SiteTemplateFromExcelView";

// Define the components you want to switch between
const C1: React.FC<{ onNavigateToC2: () => void }> = ({ onNavigateToC2 }) => (
  <Box>
    <Typography variant="h6">Component C1</Typography>
    <Button variant="contained" onClick={onNavigateToC2}>
      Go to C2
    </Button>
  </Box>
);

const C2: React.FC<{ onNavigateToC1: () => void }> = ({ onNavigateToC1 }) => (
  <Box>
    <Typography variant="h6">Component C2</Typography>
    <Button variant="contained" onClick={onNavigateToC1}>
      Go to C1
    </Button>
  </Box>
);

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ padding: 3 }}>{children}</Box>}
    </div>
  );
};

const TemplateCreation = () => {
  const [value, setValue] = useState(0);
  const [view, setView] = useState<"C1" | "C2">("C1");
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setView("C1");
  };
  // navigate("/admin/projects/site/template/site/create-site-template/excel", {
  //   state: { headers: selectedHeaders },
  // });
  const onNavigateToCreateTemplate = () => setView("C2");

  const onNavigateToSiteTemplateExcelView = () => setView("C1");

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="Create From scratch"
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab
                label="Create From excel"
                id="tab-1"
                aria-controls="tabpanel-1"
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <SiteCreateTemplateFromScratch />
          </TabPanel>
          <TabPanel value={value} index={1}>
            {view === "C1" ? (
              <SiteTemplateFromExcelView
                onNavigateToCreateTemplate={onNavigateToCreateTemplate}
                setExcelHeaders={setExcelHeaders}
              />
            ) : (
              <SiteCreateTemplateFromExcel
                onNavigateToSiteTemplateExcelView={
                  onNavigateToSiteTemplateExcelView
                }
                excelHeaders={excelHeaders}
              />
            )}
          </TabPanel>
        </Paper>
      </Box>
    </Layout>
  );
};

export default TemplateCreation;
