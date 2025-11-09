import { Box, Button, Grid } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

export default function AlarmsLinkButtons() {
  return (
    <>
      <Grid item xs={6}>
        <Box display="flex" justifyContent="flex-end">
          <Grid
            container
            spacing={0.5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="flex-end"
          >
            <Grid item xs={4}>
              <Box display="flex" justifyContent="flex-start">
                <Button
                  startIcon={<NotificationImportantIcon />}
                  variant="outlined"
                  color="error"
                  component={Link}
                  to="/incidex-app-new-alarms"
                >
                  New Alarms
                </Button>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Button
                startIcon={<NotificationImportantIcon />}
                variant="outlined"
                component={Link}
                to="/incidex-app-alarms"
              >
                Alarms
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                startIcon={<NotificationsNoneIcon />}
                variant="outlined"
                color="success"
                component={Link}
                to="/incidex-app-cleared-alarms"
              >
                Cleared Alarms
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
