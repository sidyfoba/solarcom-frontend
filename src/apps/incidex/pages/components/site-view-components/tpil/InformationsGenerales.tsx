import * as React from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Box, ThemeProvider } from "@mui/material";
import TextField from "@mui/material/TextField";
export default function InformationsGenerales() {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{}}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Legacy ID : "
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          ></ListItemText>
                          <ListItemText primary="DL2908"></ListItemText>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Site Number :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="SNDB0008" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Internal SLA Class :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="SILVER" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Categorie SLC :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="Categorie SLC" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Priority :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="P2" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Site type :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="RAN" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Dependencies count :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="1" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Presence OSN ? :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="Non" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Dependencies ? :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="DL2908" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Energy :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="SENELEC+GE" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Grid Status :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="Grid" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Generator :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="Yes" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="State / Region (Province) :"
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          />
                          <ListItemText primary="Diourbel" />
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
                            primary="City  :"
                          />
                          <ListItemText primary="Mbacke" />
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
                            primary="Centre d'intervention :"
                          />
                          <ListItemText primary="TOUBA1" />
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
                            primary="Configuration :"
                          />
                          <ListItemText primary="Indoor" />
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
                            primary="Typologie :"
                          />
                          <ListItemText primary="Rooftop" />
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
                            primary="ERT :"
                          />
                          <ListItemText primary="02:25:00.000" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </nav>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* 2 COLONNE */}
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
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                            primary="Date demande d'intégration :"
                          />
                          <ListItemText primary="N/A" />
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
                            primary="Année intégration :"
                          />
                          <ListItemText primary="2020" />
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
                            primary="Status from Free :"
                          />
                          <ListItemText primary="On Air" />
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
                            primary="Maintenance Partner :"
                          />
                          <ListItemText primary="SOLARCOM" />
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
                            primary="Nombre d'écarts intégration :"
                          />
                          <ListItemText primary="N/A" />
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
                            primary="Status Handover with Free :"
                          />
                          <ListItemText primary="Done" />
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
                            primary="Axe :"
                          />
                          <ListItemText primary="AXE_TOUBA_SORA" />
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
                            primary="Périodicité MP :"
                          />
                          <ListItemText primary="MENSUEL" />
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
                            primary="Field Engineer - MP :"
                          />
                          <ListItemText primary="Papa Ibrahima DIONE" />
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
                            primary="Field Engineer - MC :"
                          />
                          <ListItemText primary="Papa Ibrahima DIONE" />
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
                            primary="Field Engineer - Fuel Service :"
                          />
                          <ListItemText primary="Balla Moussa BALDE" />
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
                            primary="Field Supervisor :"
                          />
                          <ListItemText primary="Balla Moussa BALDE" />
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
                            primary="Zonal Head :"
                          />
                          <ListItemText primary="Moustapha LO" />
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
                            primary="Head of Operation :"
                          />
                          <ListItemText primary="Head of Operation" />
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
                            primary="Nombre de jeu de batterie installé :"
                          />
                          <ListItemText primary="1" />
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
                            primary="Capacité batterie :"
                          />
                          <ListItemText primary="100" />
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
                            primary="Type de pylône :"
                          />
                          <ListItemText primary="N/A" />
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
                            primary="Hauteur pylône :"
                          />
                          <ListItemText primary="9" />
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
                            primary="Année pylône :"
                          />
                          <ListItemText primary="N/A" />
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
                            primary="Nombre de GE  :"
                          />
                          <ListItemText primary="1" />
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
                            primary="Nombre de CUVE   :"
                          />
                          <ListItemText primary="1" />
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
                            primary="Capacité CUVE :"
                          />
                          <ListItemText primary="N/A" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </nav>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* 3 COLONNE */}
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
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            sx={{
                              color: "success.dark",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                            primary="Puissance solaire installée :"
                          />
                          <ListItemText primary="N/A" />
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
