import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  return (
    <AppBar
      position="static"
      elevation={0} // remove shadow
      sx={{
        backgroundColor: "transparent", // keep it transparent
        borderBottom: theme => `1px solid ${theme.palette.border.default}`, // grey bottom border
        paddingX: { xs: 2, md: 12.5 }, // responsive horizontal padding
        paddingY: 0.5,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo Section */}
        <Box
        component="img"
        src="https://placehold.co/68x68"
        alt="Logo"
        sx={{
            width: 68,
            height: 68,
            cursor: "pointer", // show pointer on hover
        }}
        onClick={() => navigate("/")} // navigate to home page
        />


        {/* Right Side Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {/* Login Text */}
            <Typography
              variant="h5"
              sx={{ color: "text.primary", fontWeight: 600, cursor: "pointer" }}
              onClick={handleOpenLogin}
            >
              Inicia sesión
            </Typography>

          {/* Register Button using CustomButton */}
          <CustomButton onClick={() => navigate("/register")} variantstyle="outline" variant="contained">
            Registrarse
          </CustomButton>
        </Box>
      </Toolbar>
      <LoginModal open={openLogin} onClose={handleCloseLogin} />
    </AppBar>
  );
}
