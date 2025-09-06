// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Avatar, CircularProgress } from "@mui/material";
import { getUserById } from "../services/userService"; // crea este servicio

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

  if (loading) return <CircularProgress />;
  if (!user) return <Typography>Usuario no encontrado</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600, mx: "auto" }}>
      <Avatar src={user.avatar} sx={{ width: 120, height: 120 }} />
      <Typography variant="h4">{user.first_name}</Typography>
      <Typography variant="body1">Rating: {user.rating || 0}/5</Typography>
      <Typography variant="body2">Tiempo ofrecido: {user.time_sent || 0}h</Typography>
      <Typography variant="body2">Tiempo recibido: {user.time_received || 0}h</Typography>
    </Box>
  );
}
