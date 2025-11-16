import * as React from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Container,
  Grid,
  Divider,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import Footer from "./Footer";
import MainListItems from "./listItems";
// import LanguageSwitcher from "../../components/LanguageSwitcher";
import i18n from "../../i18n";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(90deg, #004aad 0%, #0066ff 50%, #ffcc00 100%)",
  color: "#ffffff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.18)",
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
    borderRight: "1px solid rgba(0,0,0,0.08)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();

  // Persist drawer state in localStorage
  const [open, setOpen] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("adminDrawerOpen");
    return stored === null ? true : stored === "true";
  });

  const toggleDrawer = () => {
    setOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("adminDrawerOpen", String(next));
      }
      return next;
    });
  };

  // Language dropdown state
  const [language, setLanguage] = React.useState<string>(i18n.language || "en");

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setLanguage(value);
    i18n.changeLanguage(value);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: "24px" }}>
          {/* Burger icon when drawer is closed */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "24px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand / Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: "#ffcc00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#004aad",
                fontWeight: 800,
                fontSize: 18,
                boxShadow: "0 0 0 2px rgba(255,255,255,0.6)",
              }}
            >
              S
            </Box>
            <Box>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ fontWeight: 700, letterSpacing: 0.5 }}
              >
                Solarcom Admin
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.9, fontSize: 12, lineHeight: 1.2 }}
              >
                Project • HR • Tickets • Tasks
              </Typography>
            </Box>
          </Box>

          {/* Language dropdown */}
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              ml: 2,
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
                "&:hover fieldset": {
                  borderColor: "#ffeb3b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffeb3b",
                },
              },
              "& .MuiSvgIcon-root": {
                color: "#fff",
              },
            }}
          >
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ "aria-label": "Select language" }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              {/* Add more languages if needed */}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            px: 1,
          }}
        >
          {open && (
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
            >
              Navigation
            </Typography>
          )}
          <IconButton onClick={toggleDrawer} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <MainListItems isDrawerOpen={open} />
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Push content below AppBar */}
        <Toolbar />

        {/* Page content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            {children}
          </Grid>
        </Container>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
