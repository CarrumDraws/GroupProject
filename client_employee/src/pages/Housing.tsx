import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

import Housemate from "./HousingWidgets/Housemate";
import ReportWidget from "./HousingWidgets/ReportWidget";

interface ReportData {
  house_id: string;
  employee_id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "Open" | "In Progress" | "Closed";
}

interface Address {
  buildaptnum: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Member {
  _id: string;
  email: string;
}

interface HouseData {
  address?: Address; // Optional because it might not always exist
  members?: Member[]; // Array of members
}

interface Props {
  houseData: HouseData | undefined;
}

const Housing: React.FC = () => {
  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [reports, setReports] = useState<any[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      title: titleRef?.current?.value,
      description: descriptionRef?.current?.value,
    };

    // Submit New Report
    (async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/report`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setReports((prev) => [...prev, response.data]);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
    console.log("Form data submitted:", formData);

    if (titleRef.current) titleRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
  };

  useEffect(() => {
    // Call Get House
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/house`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHouseData(response.data);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();

    // Call Get Your Reports
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/report`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setReports(response.data);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
  }, []);

  return (
    <Box display="flex" flexDirection="column" sx={{ margin: "1.5rem" }}>
      <Box sx={{ paddingBottom: "1.5rem" }}>
        {CustomTypography("Address")}
        <Box sx={{ paddingLeft: "1.5rem" }}>
          <Typography variant="h6" sx={{}}>
            {houseData?.address?.buildaptnum + " " + houseData?.address?.street}
          </Typography>
          <Typography>
            {houseData?.address?.city +
              " " +
              houseData?.address?.state +
              " " +
              houseData?.address?.zip}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ paddingBottom: "1.5rem" }}>
        {CustomTypography("House Members")}
        <Box display="flex" flexDirection="row" sx={{ paddingLeft: "1.5rem" }}>
          {houseData?.members?.map((member, index) => (
            <Housemate userid={member._id} key={member.email} />
          ))}
        </Box>
      </Box>
      <Box style={{ marginBottom: "120px" }}>
        {CustomTypography("Reports")}
        <Box
          display="flex"
          flexDirection="column"
          sx={{ paddingLeft: "1.5rem" }}
        >
          {reports.map((report, index) => (
            <ReportWidget data={report} key={report._id} />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#ffffff", // Replace with your desired background color
          padding: "0.5rem",
          textAlign: "center",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "calc(100vw - 0.5rem)" }}>
          <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column" flexGrow="2">
              <TextField
                id="title"
                label="Report Title"
                inputRef={titleRef}
                sx={{ marginBottom: "0.5rem" }}
                fullWidth
                variant="outlined"
              />
              <TextField
                id="description"
                label="Report Description"
                inputRef={descriptionRef}
                multiline
                fullWidth
                variant="outlined"
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ margin: "0rem 0.5rem 0rem 0.5rem" }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Housing;

const CustomTypography = (text: string) => {
  return (
    <Typography
      variant="h5"
      sx={{
        fontWeight: "bold",
        marginBottom: "0.5rem",

        color: "#457b9d",
      }}
    >
      {text}
    </Typography>
  );
};
