import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none !important",
}));

const Tabs = () => {
  const authContext = useContext(AuthContext);

  return (
    <Box sx={{ display: { md: "flex" }, marginLeft: 'auto', justifyContent: "flex-end", marginRight: '8px' }}>
      <Stack spacing={1} direction="row">
        {authContext.role === "student" && (
          <StyledButton
            variant="outlined"
            color="inherit"
          >
            <Link
              to="/complaints"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              All Active Complaints
            </Link>
          </StyledButton>
        )}
        {authContext.role === "student" && (
          <StyledButton
            variant="outlined"
            color="inherit"
          >
            <Link
              to="/complaints/me"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              My Complaints
            </Link>
          </StyledButton>
        )}
        {authContext.role === "student" && (
          <StyledButton
            variant="outlined"
            color="inherit"
          >
            <Link
              to="/create"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Create Complaint
            </Link>
          </StyledButton>
        )}
        {authContext.role === "student" && (
          <StyledButton
            variant="outlined"
            color="inherit"
          >
            <Link
              to="/givefeedback"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Give FeedBack
            </Link>
          </StyledButton>
        )}
        {authContext.role === "dean" && (
          <StyledButton
            variant="outlined"
            color="inherit"
          >
            <Link
              to="/view"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              View Feedback
            </Link>
          </StyledButton>
        )}
        {authContext.role === "dean" && (
          <StyledButton
            variant="outlined"
            color="inherit"
          >
            <Link
              to="/resolve"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Resolve Complaints
            </Link>
          </StyledButton>
        )}

        <StyledButton
          key="Home"
          variant="outlined"
          color="inherit"
          style={{ marginLeft: "8px" }}
        >
          <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
        </StyledButton>
      </Stack>
    </Box>
  );
};

export default Tabs;
