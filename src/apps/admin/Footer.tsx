import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  IconButton,
} from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()}{" "}
      <Link href="#" underline="hover">
        Les patriotes du Sénégal
      </Link>
      . All rights reserved.
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        mt: 6,
        borderTop: "1px solid",
        borderColor: "divider",
        py: { xs: 4, sm: 6 },
        backgroundColor: "background.paper",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "center", sm: "center" },
          textAlign: { xs: "center", sm: "left" },
          gap: 2,
        }}
      >
        {/* Left: Copyright */}
        <Copyright />

        {/* Right: Social icons */}
        <Stack direction="row" spacing={1}>
          <IconButton
            color="inherit"
            aria-label="GitHub"
            href="https://github.com"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="LinkedIn"
            href="https://linkedin.com"
            target="_blank"
          >
            <LinkedInIcon />
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="X"
            href="https://twitter.com"
            target="_blank"
          >
            <XIcon />
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
}
