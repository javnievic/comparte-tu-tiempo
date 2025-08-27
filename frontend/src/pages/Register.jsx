import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Button, Typography, Avatar, IconButton, Divider } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
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
    profile_picture: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      const response = await registerUser(data); 
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
          borderColor: "border.dark",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h3" align="center">Registro</Typography>

        <Divider sx={{ borderColor: "border.default"}} />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar 
            src={formData.profile_picture ? URL.createObjectURL(formData.profile_picture) : "https://placehold.co/80x80"} 
            sx={{ width: 80, height: 80 }} 
          />
          <label htmlFor="upload-photo">
            <input 
              accept="image/*" 
              id="upload-photo" 
              type="file" 
              style={{ display: "none" }} 
              onChange={handleFileChange} 
            />
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography>Sube una foto para tu perfil</Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Nombre *" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth />
            <TextField label="Apellidos *" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth />
          </Box>

          <TextField label="Sobre tí" name="description" value={formData.description} onChange={handleChange} multiline rows={3} fullWidth />
          <TextField label="Email *" name="email" value={formData.email} onChange={handleChange} type="email" fullWidth />
          <TextField label="Teléfono" name="phone_number" value={formData.phone_number} onChange={handleChange} fullWidth />
          <TextField label="Ubicación" name="location" value={formData.location} onChange={handleChange} fullWidth />
          <TextField label="Contraseña *" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth />
          <TextField label="Repite la contraseña *" name="confirm_password" value={formData.confirm_password} onChange={handleChange} type="password" fullWidth />

          <Button type="submit" variant="contained" color="primary">
            Crear cuenta
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
}
