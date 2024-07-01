import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

import ReportWidget from "./HousingWidgets/ReportWidget";
import CommentWidget from "./HousingWidgets/CommentWidget";

function Report() {
  const [yourId, setYourId] = useState(null);
  const [reportData, setReportData] = useState({});

  const commentRef = useRef<HTMLInputElement>(null);

  const { reportid } = useParams(); // Extract the 'id' parameter from the URL

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Call Get Employee for ID
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setYourId(response.data.profile.employee_id._id);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
  }, []);

  useEffect(() => {
    if (!reportid) return;

    console.log("URL parameter reportid:", reportid);

    // Call Get House
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/report/${reportid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReportData(response.data);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
  }, [reportid]);

  useEffect(() => {
    if (!reportData) return;

    console.log(reportData);
  }, [reportData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      description: commentRef?.current?.value,
    };

    // Submit New Comment
    (async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/report/${
            reportData?.report?._id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setReportData((prev) => ({
          ...prev,
          comments: [...prev.comments, response.data],
        }));
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
    console.log("Form data submitted:", formData);

    if (commentRef.current) commentRef.current.value = "";
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ margin: "1.5rem" }}>
      {reportData?.report && (
        <>
          <ReportWidget data={reportData?.report} />
          <Box style={{ marginBottom: "120px" }}>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ paddingLeft: "1.5rem" }}
            >
              {reportData?.comments.map((comment, index) => (
                <CommentWidget
                  data={comment}
                  id={yourId}
                  isClosed={reportData.report.status === "Closed"}
                  key={comment._id}
                />
              ))}
            </Box>
          </Box>
        </>
      )}
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
                id="description"
                label="Add Comment"
                inputRef={commentRef}
                multiline
                fullWidth
                variant="outlined"
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={reportData?.report?.status === "Closed"}
              sx={{ margin: "0rem 0.5rem 0rem 0.5rem" }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Report;
