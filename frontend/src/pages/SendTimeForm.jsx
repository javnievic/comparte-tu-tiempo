import { useState, useContext, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Typography, Link } from "@mui/material";
import theme from "../styles/theme";
import FormContainer from "../components/FormContainer";
import CustomButton from "../components/CustomButton";
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../contexts/UserContext";
import { useForm } from "../hooks/useForm";
import { createTransaction } from "../services/transactionService";
import { getUserById } from "../services/userService";
import { getOfferById } from "../services/offerService";
import { validateTransactionField } from "../utils/validation";
import { useLocation, useParams, Link as RouterLink } from "react-router-dom";

export default function SendTimeForm({ onSuccess }) {
    const { currentUser } = useContext(UserContext);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const { userId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const offerId = searchParams.get("offerId"); // opcional

    const [receiverUser, setReceiverUser] = useState(null);
    const [offer, setOffer] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const { formData, setFormData, errors, setErrors, handleChange } = useForm(
        { title: "", text: "", duration: "" },
        validateTransactionField
    );

    // Fetch de usuario y oferta
useEffect(() => {
  const fetchData = async () => {
    try {
      const user = await getUserById(userId);
      setReceiverUser(user);

      if (offerId) {
        const offerData = await getOfferById(offerId);

        if (offerData.owner !== user.id) {
          setFetchError("La oferta no pertenece a este usuario");
          setLoadingData(false);
          return;
        }

        setOffer(offerData);
      }

      setLoadingData(false);
    } catch (err) {
      setFetchError("Usuario u oferta no encontrado");
      setLoadingData(false);
    }
  };

  fetchData();
}, [userId, offerId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setLoading(true);

        // Validación frontend
        const newErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateTransactionField(field, formData[field], formData);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                receiver: receiverUser.id,
                offer: offer?.id || null,
            };
            const transaction = await createTransaction(payload);
            if (onSuccess) onSuccess(transaction);
            setFormData({ title: "", text: "", duration: "" });
        } catch (err) {
            if (err.response?.data?.receiver) {
                setFormError(err.response.data.receiver);
            } else {
                setFormError("Ocurrió un error al enviar el tiempo");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser)
        return <Typography>Debes iniciar sesión para enviar tiempo</Typography>;

    if (loadingData) return <Typography>Cargando datos...</Typography>;
    if (fetchError) return <Typography color="error">{fetchError}</Typography>;

    return (
        <ThemeProvider theme={theme}>
            <FormContainer
                title={
                    <>
                        Enviar tiempo a {" "}
                        <Link
                            component={RouterLink}
                            to={`/users/${receiverUser.id}`}
                            underline="hover"
                        >
                            {receiverUser.first_name} {receiverUser.last_name}
                        </Link>
                    </>
                }
                handleSubmit={handleSubmit}
            >

                {/* Mostrar oferta si existe */}
                {offer && (
                    <Box sx={{ mb: 2 }}>
                        <Typography>
                            Oferta:{" "}
                            <Link href={`/offers/${offer.id}`} underline="hover">
                                {offer.title}
                            </Link>
                        </Typography>
                    </Box>
                )}

                <TextField
                    label="Título"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title}
                />
                <TextField
                    label="Descripción"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.text}
                    helperText={errors.text}
                />
                <TextField
                    label="Duración (HH:MM:SS)"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Ej: 02:30:00"
                    fullWidth
                    error={!!errors.duration}
                    helperText={errors.duration}
                />

                <CustomButton type="submit" variantstyle="primary" variant="contained">
                    {loading ? "Enviando..." : "Enviar tiempo"}
                </CustomButton>

                {formError && <ErrorMessage message={formError} duration={3000} />}
            </FormContainer>
        </ThemeProvider>
    );
}
