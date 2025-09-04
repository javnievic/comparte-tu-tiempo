// src/pages/Offers.jsx
import { useEffect, useState } from "react";
import { getAllOffers } from "../services/offerService";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import { Rating } from "@mui/material";

export default function OfferList() {
    const navigate = useNavigate();

    // Handle redirect to offer creation page
    const handleCreateOffer = () => {
        navigate("/create-offer");
    };
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await getAllOffers();
                setOffers(data);
            } catch (error) {
                console.error("Error al obtener ofertas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" sx={{ mb: 3, fontWeight: "bold" }}>
                Ofertas
            </Typography>

            {/* Provisional button to create an offer */}
            <CustomButton
                variant="contained"
                color="primary"
                onClick={handleCreateOffer}
            >
                Crear oferta
            </CustomButton>

            <Grid container spacing={2.5}>
                {offers.map((offer) => (
                    <Grid item xs={12} sm={6} md={4} key={offer.id}>
                        <Card
                            sx={{
                                width: 295,   
                                height: 384,  
                                overflow: "hidden",
                                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Imagen */}
                            <Box
                                component="img"
                                src={
                                    offer.image ||
                                    "https://placehold.co/295x257?text=Sin+Imagen"
                                }
                                alt={offer.title}
                                sx={{
                                    width: "100%",
                                    height: 257,
                                    objectFit: "cover",
                                    borderRadius: "0px 0px 20px 20px",
                                }}
                            />

                            <CardContent sx={{ flexGrow: 1 }}>
                                {/* Usuario */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                   
                                    }}
                                >
                                    <Avatar
                                        src={offer.user?.avatar || "https://placehold.co/28x28"}
                                        sx={{ width: 28, height: 28 }}
                                    />
                                    <Typography variant="body2">
                                        {offer.user?.first_name || "Usuario desconocido"}
                                    </Typography>
                                </Box>

                                {/* Título */}
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, mb: 1 }}
                                >
                                    {offer.title}
                                </Typography>

                                {/* Rating and Duration */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2">{offer.duration || "Sin duración"}</Typography>
                                    <Typography variant="body2">·</Typography>
                                    <Rating
                                        name={`rating-${offer.id}`}
                                        value={offer.rating || 0}
                                        readOnly
                                        precision={0.5} // For half stars if you want
                                        size="small"
                                    />
                                    <Typography variant="body2">
                                        {offer.rating ? `${offer.rating}/5` : "Sin rating"}
                                    </Typography>
                                </Box>

                                {/* Online / Local */}
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {offer.is_online ? "Online" : offer.location || "Presencial"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
