import * as React from "react";
import Box from "@mui/material/Box";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
export default function Batteries() {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{}}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="center"
          alignItems="center"
        >
          {/* 1 COLONNE */}
          <Grid item xs={4}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                borderRadius: 1,
                border: "0.05px solid grey",
                padding: 2,
              }}
            >
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                direction="column"
              >
                <Grid item xs={4}>
                  <nav aria-label="secondary mailbox folders">
                    <List>
                      {" "}
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                            primary="Nombre de redresseur installé : "
                          ></ListItemText>
                          <ListItemText primary="1"></ListItemText>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                            primary="Type de redresseur : "
                          ></ListItemText>
                          <ListItemText primary="Ericsson"></ListItemText>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                            primary="Date de MES : "
                          ></ListItemText>
                          <ListItemText primary="N/A"></ListItemText>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                            primary="Puissance : "
                          ></ListItemText>
                          <ListItemText primary="RBS 6201 & 7.2Kw"></ListItemText>
                        </ListItemButton>
                      </ListItem>{" "}
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                            primary="Contrôleur : "
                          ></ListItemText>
                          <ListItemText primary="Ericsson"></ListItemText>
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </nav>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
