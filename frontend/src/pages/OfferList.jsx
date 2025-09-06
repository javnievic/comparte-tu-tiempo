// src/pages/Offers.jsx
import { useEffect, useState } from "react";
import { getAllOffers } from "../services/offerService";
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Divider,
} from "@mui/material";
import CustomButton from "../components/CustomButton";
import OfferCard from "../components/OfferCard";

export default function OfferList() {

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

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
        <Box>
            <Typography variant="h1" sx={{ mb: 3, fontWeight: "bold" }}>
                Ofertas
            </Typography>


            <Box sx={{ display: "flex", gap: 2.5 }}>
                <Box
                    sx={{
                        width: "295px",
                        flexShrink: 0,
                        border: "1px solid",
                        borderColor: "border.dark",
                        p: 3,
                        height: "fit-content",
                        mx: "auto",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h4"
                        >
                            Filtros
                        </Typography>
                    </Box>
                    <Divider />
                    <Typography
                        variant="h5"
                    >
                        Categorías
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2.5}>
                        {offers.slice(0, visibleCount).map((offer) => (
                            <Grid size={{ xs: 12, sm: 10, md: 6, lg: 4 }} key={offer.id}>
                                <OfferCard offer={offer} />
                            </Grid>
                        ))}
                    </Grid>
                    {visibleCount < offers.length && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <CustomButton variant="contained" onClick={() => setVisibleCount(prev => prev + 9)}>
                                Cargar más
                            </CustomButton>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
