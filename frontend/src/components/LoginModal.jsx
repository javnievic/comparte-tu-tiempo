import { useState } from "react";
import { Modal, Box, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormContainer from "./FormContainer";
import CustomButton from "./CustomButton";
import { loginUser } from "../services/authService";

export default function LoginModal({ open, onClose }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await loginUser(formData); 
    console.log("Successful login", response);

    
    onClose();
  } catch (error) {
    if (error.response) {
      setFormError(error.response.data.detail || "Error al iniciar sesión");
    } else {
      setFormError("Error de conexión con el servidor");
    }
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

        <FormContainer title="Iniciar sesión" handleSubmit={handleSubmit} formError={formError}>
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
            Iniciar sesión
          </CustomButton>
        </FormContainer>
      </Box>
    </Modal>
  );
}
