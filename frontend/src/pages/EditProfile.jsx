// src/pages/EditProfile.jsx
import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Typography, Avatar, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import theme from "../styles/theme";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";
import { UserContext } from "../contexts/UserContext";
import { updateUser } from "../services/userService";

export default function EditProfile() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    location: "",
    description: "",
    profile_picture: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Prefill with user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        phone_number: currentUser.phone_number || "",
        location: currentUser.location || "",
        description: currentUser.description || "",
        profile_picture: null,
      });
    }
  }, [currentUser]);

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
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      const updatedUser = await updateUser(currentUser.id, data);
      setCurrentUser(updatedUser);
      navigate(`/users/${currentUser.id}`);
    } catch (error) {
      console.error("Error actualizando perfil", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <FormContainer title="Editar perfil" handleSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar
            src={
              formData.profile_picture
                ? URL.createObjectURL(formData.profile_picture)
                : currentUser?.profile_picture
            }
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
          <Typography>Actualiza tu foto de perfil</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Nombre"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Apellidos"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        <TextField
          label="Sobre ti"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          fullWidth
        />
        <TextField
          label="Teléfono"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Ubicación"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
        />

        <CustomButton type="submit" variantstyle="primary" variant="contained">
          {loading ? "Guardando..." : "Guardar cambios"}
        </CustomButton>
      </FormContainer>
    </ThemeProvider>
  );
}
