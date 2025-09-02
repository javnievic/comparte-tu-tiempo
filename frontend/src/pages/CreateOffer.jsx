// src/pages/CreateOffer.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Typography, IconButton, Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import theme from "../styles/theme";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";
import ErrorMessage from "../components/ErrorMessage";
import { createOffer } from "../services/offerService";
import { UIContext } from "../contexts/UIContext";


export default function CreateOffer() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext); // Get logged-in user
  const { openLoginModal } = useContext(UIContext);
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      openLoginModal();
      
    }
  }, [currentUser, navigate, openLoginModal]);

  // State for the form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    location: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate a single field
  const validateField = (name, value) => {
    let error = "";
    if (!value && (name === "title" || name === "description" || name === "duration")) {
      error = "Este campo es obligatorio"; // UI in Spanish
    }
    return error;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    // Validate required fields
    const newErrors = {};
    ["title", "description"].forEach((field) => {
      const error = validateField(field, formData[field]);
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
        if (key === "image" && formData.image) data.append(key, formData.image);
        else data.append(key, formData[key]);
      });

      const durationString = `${durationHours.toString().padStart(2,"0")}:${durationMinutes.toString().padStart(2,"0")}:00`;
      data.append("duration", durationString);

      await createOffer(data);
      navigate("/"); // Redirect to offers list
    } catch (error) {
      setFormError("Error al crear la oferta. Revisa tus datos."); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <FormContainer title="Crear Oferta" handleSubmit={handleSubmit}>
        <TextField
          label="Título *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          label="Descripción *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          error={!!errors.description}
          helperText={errors.description}
        />
        <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
            <TextField
            label="Horas"
            type="number"
            value={durationHours}
              onChange={(e) => {
                let val = parseInt(e.target.value) || 0;
                if (val < 0) val = 0;
                if (val > 23) val = 23; // máximo 23 horas
                setDurationHours(val);
            }}
            slotProps={{
                input: {
                min: 0
                }
            }}
            />
            <TextField
            label="Minutos"
            type="number"
            value={durationMinutes}
            onChange={(e) => {
                let val = parseInt(e.target.value) || 0;
                if (val < 0) val = 0;
                if (val > 59) val = 59;
                setDurationMinutes(val);
            }}
            slotProps={{
                input: { min: 0, max: 59 }
            }}
            />


        </Box>
        <TextField
          label="Ubicación"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
        />

        <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
          <Avatar
            src={formData.image ? URL.createObjectURL(formData.image) : "https://placehold.co/80x80"}
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
          <Typography sx={{ ml: 2 }}>Sube una imagen para tu oferta</Typography>
        </Box>

        <CustomButton type="submit" variantstyle="primary" variant="contained">
          {loading ? "Creando oferta..." : "Crear oferta"}
        </CustomButton>

        {formError && <ErrorMessage message={formError} duration={3000} />}
      </FormContainer>
    </ThemeProvider>
  );
}
