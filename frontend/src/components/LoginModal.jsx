import { useContext, useState } from "react";
import { Modal, Box, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormContainer from "./FormContainer";
import CustomButton from "./CustomButton";

import { loginUser } from "../services/authService";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../contexts/UserContext";

export default function LoginModal({ open, onClose }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(UserContext);

  const validateLoginField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) error = "El email es obligatorio";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email inválido";
    }
    if (name === "password") {
      if (!value.trim()) error = "La contraseña es obligatoria";
      else if (value.length < 8) error = "Mínimo 8 caracteres";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // real-time validation
    const error = validateLoginField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    // Validate all fiels
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateLoginField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return; // Stop submission
      
    }

    try {
      const response = await loginUser(formData);
      setCurrentUser(JSON.parse(localStorage.getItem("user")));

      console.log("Successful login", response);

      onClose();
    } catch (error) {
    if (error.response && error.response.data) {
      const backendErrors = error.response.data;

      // 1. Field errors
      if (backendErrors.email) {
        setErrors((prev) => ({ ...prev, email: backendErrors.email[0] }));
      }
      if (backendErrors.password) {
        setErrors((prev) => ({ ...prev, password: backendErrors.password[0] }));
      }

      // 2. General errors
      if (backendErrors.non_field_errors) {
        setFormError(backendErrors.non_field_errors[0]);
      } else if (backendErrors.error) {
        setFormError(backendErrors.error);
      } else if (backendErrors.detail) {
        setFormError(backendErrors.detail);
      }
    } else {
      setFormError("Error de conexión con el servidor");
    }
  } finally {
    setLoading(false);
  }
};

  return (
      <Modal open={open} onClose={onClose} aria-labelledby="login-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <FormContainer
          title="Iniciar sesión"
          handleSubmit={handleSubmit}
        >
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
            label="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />
          <CustomButton type="submit" variantstyle="primary" variant="contained">
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </CustomButton>
        </FormContainer>
        {formError && <ErrorMessage message={formError} duration={3000} />}
      </Box>
    </Modal>
    
  );
}
