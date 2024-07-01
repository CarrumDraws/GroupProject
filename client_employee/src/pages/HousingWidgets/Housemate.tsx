import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import axios from "axios";

interface Name {
  firstname: string;
  lastname: string;
}

interface Phone {
  cell: string;
}

interface UserData {
  name?: Name;
  phone?: Phone;
}

interface HousemateProps {
  userid: string;
  email: string;
}

const Housemate: React.FC<HousemateProps> = ({ userid, email }) => {
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Call Get House
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/employee/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.profile);
        console.log(response.data.profile);
      } catch (err) {
        console.log("Failed to get House Data");
      }
    })();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#457b9d",
        color: "#ffffff",
        marginRight: "3rem",
        padding: "0.5rem 1.5rem 0.5rem 1.5rem",
        borderRadius: "0.5rem",
      }}
    >
      <Typography sx={{ fontWeight: "bold" }}>
        {userData.name?.firstname && userData.name?.firstname?.length > 1
          ? userData.name?.firstname
          : email}{" "}
        {userData.name?.lastname}
      </Typography>
      <Typography sx={{ fontSize: "0.875rem", fontStyle: "italic" }}>
        {userData.phone?.cell}
      </Typography>
    </Box>
  );
};

export default Housemate;
