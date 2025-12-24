import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: 'large',
}));

const Unauth = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Box sx={{ display: { md: "flex" } }}>
        <StyledIconButton
          size="large"
          edge="end"
          aria-haspopup="true"
          onClick={() => {
            navigate('/login')
          }}
          color="inherit"
        >
          <LoginIcon />
        </StyledIconButton>
      </Box>
    </React.Fragment>
  );
};

export default Unauth;
