// src/pages/CreateOffer.jsx
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { Box, TextField, Typography, IconButton, Avatar, Slider } from "@mui/material";
import theme from "../styles/theme";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";
import ErrorMessage from "../components/ErrorMessage";
import { createOffer } from "../services/offerService";
import { UIContext } from "../contexts/UIContext";
import DurationSlider from "../components/DurationSlider";
import { minutesToHHMMSS } from "../utils/time";

export default function CreateOffer() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext); // Get logged-in user
  const { openLoginModal } = useContext(UIContext);
  const fileInputRef = useRef(null);

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
    duration: minutesToHHMMSS(15),
    location: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const [durationMinutes, setDurationMinutes] = useState(15); // minimum 15


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

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset file input
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
        if (key === "image") {
          if (formData.image) data.append("image", formData.image); // only if there are files
        } else {
          data.append(key, formData[key]);
        }
      });


      await createOffer(data);
      navigate(`/users/${currentUser.id}?tab=1`);
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const messages = Object.values(backendErrors)
          .map((val) => (Array.isArray(val) ? val.join(", ") : val))
          .join(" | ");

        setFormError(messages);
      } else {
        setFormError("Error de conexión con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <DurationSlider
        value={durationMinutes}
        onChange={(e, newValue) => {
          setDurationMinutes(newValue);
          setFormData(prev => ({ ...prev, duration: minutesToHHMMSS(newValue) }));
        }}
      />

      <TextField
        label="Ubicación"
        name="location"
        value={formData.location}
        onChange={handleChange}
        fullWidth
      />

      <Box
        sx={{
          mt: 2,
          mb: 2,
          p: 2,
          border: "2px dashed #ccc",
          borderRadius: 2,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": { borderColor: theme.palette.primary.main },
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) setFormData({ ...formData, image: file });
        }}
        onClick={() => document.getElementById("image-input").click()}
      >
        {formData.image ? (
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={URL.createObjectURL(formData.image)}
              variant="rounded"
              sx={{ width: 150, height: 150 }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                padding: 0,
                minWidth: 0,
              }}
              onClick={handleRemoveImage}
            >
              ✕
            </IconButton>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Sube una imagen de tu oferta
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Arrastra la imagen aquí o haz clic para seleccionar
            </Typography>
          </>
        )}
        <input
          id="image-input"
          type="file"
          name="image"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>

      <CustomButton type="submit" variantstyle="primary" variant="contained">
        {loading ? "Creando oferta..." : "Crear oferta"}
      </CustomButton>

      {formError && <ErrorMessage message={formError} duration={3000} />}
    </FormContainer>
  );
}
