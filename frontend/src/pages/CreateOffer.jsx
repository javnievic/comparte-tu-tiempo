// src/pages/CreateOffer.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Typography, IconButton, Avatar, Slider } from "@mui/material";
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

  const [durationMinutesTotal, setDurationMinutesTotal] = useState(15); // mínimo 15

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

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

      const h = Math.floor(durationMinutesTotal / 60);
      const m = durationMinutesTotal % 60;
      const durationString = `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:00`;
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
        <Box sx={{ mt: 3, mb: 3, width: "100%" }}>
        <Typography gutterBottom>Duración estimada (mínimo 15 minutos)</Typography>

        <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
            <Slider 
            value={durationMinutesTotal}
            min={15}
            max={240}
            step={15}
            marks={[
                { value: 15, label: "00:15" },
                { value: 60, label: "01:00" },
                { value: 120, label: "02:00" },
                { value: 180, label: "03:00" },
                { value: 240, label: "04:00" },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(val) => formatDuration(val)}
            onChange={(e, newValue) => setDurationMinutesTotal(newValue)}
            />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Typography>{formatDuration(durationMinutesTotal)} horas</Typography>
        </Box>
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
