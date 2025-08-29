import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Button, Typography, Avatar, IconButton, Divider } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { registerUser } from "../services/authService";
import theme from "../styles/theme";
import ErrorMessage from "../components/ErrorMessage";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";

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
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(""); 
  const validateRegisterField = (name, value, formData) => {
    setErrors({});
    let error = "";

    if (name === "first_name" || name === "last_name") {
        if (!value.trim()) error = "Este campo es obligatorio";
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = "Solo letras y espacios";
    }

    if (name === "email") {
        if (!value.trim()) error = "Este campo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email inválido";
    }

    if (name === "password") {
        if (!value.trim()) error = "Este campo es obligatorio";
        else if (value.length < 8) error = "Mínimo 8 caracteres";
        else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value))
        error = "Debe contener mayúscula, minúscula y número";
    }

    if (name === "confirm_password") {
        if (!value.trim()) error = "Este campo es obligatorio";
        else if (value !== formData.password) error = "Las contraseñas no coinciden";
    }

    if (name === "phone_number") {
        if (value && !/^\d{9,15}$/.test(value)) error = "Número inválido (9-15 dígitos)";
    }

    if (name === "location") {
        if (value.length > 100) error = "Máximo 100 caracteres";
    }

    if (name === "description") {
        if (value.length > 500) error = "Máximo 500 caracteres";
    }

    return error;
    };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateRegisterField(name, value, { ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const newErrors = {};
    ["first_name", "last_name", "email", "password", "confirm_password"].forEach((field) => {
    if (!formData[field].trim()) {
        newErrors[field] = "Este campo es obligatorio";
    }
    });

    Object.keys(formData).forEach((field) => {
        const error = validateRegisterField(field, formData[field], formData);
        if (error) newErrors[field] = error;
    });

    if (formData.password !== formData.confirm_password) {
    newErrors.confirm_password = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
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
      console.log("Registro exitoso", response);
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        if (backendErrors.email) {
          setFormError(backendErrors.email[0]);
        }
      } else {
        setFormError("Ocurrió un error de conexión");
      }
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <FormContainer
        title="Registro"
        handleSubmit={handleSubmit}
        formError={formError}
        showAvatar={true}
      >

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
            Crear cuenta
          </CustomButton>

        {formError && <ErrorMessage message={formError} duration={3000} />}
      </FormContainer>
    </ThemeProvider>
  );
}
