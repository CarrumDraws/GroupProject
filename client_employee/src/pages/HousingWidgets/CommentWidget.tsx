import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";

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

const CommentWidget: React.FC<ReportProps> = ({ data, id, isClosed }) => {
  const [open, setOpen] = useState(false);
  const [currText, setCurrText] = useState(data.description);
  const [editText, setEditText] = useState(data.description);

  const token = localStorage.getItem("token");

  const revertChanges = () => {
    setEditText(currText);
    setOpen(false);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = {
      description: editText,
    };

    // Call Edit Comment
    (async () => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/report/${data._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrText(response.data.description);
        setOpen(false);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
  }

  const handleCommentChange = (event: React.FormEvent<HTMLFormElement>) => {
    setEditText(event.target?.value);
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

      <Typography>{currText}</Typography>

      {data.employee_id._id === id && !isClosed && (
        <Box display="flex" flexDirection="row" sx={{ width: "100%" }}>
          <Box flexGrow="99" sx={{ width: "100%" }} />
          <Button
            variant="contained"
            sx={{ width: "5rem" }}
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            Edit
          </Button>
        </Box>
      )}

      <Dialog open={open} fullWidth>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column">
              <TextField
                id="description"
                label="New Comment"
                value={editText}
                onChange={handleCommentChange}
                variant="outlined"
              />

              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ margin: "0.5rem 0.5rem 0rem 0.5rem" }}
                  onClick={() => {
                    revertChanges();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ margin: "0.5rem 0.5rem 0rem 0.5rem" }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
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
