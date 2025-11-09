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
} from "./components/listItems";
import Chart from "./components/Chart";
import Deposits from "./components/Deposits";
import Orders from "./components/Orders";
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
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

function CentralOne() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();

  const goToIncidexApp = () => {
    navigate("/incidex-app");
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Solarcom
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
          {secondaryListItems}
          <Divider sx={{ my: 1 }} />
          {centralOneitems}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        {/* main container dans laquelle il faut inclure les elements dans le dashboard */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
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
          </Grid>

          <Footer />
        </Container>
      </Box>
    </Box>
  );
}
export default CentralOne;
