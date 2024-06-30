import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Button } from "@mui/material";

interface NameData {
  firstname: string;
  lastname: string;
  middlename: string;
  preferredname: string;
}

interface employeeData {
  email: string;
  isHR: boolean;
  password: string;
  _id: string;
}

interface ReportData {
  _id: string;
  report_id: string;
  employee_id: employeeData;
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

const CommentWidget: React.FC<ReportProps> = ({ data, id }) => {
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
          alt="Remy Sharp"
          src={data.picture}
          sx={{
            marginRight: "1rem",
          }}
        />
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>{`${data.name.firstname} ${
            data.name.preferredname ? `"${data.name.preferredname}"` : ""
          } ${data.name.lastname}`}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", color: "gray" }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontStyle: "italic",
              }}
            >
              {formatTimestamp(data.timestamp)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography>{data.description}</Typography>

      {data.employee_id._id === id && (
        <Box display="flex" flexDirection="row" sx={{ width: "100%" }}>
          <Box flexGrow="99" sx={{ width: "100%" }} />
          <Button variant="contained" sx={{ width: "5rem" }}>
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentWidget;

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
