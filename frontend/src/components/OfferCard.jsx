// src/components/OfferCard.jsx
import {
    Card,
    CardContent,
    Box,
    Avatar,
    Typography,
    Tooltip,
    Rating,
    IconButton,
    Menu,
    MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { formatDuration } from "../utils/time";

export default function OfferCard({ offer, onClick, isOwner = false, onDelete = false }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);


    const handleClick = () => {
        if (onClick) {
            onClick(offer);
        } else {
            navigate(`/offers/${offer.id}`);
        }
    };

    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        navigate(`/offers/${offer.id}/edit`);
    };

    return (
        <Card
            sx={{
                width: { xs: "295px", md: "100%" },
                maxWidth: 295,
                minWidth: 205,
                height: 384,
                overflow: "hidden",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative"
            }}
            onClick={handleClick}
        >
            {isOwner && (
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                    <IconButton size="small" onClick={handleMenuOpen}
                        sx={{
                            backgroundColor: "rgba(0, 0, 0, 0.23)",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                            color: "#fff"
                        }}>
                        <MoreVert />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MenuItem onClick={handleEdit}>Editar</MenuItem>
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            if (onDelete) onDelete();
                        }}>
                            Eliminar
                        </MenuItem>
                    </Menu>
                </Box>
            )}
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
                        {offer.user
                            ? `${offer.user.first_name || ""} ${offer.user.last_name || ""}`.trim() || "Usuario desconocido"
                            : "Usuario desconocido"}
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
