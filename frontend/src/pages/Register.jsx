import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Typography, Avatar, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import theme from "../styles/theme";
import ErrorMessage from "../components/ErrorMessage";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";
import { UserContext } from "../contexts/UserContext";
import { registerUser } from "../services/authService";
import { validateUserField } from "../utils/validation"
import { useForm } from "../hooks/useForm";

export default function Register() {
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(UserContext);
  
  const { formData, errors, handleChange, handleFileChange, setErrors } = useForm({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    location: "",
    description: "",
    profile_picture: null,
  }, validateUserField);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    const newErrors = {};
    ["first_name", "last_name", "email", "password", "confirm_password"].forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    Object.keys(formData).forEach((field) => {
      const error = validateUserField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return; // Stop submission if there are errors
    }

    if (formData.password !== formData.confirm_password) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "profile_picture") {
          if (formData.profile_picture) data.append(key, formData.profile_picture);
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await registerUser(data);
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
      console.log("Registro exitoso", response);

      navigate("/");
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        if (backendErrors.email) {
          setFormError(backendErrors.email[0]);
        }
      } else {
        setFormError("Ocurrió un error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <FormContainer
        title="Registro"
        handleSubmit={handleSubmit}
      >

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar
            src={formData.profile_picture ? URL.createObjectURL(formData.profile_picture) : "/images/default_user.webp"}
            sx={{ width: 80, height: 80 }}
          />
          <label htmlFor="upload-photo">
            <input
              accept="image/*"
              id="upload-photo"
              name="profile_picture"
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


        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField label="Nombre *" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth error={!!errors.first_name} helperText={errors.first_name} />
          <TextField label="Apellidos *" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth error={!!errors.last_name} helperText={errors.last_name} />
        </Box>

        <TextField label="Sobre ti" name="description" value={formData.description} onChange={handleChange} multiline rows={3} fullWidth error={!!errors.description} helperText={errors.description} />
        <TextField label="Email *" name="email" value={formData.email} onChange={handleChange} type="email" fullWidth error={!!errors.email} helperText={errors.email} />
        <TextField label="Teléfono" name="phone_number" value={formData.phone_number} onChange={handleChange} fullWidth error={!!errors.phone_number} helperText={errors.phone_number} />
        <TextField label="Ubicación" name="location" value={formData.location} onChange={handleChange} fullWidth error={!!errors.location} helperText={errors.location} />
        <TextField label="Contraseña *" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth error={!!errors.password} helperText={errors.password} />
        <TextField label="Repite la contraseña *" name="confirm_password" value={formData.confirm_password} onChange={handleChange} type="password" fullWidth error={!!errors.confirm_password} helperText={errors.confirm_password} />

        <CustomButton type="submit" variantstyle="primary" variant="contained">
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </CustomButton>

        {formError && <ErrorMessage message={formError} duration={3000} />}
      </FormContainer>
    </ThemeProvider>
  );
}
