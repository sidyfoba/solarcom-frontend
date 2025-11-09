import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import * as React from "react";

import { styled, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  centralOneitems,
  mainListItems,
  secondaryListItems,
} from "../apps/components/listItems";

import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import ConstructionIcon from "@mui/icons-material/Construction";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Icon from "@mui/material/Icon";
import {
  AccountTree,
  Construction,
  DevicesRounded,
  ViewQuiltRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Layout from "../apps/Layout";

function CentralOne() {
  const navigate = useNavigate();

  const goToIncidexApp = () => {
    navigate("/incidex-app-site-view");
  };
  const goToAnadexApp = () => {
    navigate("/anadex-app");
  };
  const goToPbrApp = () => {
    navigate("/pbr-app");
  };
  const goToItMobileApp = () => {
    navigate("/it-mobile-app");
  };

  return (
    <>
      <Layout>
        {/* centralOne avec l'ensemble des applications */}
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid
            item
            xs={4}
            sx={{
              m: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Card onClick={goToIncidexApp}>
              <CardActionArea>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Construction sx={{ fontSize: 100 }} />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      gutterBottom
                      variant="h3"
                      component="div"
                      align="justify"
                    >
                      IncideX
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Gestion des incidents
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              m: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Card onClick={goToPbrApp}>
              <CardActionArea>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <AccountTree sx={{ fontSize: 100 }} />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      gutterBottom
                      variant="h3"
                      component="div"
                      align="justify"
                    >
                      P.B.R
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Pilotage Basique Réseau
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              m: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Card onClick={goToAnadexApp}>
              <CardActionArea>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <AllInclusiveIcon sx={{ fontSize: 100 }} />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      gutterBottom
                      variant="h3"
                      component="div"
                      align="justify"
                    >
                      AnadeX
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Analyse Réseau
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid
            item
            xs={4}
            sx={{
              m: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Card onClick={goToItMobileApp}>
              <CardActionArea>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <DirectionsCarIcon sx={{ fontSize: 100 }} />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      gutterBottom
                      variant="h3"
                      component="div"
                      align="justify"
                    >
                      IT Mobile
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Gestion des flottes
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}
export default CentralOne;
