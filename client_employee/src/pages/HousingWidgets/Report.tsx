import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";

import defaultImg from "../HousingWidgets/Default.png";

interface ReportData {
  house_id: string;
  employee_id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "Open" | "In Progress" | "Closed";
}

interface ReportProps {
  data: ReportData;
}

const Report: React.FC<ReportProps> = ({ data }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "100%",
        backgroundColor: "#bcddf1",
        marginBottom: "1rem",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <Box display="flex" flexDirection="row">
        <Avatar
          alt="Remy Sharp"
          src={defaultImg}
          sx={{
            marginRight: "1rem",
          }}
        />
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>{data.title}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", color: "gray" }}>
            <Typography sx={{ fontSize: "0.875rem", fontStyle: "italic" }}>
              Firstname Lastname
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontStyle: "italic",
                paddingLeft: "0.5rem",
              }}
            >
              / {formatTimestamp(data.timestamp)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography>{data.description}</Typography>
    </Box>
  );
};

export default Report;

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
