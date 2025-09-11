// src/pages/EditProfile.jsx
import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Typography, Avatar, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import theme from "../styles/theme";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../contexts/UserContext";
import { updateUser } from "../services/userService";
import { UIContext } from "../contexts/UIContext";
import { useForm } from "../hooks/useForm";
import { validateUserField } from "../utils/validation";

export default function EditProfile() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { openLoginModal } = useContext(UIContext);
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

    const { formData, setFormData, errors, setErrors, handleChange, handleFileChange } =
    useForm(
      {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        location: "",
        description: "",
        profile_picture: null,
      },
      validateUserField
    );

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
  }, [currentUser, setFormData]);

  // Redirect if no user
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      openLoginModal();
    }
  }, [currentUser, navigate, openLoginModal]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    // Frontend validation
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateUserField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

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
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        if (backendErrors.email) {
          setFormError(backendErrors.email[0]);
        } else {
          setFormError("Ocurrió un error al actualizar el perfil");
        }
      } else {
        setFormError("Error de conexión con el servidor");
      }
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
            error={!!errors.first_name}
            helperText={errors.first_name}
          />
          <TextField
            label="Apellidos"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
            error={!!errors.last_name}
            helperText={errors.last_name}
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
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Teléfono"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          fullWidth
          error={!!errors.phone_number}
          helperText={errors.phone_number}
        />
        <TextField
          label="Ubicación"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          error={!!errors.location}
          helperText={errors.location}
        />

        <CustomButton type="submit" variantstyle="primary" variant="contained">
          {loading ? "Guardando..." : "Guardar cambios"}
        </CustomButton>

        {formError && <ErrorMessage message={formError} duration={3000} />}
      </FormContainer>
    </ThemeProvider>
  );
}
