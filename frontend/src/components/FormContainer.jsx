import { Box, Typography, Divider, Avatar, IconButton } from "@mui/material";


export default function FormContainer({
  title,
  handleSubmit,
  children, // extra fields
}) {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        border: "1px solid",
        borderColor: "border.dark",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h3" align="center">{title}</Typography>
      <Divider sx={{ borderColor: "border.default" }} />


      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </form>

    </Box>
  );
}
