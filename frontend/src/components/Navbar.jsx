import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Avatar, 
  Divider, 
  IconButton 
} from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { UIContext } from "../contexts/UIContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(UserContext);
  const { openLoginModal } = useContext(UIContext);

  const [menuOpen, setMenuOpen] = useState(false); 
  const menuRef = useRef(null); 

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  // close menu if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItemStyle = {
    padding: "12px 16px",
    textAlign: "center",
    fontSize: 16,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.05)"
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: theme => `1px solid ${theme.palette.border.default}`,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1440px",
          mx: "auto",
          px: "100px",
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
              {/* Create Offer Button */}
              <Box
                onClick={() => navigate("/create-offer")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: "primary.main",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 28,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                +
              </Box>

              {/* User Avatar with Dropdown Menu */}
              <Box sx={{ position: "relative" }}>
                <IconButton 
                  onClick={() => setMenuOpen(prev => !prev)}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <Avatar
                    src={currentUser.profile_picture}
                    sx={{ width: 52, height: 52 }}
                  />
                  {menuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                </IconButton>

                {menuOpen && (
                  <Box
                    ref={menuRef}
                    sx={{
                      position: "absolute",
                      top: 60,
                      right: 0,
                      backgroundColor: "white",
                      boxShadow: "0px 6px 12px rgba(0,0,0,0.25)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 160,
                      zIndex: 1000
                    }}
                  >
                    <Typography sx={menuItemStyle} onClick={() => { navigate(`/users/${currentUser.id}`); setMenuOpen(false); }}>
                      Ver perfil
                    </Typography>
                    <Divider />
                    <Typography sx={menuItemStyle} onClick={() => { navigate("/my-transactions"); setMenuOpen(false); }}>
                      Mis transacciones
                    </Typography>
                    <Divider />
                    <Typography sx={menuItemStyle} onClick={handleLogout}>
                      Cerrar sesión
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <>
              {/* Login / Register Buttons */}
              <Typography
                variant="h5"
                sx={{ color: "text.primary", fontWeight: 600, cursor: "pointer" }}
                onClick={openLoginModal}
              >
                Inicia sesión
              </Typography>
              <CustomButton
                onClick={() => navigate("/register")}
                variantstyle="outline"
                variant="contained"
              >
                Registrarse
              </CustomButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
