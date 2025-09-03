import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

export default function OfferList() {
    const navigate = useNavigate();

    // Handle redirect to offer creation page
    const handleCreateOffer = () => {
        navigate("/create-offer");
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Lista de ofertas
            </Typography>

            {/* Provisional button to create an offer */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOffer}
            >
                Crear oferta
            </Button>
        </Box>
    );
}
