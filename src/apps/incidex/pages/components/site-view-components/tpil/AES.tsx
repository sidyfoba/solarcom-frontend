import * as React from "react";
import Box from "@mui/material/Box";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
export default function AES() {
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
                            primary="Zonal Head : "
                          ></ListItemText>
                          <ListItemText primary="Moustapha LO"></ListItemText>
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
                            primary="Head of Operation : "
                          ></ListItemText>
                          <ListItemText primary="Assane Ndiaga NDIAYE"></ListItemText>
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
                            primary="NOC Operators : "
                          ></ListItemText>
                          <ListItemText primary="Kabe DIA"></ListItemText>
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
                            primary="Evènement exceptionnel : "
                          ></ListItemText>
                          <ListItemText primary="N/A"></ListItemText>
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
                            primary="OLD type d'énergie : "
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
                            primary="Commentaire type d'énergie : "
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
                            primary="Concessionnaire ou Fournisseur énergie : "
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
                            primary="Accessibilité du site : "
                          ></ListItemText>
                          <ListItemText primary="N/A"></ListItemText>
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
