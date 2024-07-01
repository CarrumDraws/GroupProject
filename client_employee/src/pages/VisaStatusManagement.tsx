import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Input,
  Snackbar,
  Alert,
} from "@mui/material";

import axios from "axios";

import FileDisplay from "./VSMWidgets/FileDisplay";

const VisaStatusManagement: React.FC = () => {
  const [optData, setOptData] = useState<Record<string, any> | null>(null);
  const [fileOne, setFileOne] = useState<Record<string, any> | null>(null);
  const [fileTwo, setFileTwo] = useState<Record<string, any> | null>(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState<boolean | null>(false);

  const [selectedFileOne, setSelectedFileOne] = useState<Record<
    string,
    any
  > | null>(null);
  const [selectedFileTwo, setSelectedFileTwo] = useState<Record<
    string,
    any
  > | null>(null);

  const [error, setError] = useState({ message: "", open: false });

  const token = localStorage.getItem("token");

  const handleFileChangeOne = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files?.[0] || null;
    setSelectedFileOne(file);
  };
  const handleFileChangeTwo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    setSelectedFileTwo(file || null);
  };

  function handleSubmit() {
    console.log("Handling Submit");

    if (!selectedFileOne) {
      setError({ message: "Missing File(s)!", open: true });
      return;
    } else if (optData?.status === "I-983" && !selectedFileTwo) {
      setError({
        message: "Missing Second File!",
        open: true,
      });
      return;
    }

    const formData = new FormData();
    if (selectedFileOne !== null) {
      setFileOne(URL.createObjectURL(selectedFileOne));
      formData.append("fileone", selectedFileOne);
    }
    if (optData?.status === "I-983" && selectedFileTwo) {
      setFileTwo(URL.createObjectURL(selectedFileTwo));
      formData.append("filetwo", selectedFileTwo);
    }

    (async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/opt/${optData?.status}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setFileStatus("Pending");
        setSubmitted(true);
        console.log("Files Posted");
      } catch (err) {
        console.log("Failed to get OPT Data");
      }
    })();
  }

  useEffect(() => {
    console.log(selectedFileOne);
  }, [selectedFileOne]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError({ ...error, open: false });
  };

  // Get OPT
  useEffect(() => {
    console.log("Getting OPT");
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

  // Get File Data
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

    console.log("Getting File Data");
    (async () => {
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
            ? `${optData?.status} Rejected: Please Review Feedback`
            : fileStatus === "Pending"
            ? optData?.status === "I-983"
              ? `Waiting for HR to Approve and Sign your ${optData?.status}`
              : `Waiting for HR to Approve your ${optData?.status}`
            : fileStatus === "Upload"
            ? optData?.status === "I-983"
              ? `Please Download and Fill Out both ${optData?.status} Forms`
              : `Please Upload a copy of your ${optData?.status}`
            : "All Files Approved!"
        )}

        {/* Rejected Feedback Section */}
        {fileStatus === "Rejected" && (
          <Paper style={{ padding: "1rem", backgroundColor: "#fbe3e7" }}>
            <Typography color="error" sx={{ fontWeight: "bold" }}>
              Feedback from HR:
            </Typography>
            <Typography variant="body1">
              {optData?.status === "I-983" && fileOne?.status === "Rejected" ? (
                <span>
                  <b>File One: </b> {fileOne?.feedback}
                </span>
              ) : (
                fileOne?.feedback
              )}
            </Typography>
            {fileTwo && (
              <Typography variant="body1">
                <span>
                  <b>File Two: </b> {fileTwo.feedback}
                </span>
              </Typography>
            )}
          </Paper>
        )}

        {/* File Display */}
        {!submitted &&
          (fileStatus === "Pending" || fileStatus === "Rejected") && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-evenly"
              sx={{ width: "100%", marginTop: "3rem" }}
            >
              <PdfViewer url={fileOne?.url} />
              {fileTwo && <PdfViewer url={fileTwo?.url} />}
            </Box>
          )}

        {/* Just Submitted File Display */}
        {submitted && fileOne && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
            sx={{ width: "100%", marginTop: "3rem" }}
          >
            <PdfViewer url={fileOne} />
            {fileTwo && <PdfViewer url={fileTwo} />}
          </Box>
        )}

        {/* Download I-983 Forms */}
        {(fileStatus === "Upload" || fileStatus === "Rejected") &&
          optData?.status === "I-983" && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-evenly"
              sx={{ width: "100%", marginTop: "3rem" }}
            >
              <Button
                variant="contained"
                color="primary"
                href="../../I-983_File_One.pdf"
                download
              >
                Download Form One
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="../../I-983_File_Two.pdf"
                download
              >
                Download Form Two
              </Button>
            </Box>
          )}

        {/* File Upload */}
        {(fileStatus === "Upload" || fileStatus === "Rejected") && (
          <>
            <Box sx={{ marginTop: "3rem" }}>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChangeOne}
              />
              {optData?.status === "I-983" && (
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChangeTwo}
                />
              )}
            </Box>

            <Box sx={{ marginTop: "3rem" }}>
              <Button
                variant="contained"
                component="span"
                onClick={() => {
                  handleSubmit();
                }}
              >
                {`Upload File${optData?.status === "I-983" ? "s" : ""}`}
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Error Component */}
      <Snackbar open={error.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error.message}
        </Alert>
      </Snackbar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="1rem"
        sx={{
          height: "100%",
          width: "max(25vw, 300px)",
          backgroundColor: "#bcddf1",
          overflowY: "auto", // Add this line to enable vertical scrolling
          //   maxHeight: "400px", // Adjust the maxHeight as needed
        }}
      >
        {CustomTypography("Approved Documents")}
        {approvedFiles(optData).map((file, index) => (
          <FileDisplay key={file[0]} id={file[0]} type={file[1]} />
        ))}
      </Box>
    </Box>
  );
};

export default VisaStatusManagement;

// Given the data, returns the correct id / array of ID's
function getFileId(data: any) {
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

// Returns Array
function approvedFiles(data: any) {
  const arr: string[][] = []; // Array of File ID's
  if (!data) return arr;
  if (data.optreciept) arr.push([data.optreciept, "OPT Reciept"]);
  if (data.optead) arr.push([data.optead, "OPT EAD"]);
  if (data.i983?.[0]) arr.push([data.i983[0], "I-983 One"]);
  if (data.i983?.[1]) arr.push([data.i983[1], "I-983 Two"]);
  if (data.i20) arr.push([data.i20, "I-20"]);
  return arr;
}

function determineTruth(statusone: string, statustwo: string): string {
  if (statusone === "Pending" || statustwo === "Pending") return "Pending";
  if (statusone === "Rejected" || statustwo === "Rejected") return "Rejected";
  return "Approved";
}

const PdfViewer = ({ url }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignContent="center"
      textAlign="center" // Align text center
    >
      <iframe src={url} style={{ width: "125px", aspectRatio: "1/1.3" }} />
      <Typography
        component="a"
        href={url}
        style={{ marginTop: "1rem" }}
        target="_blank"
        rel="noopener noreferrer"
        variant="body1"
      >
        View File
      </Typography>
    </Box>
  );
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
