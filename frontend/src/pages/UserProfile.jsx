// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Avatar, Divider, CircularProgress } from "@mui/material";
import { getUserById } from "../services/userService";
import CustomButton from "../components/CustomButton";
import { MapPin, Mail, Phone } from "lucide-react";

export default function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                setUser(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
    if (!user) return <Typography sx={{ textAlign: "center", mt: 5 }}>Usuario no encontrado</Typography>;

    return (
        <Box sx={{ display: "flex", gap: 2.5 }}>
            {/* User profile */}
            <Box
                sx={{
                    width: 400,
                    p: 3,
                    backgroundColor: "white",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "border.dark",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    flexShrink: 0,
                }}
            >
                {/* Avatar */}
                <Avatar
                    src={user.profile_picture}
                    sx={{ width: 200, height: 200 }}
                />

                {/* Nombre */}
                <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center" }}>
                    {user.first_name} {user.last_name}
                </Typography>

                {/* Botón de mensaje */}
                <CustomButton
                    variant="contained"
                    variantstyle="outline"
                >
                    Mensaje
                </CustomButton>

                <Divider sx={{ width: "100%", borderColor: "rgba(0,0,0,0.1)" }} />

                {/* Estadísticas de horas */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 6 }}>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography>{user.time_sent?.hours || 0}</Typography>
                        <Typography variant="body2">horas ofrecidas</Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography>{user.time_received?.hours || 0}</Typography>
                        <Typography variant="body2">horas recibidas</Typography>
                    </Box>
                </Box>

                <Divider sx={{ width: "100%", borderColor: "rgba(0,0,0,0.1)" }} />

                {/* Información de contacto */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <MapPin size={24} />
                        <Typography>{user.location || "Ubicación no disponible"}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                        <Mail size={24} />
                        <Typography>{user.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Phone size={24} />
                        <Typography>{user.phone_number || "Teléfono no disponible"}</Typography>
                    </Box>
                </Box>
            </Box>

            {/*  Description */}
            {/* Componente de descripción (rellena el espacio sobrante) */}
            <Box
                sx={{
                    flex: 1,
                    border: "1px solid",
                    borderColor: "border.dark",
                    p: 3,
                    height: "fit-content",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    minWidth: 0,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h4">Sobre mí</Typography>
                </Box>
                <Divider />
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                    {user.description || "El usuario no ha añadido descripción"}
                </Typography>
            </Box>

        </Box>
    );
}
