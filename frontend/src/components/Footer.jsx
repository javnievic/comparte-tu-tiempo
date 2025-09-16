// src/components/Footer.jsx
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { LocationOn, Email, Phone, Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import CustomButton from "./CustomButton";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "#1C1C1C",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 5,
        pb: 2,
        mt: 6,
      }}
    >
      {/* Main component */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1240px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "space-between" },
          gap: 6,
          mb: 4,
        }}
      >
        {/* Logo + description */}
        <Box sx={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            ComparteTuTiempo
          </Typography>
          <Typography variant="body2" sx={{ color: "#CFD3D7" }}>
            ComparteTuTiempo es un banco de tiempo que incentiva la economía colaborativa, 
            permitiendo a los usuarios intercambiar habilidades y servicios de manera sencilla y segura,
            fomentando la cooperación y el aprendizaje entre la comunidad.
          </Typography>
        </Box>

        {/* Contact */}
        <Box sx={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Contacto
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn sx={{ color: "#CFD3D7" }} />
            <Typography variant="body1" sx={{ color: "#CFD3D7" }}>
              Sevilla
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Email sx={{ color: "#CFD3D7" }} />
            <Typography variant="body2" sx={{ color: "#CFD3D7" }}>
              info@nombre.com
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Phone sx={{ color: "#CFD3D7" }} />
            <Typography variant="body2" sx={{ color: "#CFD3D7" }}>
              +1 386-688-3295
            </Typography>
          </Box>
        </Box>

        {/* Help & Legal */}
        <Box sx={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Ayuda & Legal
          </Typography>
          {["Inicio", "Sobre nosotros", "Preguntas frecuentes", "Términos y condiciones"].map(
            (item) => (
              <Typography
                key={item}
                variant="body2"
                sx={{
                  color: "#CFD3D7",
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {item}
              </Typography>
            )
          )}
        </Box>

        {/* Newsletter */}
        <Box sx={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Suscríbete a la newsletter
          </Typography>
          <TextField
            placeholder="Escribe tu email"
            size="small"
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              input: { color: "black" },
            }}
          />
          <CustomButton sx={{ width: "fit-content" }}>
            Suscribirse
          </CustomButton>
        </Box>
      </Box>

      {/* Social media (placeholder) */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, i) => (
          <IconButton
            key={i}
            sx={{ bgcolor: "white", color: "#1C1C1C", "&:hover": { bgcolor: "primary.main", color: "white" } }}
            size="small"
          >
            <Icon />
          </IconButton>
        ))}
      </Box>

      {/* Copyright */}
      <Typography variant="body2" sx={{ color: "#CFD3D7", textAlign: "center" }}>
        © 2025 Banco de Tiempo – Todos los derechos reservados
      </Typography>
    </Box>
  );
}
