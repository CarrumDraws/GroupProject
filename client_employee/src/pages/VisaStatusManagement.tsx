import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

import Housemate from "./HousingWidgets/Housemate";
import Report from "./HousingWidgets/Report";

const VisaStatusManagement: React.FC = () => {
  const [optData, setOptData] = useState(null);
  const [fileOne, setFileOne] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);

  // Determine Page Status
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Call Get OPT
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/opt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOptData(response.data);
      } catch (err) {
        console.log("Failed to get OPT Data");
      }
    })();
  }, []);

  useEffect(() => {
    if (!optData) return;

    if (optData.status === "Approved") {
      setFileStatus("Approved");
      return;
    }
    const fileid = getFileId(optData);
    if (!fileid) {
      setFileStatus("Upload");
      return;
    }

    // Call Get OPT
    (async () => {
      const token = localStorage.getItem("token");

      try {
        // Perform two file calls if file is I-983
        if (optData.status === "I-983") {
          const responseOne = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/file/${fileid[0]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const responseTwo = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/file/${fileid[1]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setFileOne(responseOne.data);
          console.log(responseOne.data);
          setFileTwo(responseTwo.data);
          setFileStatus(
            determineTruth(responseOne.data.status, responseTwo.data.status)
          );
        } else {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/file/${fileid}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFileOne(response.data);
          setFileStatus(response.data.status);
        }
      } catch (err) {
        console.log("Failed to get OPT Data");
      }
    })();
  }, [optData]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      height="calc(100vh - 65px)"
      sx={{ overflowY: "hidden" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        flexGrow="99"
        sx={{ margin: "1.5rem" }}
      >
        {CustomTypography(
          fileStatus === "Rejected"
            ? "Rejected: Please Review Feedback"
            : fileStatus === "Pending"
            ? "Waiting for HR to Approve your "
            : fileStatus === "Upload"
            ? "Please Upload a copy of your"
            : "All Files "
        )}
        {optData?.status}
        <Box display="flex" flexDirection="row">
          <PdfViewer url={fileOne?.url} />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="1rem"
        sx={{
          height: "100%",
          width: "max(25vw, 300px)",
          backgroundColor: "#bcddf1",
        }}
      >
        {CustomTypography("Approved Documents")}
      </Box>
    </Box>
  );
};

export default VisaStatusManagement;

// Given the data, returns the correct id / array of ID's
function getFileId(data) {
  if (!data || data === "") return null;
  switch (data.status) {
    case "OPT Receipt":
      return data.optreciept;
    case "OPT EAD":
      return data.optead;
    case "I-983":
      return data.i983;
    case "I-20":
      return data.i20;
    case "Approved":
      return null;
    default:
      console.log("Invalid Data.status");
      return null;
  }
}

function determineTruth(statusone, statustwo): string {
  console.log(statusone + " " + statustwo);
  if (statusone === "Pending" || statustwo === "Pending") return "Pending";
  if (statusone === "Rejected" || statustwo === "Rejected") return "Rejected";
  return "Approved";
}

const PdfViewer = ({ url }) => {
  return <iframe src={url} style={{ width: "125px", aspectRatio: "1/1.3" }} />;
};

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
