import { useState, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Typography } from "@mui/material";
import theme from "../styles/theme";
import FormContainer from "../components/FormContainer";
import CustomButton from "../components/CustomButton";
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../contexts/UserContext";
import { useForm } from "../hooks/useForm";
import { createTransaction } from "../services/transactionService";
import { validateTransactionField } from "../utils/validation";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function SendTimeForm({ onSuccess }) {
  const { currentUser } = useContext(UserContext);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { userId } = useParams();
  const offerId = searchParams.get("offerId"); // optional

  const { formData, setFormData, errors, setErrors, handleChange } = useForm({
    title: "",
    text: "",
    duration: "",
  }, validateTransactionField);

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
        receiver: userId,
        offer: offerId || null,
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

  if (!currentUser) return <Typography>Debes iniciar sesión para enviar tiempo</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <FormContainer title="Enviar tiempo" handleSubmit={handleSubmit}>
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
