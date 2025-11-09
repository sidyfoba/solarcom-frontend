import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Hidden,
  Link,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

import Footer from "./Footer";
import MainListItems from "./listItems";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useLayoutContext } from "./LayoutProvider";

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

// const defaultTheme = createTheme();

// Interface for props passed to the Layout component
interface LayoutProps {
  children: React.ReactNode; // Represents any valid React child element
  // roles: string[];
  // drawerMenuSecondaryList?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // console.log("roles in Layout");
  // console.log(roles);

  // const [openSite, setOpenSite] = React.useState(false);
  // const [openElement, setOpenElement] = React.useState(false);
  // const { openSite, setOpenSite, openElement, setOpenElement } =
  //   useLayoutContext();

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // const navigate = useNavigate();
  // const handleDisconnect = () => {
  //   sessionStorage.removeItem("jwt"); // Remove JWT token from localStorage
  //   Perform any additional logout actions if needed
  //   navigate("/login"); // Redirect to login page or another appropriate route
  // };
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
          <Hidden xsDown>
            {/* Visible on screens larger than xs (sm, md, lg, xl) */}
            {/* <img
              src={senegalFlagUrl}
              alt="Senegal Flag"
              style={{ height: 30, marginRight: 10 }}
            /> */}
          </Hidden>
          <LanguageSwitcher />
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

        <MainListItems />
        {/* <Divider sx={{ my: 1 }} /> */}
        {/* <ListItemButton onClick={handleDisconnect}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Déconnecter" />
          </ListItemButton> */}
        {/* {drawerMenuSecondaryList} */}
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
            {children}
          </Grid>

          {/* <Footer /> */}
        </Container>
      </Box>
    </Box>
  );
};
export default Layout;
