import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

const ReusablePopover = ({ open, anchorEl, onClose, content }) => {
  return (
    <Popover
      id="reusable-popover"
      sx={{ pointerEvents: "none" }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      <Typography sx={{ p: 1 }}>{content}</Typography>
    </Popover>
  );
};

export default ReusablePopover;
