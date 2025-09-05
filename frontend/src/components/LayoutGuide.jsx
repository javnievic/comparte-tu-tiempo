import { Box } from "@mui/material";

export default function LayoutGuide({ show = false }) {
  if (!show) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // to not interfere with clicks
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "20px", // gutter
          width: "100%",
          maxWidth: "1440px",
          px: "100px",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              borderLeft: i === 0 ? "1px solid rgba(255,0,0,0.3)" : undefined,
              borderRight: "1px solid rgba(255,0,0,0.3)",
              height: "100%",
              backgroundColor: "rgba(255,0,0,0.05)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
