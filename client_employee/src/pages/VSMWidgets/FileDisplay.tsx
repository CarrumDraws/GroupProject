import React, { useState, useEffect } from "react";
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

function FileDisplay({ id, type }) {
  let [file, setFile] = useState();

  const token = localStorage.getItem("token");

  // Get File
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/file/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setFile(response.data);
      } catch (err) {
        console.log("Failed to get File");
      }
    })();
  }, []);

  useEffect(() => {
    if (!file) return;
    console.log(file.status);
  }, [file]);

  return (
    <>
      {file?.status === "Approved" && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignContent="center"
          textAlign="center" // Align text center
        >
          <iframe
            src={file.url}
            style={{ width: "125px", aspectRatio: "1/1.3" }}
          />
          <Typography
            component="a"
            href={file.url}
            style={{ marginTop: "0.3rem", marginBottom: "1rem" }}
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
          >
            View {type}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default FileDisplay;
