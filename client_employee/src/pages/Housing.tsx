import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

import Housemate from "./HousingWidgets/Housemate";
import Report from "./HousingWidgets/Report";

<<<<<<< HEAD
import "./Housing.css";

=======
>>>>>>> 4ac1cc3be44099e0bdd0dc68b85d009c56d2722d
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
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    password: "",
  });

  const reports: ReportData[] = [
    {
      house_id: "60d21b4667d0d8992e610c85",
      employee_id: "60d21b4967d0d8992e610c88",
      title: "Broken Window",
      description:
        "A window in the living room is broken and needs immediate repair.",
      timestamp: "2024-06-28T12:00:00Z",
      status: "Open",
    },
    {
      house_id: "60d21b4667d0d8992e610c85",
      employee_id: "60d21b4967d0d8992e610c89",
      title: "Plumbing Issue",
      description: "There is a plumbing issue in the kitchen causing a leak.",
      timestamp: "2024-06-28T13:00:00Z",
      status: "In Progress",
    },
    {
      house_id: "60d21b4667d0d8992e610c86",
      employee_id: "60d21b4967d0d8992e610c90",
      title: "Electrical Fault",
      description:
        "An electrical fault in the bedroom is causing the lights to flicker.",
      timestamp: "2024-06-28T14:00:00Z",
      status: "Closed",
    },
  ];

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      title: titleRef?.current?.value,
      email: descriptionRef?.current?.value,
    };
    // Handle form submission, e.g., send data to an API
    console.log("Form data submitted:", formData);

    if (titleRef.current) titleRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

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
        console.log(response.data);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
  }, []);

  return (
<<<<<<< HEAD
    <Box
      className="Housing"
      display="flex"
      flexDirection="column"
      sx={{ margin: "3rem" }}
    >
=======
    <Box display="flex" flexDirection="column" sx={{ margin: "1.5rem" }}>
>>>>>>> 4ac1cc3be44099e0bdd0dc68b85d009c56d2722d
      <Box sx={{ paddingBottom: "1.5rem" }}>
        {CustomTypography("Address")}
        <Box sx={{ paddingLeft: "1.5rem" }}>
          <Typography variant="h6" sx={{}}>
            {houseData?.address?.buildaptnum + " " + houseData?.address?.street}
          </Typography>
          <Typography sx={{}}>
            {houseData?.address?.city +
              " " +
              houseData?.address?.state +
              " " +
              houseData?.address?.zip}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ paddingBottom: "1.5rem" }}>
<<<<<<< HEAD
        {CustomTypography("Housemates")}
=======
        {CustomTypography("House Members")}
>>>>>>> 4ac1cc3be44099e0bdd0dc68b85d009c56d2722d
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
            <Report data={report} key={report.title} />
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
