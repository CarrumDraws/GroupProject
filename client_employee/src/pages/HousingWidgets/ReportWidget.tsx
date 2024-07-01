import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Button } from "@mui/material";

// import defaultImg from "../HousingWidgets/Default.png";

interface NameData {
  firstname: string;
  lastname: string;
  middlename: string;
  preferredname: string;
}

interface ReportData {
  _id: string;
  house_id: string;
  employee_id: string;
  title: string;
  picture: string;
  name: NameData;
  description: string;
  timestamp: string;
  status: "Open" | "In Progress" | "Closed";
}

interface ReportProps {
  data: ReportData;
}

const ReportWidget: React.FC<ReportProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/report/${data._id}`); // Navigate to the About page
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "calc(100% - 1.5rem)",
        backgroundColor: "#bcddf1",
        marginBottom: "1rem",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
      onClick={() => {
        handleClick();
      }}
    >
      <Box display="flex" flexDirection="row">
        <Avatar
          alt={`${data.name.firstname} ${data.name.lastname}`}
          src={data.picture}
          sx={{
            marginRight: "1rem",
          }}
        />
        <Box>
          <Typography
            sx={{ fontWeight: "bold" }}
          >{`[${data.status}] ${data.title}`}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", color: "gray" }}>
            <Typography sx={{ fontSize: "0.875rem", fontStyle: "italic" }}>
              {`${data.name.firstname} ${
                data.name.preferredname ? `"${data.name.preferredname}"` : ""
              } ${data.name.lastname}`}
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
      {/* Don't need to edit Reports lol */}
      {/* <Box display="flex" flexDirection="row" sx={{ width: "100%" }}>
        <Box flexGrow="99" sx={{ width: "100%" }} />
        <Button variant="contained" sx={{ width: "5rem" }}>
          Edit
        </Button>
      </Box> */}
    </Box>
  );
};

export default ReportWidget;

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
