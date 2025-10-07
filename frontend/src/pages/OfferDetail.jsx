// src/pages/OfferDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import CustomButton from "../components/CustomButton";
import { formatDuration } from "../utils/time";
import { MapPin } from 'lucide-react';
import { getOfferById } from "../services/offerService";
import UserCard from "../components/UserCard";
import { UserContext } from "../contexts/UserContext";
import { UIContext } from "../contexts/UIContext";


export default function OfferDetail() {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext);
    const { openLoginModal } = useContext(UIContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const data = await getOfferById(id);
                setOffer(data);
            } catch (error) {
                console.error("Error al obtener la oferta:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffer();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!offer) {
        return <Typography>Oferta no encontrada</Typography>;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2.5 }}>
                {/* Offer image */}
                <Box>
                    <img
                        src={offer.image || "https://placehold.co/610x532"}
                        alt={offer.title}
                        style={{
                            width: 610,
                            height: 532,
                            borderRadius: 20,
                            objectFit: "cover",
                        }}
                    />
                </Box>

                {/* Offer information */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                        minWidth: 0,
                    }}
                >
                    {/* Main data */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                            }}
                        >
                            {offer.title}
                        </Typography>

                        {/*TODO <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body1">{offer.rating || 0}/</Typography>
                            <Typography variant="body1" sx={{ color: "rgba(0,0,0,0.6)" }}>5</Typography>
                        </Box>
                        */}
                        <Typography variant="h3">{formatDuration(offer.duration) || "Sin duración"}</Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <MapPin size={32} />
                            <Typography
                                variant="h4"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    minWidth: 0,
                                }}
                            >
                                {offer.is_online && offer.location
                                    ? `Online o ${offer.location}`
                                    : offer.is_online
                                    ? "Online"
                                    : offer.location || "Presencial"}
                            </Typography>
                        </Box>

                        <CustomButton
                            variant="contained"
                            variantstyle="primary"
                            sx={{ width: "fit-content" }}
                            onClick={() => {
                                if (!currentUser) {
                                    openLoginModal();
                                    return;
                                }
                                if (currentUser.id === offer.user.id) {
                                    navigate(`/offers/${offer.id}/edit`);
                                } else {
                                    navigate(`/send-time/offers/${offer.id}`);
                                }
                            }}
                        >
                            {currentUser?.id === offer.user.id ? "Editar oferta" : "Enviar tiempo"}
                        </CustomButton>
                    </Box>

                    {/* User data */}
                    <UserCard user={offer.user} />
                </Box>
            </Box>
            <Box
                sx={{ maxWidth: 610, alignSelf: "flex-start", }}
            >
                <Typography variant="h5" sx={{ mb: 1 }}>
                    Detalles del servicio
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {offer.description || "Sin descripción"}
                </Typography>
            </Box>
        </Box>
    );
}
