// src/pages/EditOffer.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { UIContext } from "../contexts/UIContext";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import theme from "../styles/theme";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";
import ErrorMessage from "../components/ErrorMessage";
import DurationSlider from "../components/DurationSlider";
import { minutesToHHMMSS } from "../utils/time";
import { getOfferById, updateOffer } from "../services/offerService";

export default function EditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { openLoginModal } = useContext(UIContext);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    location: "",
    image: null,
  });
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOffer, setLoadingOffer] = useState(true);

  // Redirect if no user
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      openLoginModal();
    }
  }, [currentUser, navigate, openLoginModal]);

  // Fetch offer data
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const data = await getOfferById(id);

        // Only owner can edit
        if (data.user.id !== currentUser.id) {
          navigate(`/offers/${id}`);
          return;
        }

        setFormData({
          title: data.title || "",
          description: data.description || "",
          duration: data.duration || "",
          location: data.location || "",
          image: null,
        });

        if (data.duration_minutes) {
          setDurationMinutes(data.duration_minutes);
        }
      } catch (error) {
        console.error("Error cargando oferta", error);
        navigate("/");
      } finally {
        setLoadingOffer(false);
      }
    };
    if (currentUser) fetchOffer();
  }, [id, currentUser, navigate]);

  const validateField = (name, value) => {
    let error = "";
    if (!value && (name === "title" || name === "description" || name === "duration")) {
      error = "Este campo es obligatorio";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

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
          if (formData.image) data.append("image", formData.image);
        } else {
          data.append(key, formData[key]);
        }
      });

      await updateOffer(id, data);
      navigate(`/offers/${id}`); // Redirect to offer detail
    } catch (error) {
      console.error("Error actualizando oferta", error);
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

  if (loadingOffer) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;

  return (
    <FormContainer title="Editar Oferta" handleSubmit={handleSubmit}>
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
          setFormData((prev) => ({ ...prev, duration: minutesToHHMMSS(newValue) }));
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
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
              }}
              onClick={handleRemoveImage}
            >
              ✕
            </IconButton>
          </Box>
        ) : (
          <Typography variant="subtitle1">Actualizar imagen de la oferta</Typography>
        )}
        <input
          id="image-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>

      <CustomButton type="submit" variantstyle="primary" variant="contained">
        {loading ? "Guardando cambios..." : "Guardar cambios"}
      </CustomButton>

      {formError && <ErrorMessage message={formError} duration={3000} />}
    </FormContainer>
  );
}
