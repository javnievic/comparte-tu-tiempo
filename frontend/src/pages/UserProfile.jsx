// src/pages/UserProfile.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams  } from "react-router-dom";
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
import { getOffersByUser } from "../services/offerService"; // endpoint for user offers
import CustomButton from "../components/CustomButton";
import { UserContext } from "../contexts/UserContext";
import OfferCard from "../components/OfferCard";
import { deleteOffer } from "../services/offerService";
import { formatDuration } from "../utils/time";

export default function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = parseInt(searchParams.get("tab")) || 0;
    const [tabValue, setTabValue] = useState(initialTab);
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
        const tabFromUrl = parseInt(searchParams.get("tab"));
        if (!isNaN(tabFromUrl) && tabFromUrl !== tabValue) {
            setTabValue(tabFromUrl);
        }
    }, [searchParams, tabValue]);

    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
        setSearchParams({ tab: newValue }); // actualiza la URL
    };

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

    const handleDeleteOffer = async (offerId) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta oferta?")) return;

        try {
            await deleteOffer(offerId);
            setOffers((prev) => prev.filter((o) => o.id !== offerId));
        } catch (error) {
            console.error(error);
        }
    };

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

                {/* Name */}
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
                                onClick={() => navigate(`/send-time/users/${user.id}`)}
                            >
                                Enviar tiempo
                            </CustomButton>
                            {/*TODO
                            <CustomButton
                                variant="contained"
                                variantstyle="outline"
                            >
                                Mensaje
                            </CustomButton>*/}

                        </Box>
                    )
                )}

                <Divider sx={{ width: "100%", borderColor: "rgba(0,0,0,0.1)" }} />

                {/* Hour statistics */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    {/* Top row: time sent & received */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 6 }}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography sx={{ color: "red", fontWeight: 600 }}>
                                ⬆ -{formatDuration(user.time_sent)}
                            </Typography>
                            <Typography variant="body2">Tiempo enviado</Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography sx={{ color: "green", fontWeight: 600 }}>
                                ⬇ +{formatDuration(user.time_received)}
                            </Typography>
                            <Typography variant="body2">Tiempo recibido</Typography>
                        </Box>
                    </Box>

                    {/* Balance */}
                    <Box
                        sx={{
                            textAlign: "center",
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor:
                                user.balance.startsWith("-") ? "rgba(255,0,0,0.1)" :
                                    user.balance === "0h 0min" ? "rgba(0,0,0,0.05)" :
                                        "rgba(0,128,0,0.1)",
                            minWidth: 150,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: "1.6rem",
                                color:
                                    user.balance.startsWith("-") ? "red" :
                                        user.balance === "0h 0min" ? "black" :
                                            "green",
                            }}
                            title="Balance = Tiempo recibido - Tiempo enviado"
                        >
                            ⚖ {user.balance.startsWith("-") ? "" : "+"}{user.balance}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                            Balance total
                        </Typography>
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
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Sobre mí" />
                    <Tab label="Ofertas" />
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
                                            <OfferCard
                                                offer={offer}
                                                isOwner={isOwner}
                                                onDelete={() => handleDeleteOffer(offer.id)}
                                            />
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
            </Box>
        </Box>
    );
}
