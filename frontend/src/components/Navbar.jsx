import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import CustomButton from "./customButton";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      elevation={0} // remove shadow
      sx={{
        backgroundColor: "transparent", // keep it transparent
        borderBottom: theme => `1px solid ${theme.palette.border.default}`, // grey bottom border
        paddingX: { xs: 2, md: 12 }, // responsive horizontal padding
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

          }}
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
          <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 600 }}>
            Inicia sesión
          </Typography>

          {/* Register Button using CustomButton */}
          <CustomButton type="submit" variantstyle="outline" variant="contained">
            Registrarse
          </CustomButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
