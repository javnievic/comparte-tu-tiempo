// src/pages/EditOffer.jsx
import { useEffect, useContext, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { UIContext } from "../contexts/UIContext";
import { Box, TextField, Typography, Avatar, IconButton, CircularProgress } from "@mui/material";
import theme from "../styles/theme";
import CustomButton from "../components/CustomButton";
import FormContainer from "../components/FormContainer";
import ErrorMessage from "../components/ErrorMessage";
import DurationSlider from "../components/DurationSlider";
import { minutesToHHMMSS } from "../utils/time";
import { getOfferById, updateOffer } from "../services/offerService";
import { useForm } from "../hooks/useForm";
import { validateOfferFields, validateFormFields } from "../utils/validation";

export default function EditOffer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const { openLoginModal } = useContext(UIContext);
    const fileInputRef = useRef(null);

    const [durationMinutes, setDurationMinutes] = useState(15);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingOffer, setLoadingOffer] = useState(true);

    const { formData, setFormData, errors, setErrors, handleChange, handleFileChange } =
        useForm(
            {
                title: "",
                description: "",
                duration: "",
                location: "",
                image: null,
            },
            validateOfferFields
        );

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
                if (data.user.id !== currentUser.id) {
                    navigate(`/offers/${id}`);
                    return;
                }

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    duration: data.duration || "",
                    location: data.location || "",
                    image: data.image || null,
                });

                if (data.duration_minutes) setDurationMinutes(data.duration_minutes);
            } catch (error) {
                console.error("Error cargando oferta", error);
                navigate("/");
            } finally {
                setLoadingOffer(false);
            }
        };
        if (currentUser) fetchOffer();
    }, [id, currentUser, navigate, setFormData]);

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setFormData({ ...formData, image: null });
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setLoading(true);

        const fieldsToValidate = Object.keys(formData);
        const newErrors = validateFormFields(formData, fieldsToValidate, validateOfferFields);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "image") {
                    if (formData.image instanceof File) data.append("image", formData.image);
                } else {
                    data.append(key, formData[key]);
                }
            });

            await updateOffer(id, data);
            navigate(`/offers/${id}`);
        } catch (error) {
            console.error("Error actualizando oferta", error);
            if (error.response?.data) {
                const messages = Object.values(error.response.data)
                    .map((val) => (Array.isArray(val) ? val.join(", ") : val))
                    .join(" | ");
                setFormError(messages);
            } else setFormError("Error de conexión con el servidor");
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
                    setFormData(prev => ({ ...prev, duration: minutesToHHMMSS(newValue) }));
                }}
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
                            src={
                                formData.image instanceof File
                                    ? URL.createObjectURL(formData.image)
                                    : formData.image || ""
                            }
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
