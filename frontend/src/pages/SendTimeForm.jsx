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
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import DurationSlider from "../components/DurationSlider";
import { minutesToHHMMSS } from "../utils/time";
import { UIContext } from "../contexts/UIContext";


export default function SendTimeForm() {
    const { currentUser } = useContext(UserContext);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { openLoginModal } = useContext(UIContext);

    const { userId, offerId } = useParams();

    const [receiverUser, setReceiverUser] = useState(null);
    const [offer, setOffer] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(15); // minimum 15

    const { formData, setFormData, errors, setErrors, handleChange } = useForm(
        { title: "", text: "", duration: "" },
        validateTransactionField
    );

    // User and offer data fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    // Case 1: transaction from user profile
                    const user = await getUserById(userId);
                    setReceiverUser(user);
                }

                if (offerId) {
                    // Case 2: transaction from offer
                    const offerData = await getOfferById(offerId);
                    setOffer(offerData);

                    // obtain user data of the offer owner
                    const user = await getUserById(offerData.user.id);
                    setReceiverUser(user);
                    if (offerData.duration_minutes) {
                        setDurationMinutes(offerData.duration_minutes);
                        setFormData(prev => ({ ...prev, duration: offerData.duration }));
                    }
                }

                setLoadingData(false);
            } catch (error) {
                console.error("Error al obtener datos:", error);
                setFetchError("Usuario u oferta no encontrado");
                setLoadingData(false);
            }
        };

        fetchData();
    }, [userId, offerId, setFormData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setLoading(true);

        // Frontend validation
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
            await createTransaction(payload);
            setFormData({ title: "", text: "", duration: "" });
            navigate(`/my_transactions`);
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

    // Redirect if no user
    useEffect(() => {
        if (!currentUser) {
        navigate("/");
        openLoginModal();
        }
    }, [currentUser, navigate, openLoginModal]);

    if (!currentUser) return null;

    if (loadingData) return <Typography>Cargando datos...</Typography>;
    if (fetchError) return <Typography color="error">{fetchError}</Typography>;

    if (currentUser.id === receiverUser.id) {
        return (
            <Typography color="error">
                No puedes enviarte tiempo a ti mismo.
            </Typography>
        );
    }

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
                            <Link
                                component={RouterLink}
                                to={`/offers/${offer.id}`}
                                underline="hover"
                            >
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
                <DurationSlider
                    value={durationMinutes}
                    onChange={(e, newValue) => {
                        setDurationMinutes(newValue);
                        setFormData(prev => ({ ...prev, duration: minutesToHHMMSS(newValue) }));
                    }}
                />

                <CustomButton type="submit" variantstyle="primary" variant="contained">
                    {loading ? "Enviando..." : "Enviar tiempo"}
                </CustomButton>

                {formError && <ErrorMessage message={formError} duration={3000} />}
            </FormContainer>
        </ThemeProvider>
    );
}
