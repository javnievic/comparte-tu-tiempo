// src/components/OfferCard.jsx
import { Card, CardContent, Box, Avatar, Typography, Tooltip, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/time";

export default function OfferCard({ offer, onClick }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(offer);
        } else {
            navigate(`/offers/${offer.id}`);
        }
    };

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 295,
                height: 384,
                overflow: "hidden",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer"
            }}
            onClick={handleClick}
        >
            {/* Image */}
            <Box
                sx={{
                    width: "100%",
                    height: 257, // fixed height
                    overflow: "hidden",
                    borderRadius: "0px 0px 20px 20px",
                }}
            >
                <Box
                    component="img"
                    src={offer.image || "https://placehold.co/295x257?text=Sin+Imagen"}
                    alt={offer.title}
                    loading="lazy"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // forces the image to fill the container
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                {/* User */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                    }}
                >
                    <Avatar
                        src={offer.user?.profile_picture || "https://placehold.co/28x28"}
                        sx={{ width: 28, height: 28, cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (offer.user?.id) navigate(`/users/${offer.user.id}`);
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{ cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (offer.user?.id) navigate(`/users/${offer.user.id}`);
                        }}
                    >
                        {(offer.user?.first_name && offer.user?.last_name) || "Usuario desconocido"}
                    </Typography>
                </Box>

                {/* Title */}
                <Tooltip title={offer.title} arrow placement="bottom-start">
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block", // ensures ellipsis works
                            maxWidth: "100%", // adapts to the card width
                        }}
                    >
                        {offer.title}
                    </Typography>
                </Tooltip>

                {/* Rating and Duration */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">{formatDuration(offer.duration) || "Sin duración"}</Typography>
                    <Typography variant="body2">·</Typography>
                    <Rating
                        name={`rating-${offer.id}`}
                        value={offer.rating || 0}
                        readOnly
                        precision={0.5} // For half
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
    );
}
