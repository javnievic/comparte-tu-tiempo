// src/pages/UserProfile.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Avatar,
    Divider,
    CircularProgress,
    Tabs,
    Tab
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import { getUserById } from "../services/userService";
import { getOffersByUser } from "../services/offerService"; // endpoint para ofertas del usuario
import CustomButton from "../components/CustomButton";
import { UserContext } from "../contexts/UserContext";
import OfferCard from "../components/OfferCard";


export default function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext);
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    // User offers
    const [offers, setOffers] = useState([]);
    const [offersLoading, setOffersLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

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

    useEffect(() => {
        if (tabValue === 1) { // Only fetch offers when the tab is selected
            const fetchOffers = async () => {
                try {
                    const data = await getOffersByUser(id);
                    setOffers(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setOffersLoading(false);
                }
            };
            fetchOffers();
        }
    }, [tabValue, id]);

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
    if (!user) return <Typography sx={{ textAlign: "center", mt: 5 }}>Usuario no encontrado</Typography>;

    const isOwner = currentUser && currentUser.id === user.id;

    return (
        <Box sx={{ display: "flex", gap: 2.5 }}>
            {/* Left profile */}
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
                    height: "fit-content",
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

                {/* Conditional buttons */}
                {currentUser && (
                    isOwner ? (
                        <CustomButton
                            variant="contained"
                            variantstyle="outline"
                            onClick={() => navigate(`/edit-profile`)}
                        >
                            Editar perfil
                        </CustomButton>
                    ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <CustomButton
                                variant="contained"
                                variantstyle="primary"
                            >
                                Enviar tiempo
                            </CustomButton>
                            <CustomButton
                                variant="contained"
                                variantstyle="outline"
                            >
                                Mensaje
                            </CustomButton>

                        </Box>
                    )
                )}

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

            {/* Right content with Tabs */}
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
                <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ mb: 2 }}>
                    <Tab label="Sobre mí" />
                    <Tab label="Ofertas" />
                    <Tab label="Demandas" />
                </Tabs>

                {tabValue === 0 && (
                    <Box>
                        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                            {user.description || "El usuario no ha añadido descripción"}
                        </Typography>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box sx={{
                        overflow: "hidden",
                    }}>
                        {offersLoading ? (
                            <CircularProgress sx={{ display: "block", mx: "auto", mt: 3 }} />
                        ) : !offers.length ? (
                            <Typography sx={{ mt: 2 }}>No hay ofertas publicadas.</Typography>
                        ) : (
                            <>
                                <Grid container spacing={2.5}>
                                    {offers.slice(0, visibleCount).map((offer) => (
                                        <Grid size={{ xs: 12, sm: 10, md: 6, lg: 4 }} key={offer.id}>
                                            <OfferCard offer={offer} isOwner={isOwner} />
                                        </Grid>
                                    ))}
                                </Grid>


                                {visibleCount < offers.length && (
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                        <CustomButton variant="contained" onClick={() => setVisibleCount((prev) => prev + 9)}>
                                            Cargar más
                                        </CustomButton>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                )}

                {tabValue === 2 && (
                    <Typography sx={{ mt: 2 }}>Aquí se mostrarán las demandas del usuario cuando estén disponibles.</Typography>
                )}
            </Box>
        </Box>
    );
}
