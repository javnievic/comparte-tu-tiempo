import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Button, Typography, Avatar } from "@mui/material";
import { registerUser } from "../services/authService";
import theme from "../styles/theme";

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    location: "",
    description: "",
    skills: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await registerUser(formData);
      console.log("Registro exitoso", response);
    } catch (error) {
      console.error("Error en el registro", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 3,
          border: "1px solid",
          borderColor: "text.primary",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h3" align="center">Registro</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar src="https://placehold.co/80x80" sx={{ width: 80, height: 80 }} />
          <Typography>Sube una foto para tu perfil</Typography>
          
        </Box>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Nombre" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth />
            <TextField label="Apellidos" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth />
          </Box>

          <TextField label="Descripción" name="description" value={formData.description} onChange={handleChange} multiline rows={3} fullWidth />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" fullWidth />
          <TextField label="Teléfono" name="phone_number" value={formData.phone_number} onChange={handleChange} fullWidth />
          <TextField label="Sobre tí" name="location" value={formData.location} onChange={handleChange} fullWidth />
          <TextField label="Habilidades" name="skills" value={formData.skills} onChange={handleChange} fullWidth />
          <TextField label="Contraseña" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth />
          <TextField label="Repite la contraseña" name="confirm_password" value={formData.confirm_password} onChange={handleChange} type="password" fullWidth />

          <Button type="submit" variant="contained" color="primary" >
            Crear cuenta
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
}
