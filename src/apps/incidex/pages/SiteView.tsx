import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Diffusion from "./components/Diffusion";
import SiteInformationsTabs from "./components/site-view-components/SiteInformationsTabs";
import {
  mainListItemsIncidex,
  secondaryListItemsIncidex,
} from "./components/DrawerMenuIncidex";
import Layout from "../../Layout";

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

// nous permet de rechercher des sites et de creer et diffuser des incients

function SiteView() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [recherche, setRecherche] = React.useState("");

  const handleChangeRecheche = (event: SelectChangeEvent) => {
    setRecherche(event.target.value as string);
  };

  const [rechercheSite, setRechercheSite] = React.useState("");

  const handleChangeRechecheSite = (event: SelectChangeEvent) => {
    setRechercheSite(event.target.value as string);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout
      drawerMenuList={mainListItemsIncidex}
      drawerMenuSecondaryList={secondaryListItemsIncidex}
    >
      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* recherche */}
          <Grid item xs={12}>
            {/* <Item>Rechercher par :</Item> */}
            <Item>
              {" "}
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={3}>
                  Rechercher par :
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="recherche-label">Recherche par</InputLabel>
                    <Select
                      labelId="recherche-label"
                      id="recherche-select"
                      value={recherche}
                      label="Site"
                      onChange={handleChangeRecheche}
                    >
                      <MenuItem value={10}>SN</MenuItem>
                      <MenuItem value={20}>ID</MenuItem>
                      <MenuItem value={30}>SITE NAME</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="site-label">Site</InputLabel>
                    <Select
                      labelId="site-label"
                      id="site-select"
                      value={rechercheSite}
                      label="Site"
                      onChange={handleChangeRechecheSite}
                    >
                      <MenuItem value={10}>SN</MenuItem>
                      <MenuItem value={20}>TMB09</MenuItem>
                      <MenuItem value={30}>FTK66</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" sx={{ verticalAlign: "center" }}>
                    Charger site
                  </Button>
                </Grid>
              </Grid>
            </Item>
          </Grid>

          <Grid item xs={12}>
            <Item>
              <SiteInformationsTabs />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default SiteView;
