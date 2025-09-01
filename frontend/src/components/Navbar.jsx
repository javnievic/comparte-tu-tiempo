import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const { currentUser, logout } = useContext(UserContext);

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        borderBottom: theme => `1px solid ${theme.palette.border.default}`,
        paddingX: { xs: 2, md: 12.5 },
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
          sx={{ width: 68, height: 68, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        {/* Right Side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {currentUser ? (
            <>
              <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 600 }}>
                Hola, {currentUser.first_name}
              </Typography>
              <CustomButton onClick={handleLogout} variantstyle="outline" variant="contained">
                Cerrar sesión
              </CustomButton>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{ color: "text.primary", fontWeight: 600, cursor: "pointer" }}
                onClick={handleOpenLogin}
              >
                Inicia sesión
              </Typography>
              <CustomButton onClick={() => navigate("/register")} variantstyle="outline" variant="contained">
                Registrarse
              </CustomButton>
            </>
          )}
        </Box>
      </Toolbar>

      <LoginModal open={openLogin} onClose={handleCloseLogin} />
    </AppBar>
  );
}
