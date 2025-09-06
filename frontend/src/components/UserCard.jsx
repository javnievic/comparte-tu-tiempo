// src/components/UserCard.jsx
import { Box, Typography, Avatar, Divider } from "@mui/material";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/time";

export default function UserCard({ user }) {
    const navigate = useNavigate();

    const goToProfile = () => {
        if (!user?.id) return;
        navigate(`/users/${user.id}`);
    };

    return (
        <Box
            sx={{
                display: "flex",
                gap: 5,
                p: 2.5,
                background: "white",
                boxShadow: "0px 0px 4px rgba(0,0,0,0.25)",
                borderRadius: 2,
                mt: 2,
                width: "400px",
                flexShrink: 0,
                overflow: "hidden",
            }}
        >
            {/* Avatar and message */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "200px" }}>
                <Avatar
                    src={user?.avatar || "https://placehold.co/80x80"}
                    sx={{ width: 80, height: 80, cursor: "pointer" }} onClick={goToProfile}
                />
                <Typography variant="body1" sx={{ cursor: "pointer" }} onClick={goToProfile}>
                    {user?.first_name || "Usuario desconocido"}
                </Typography>
                <CustomButton variantstyle="outline" variant="contained" sx={{ width: "fit-content" }}>
                    Mensaje
                </CustomButton>
            </Box>

            {/* Statistics */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1, justifyContent: "center", position: "sticky", }}>
                <Typography variant="body1">
                    {user?.rating || 0}/5
                </Typography>
                <Divider />
                <Box>
                    <Typography variant="body1">
                        {user?.time_sent ? formatDuration(user.time_sent) : "0h"}
                    </Typography>
                    <Typography variant="body2">tiempo ofrecido</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography variant="body1">
                        {user?.time_received ? formatDuration(user.time_received) : "0h"}
                    </Typography>
                    <Typography variant="body2">tiempo recibido</Typography>
                </Box>

            </Box>
        </Box>
    );
}
