//List component to display violation
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";
import ListItemIcon from "@mui/material/ListItemIcon";
import type { Pilot } from "../pages/api/drones";

const Violation = ({ pilot }: { pilot: Pilot }) => {
  return (
    <ListItem>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText
        primary={`${pilot.firstName} ${pilot.lastName} | Email: ${pilot.email} | Phone: ${pilot.phoneNumber}`}
        secondary={`Coordinates: 
        x:${Number(pilot.closestXY[0]).toFixed()},
         y:${Number(pilot.closestXY[1]).toFixed()}`}
      />
    </ListItem>
  );
};

export default Violation;
