import { useEffect, useState } from "react";
import { Alert } from "@mui/material";

export default function ErrorMessage({ message, position = "top", duration = 5000 }) {
  const [visible, setVisible] = useState(!!message);
  console.log(visible);
  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  // estilos dinámicos según posición
  const positions = {
    top: { top: 16, left: "50%", transform: "translateX(-50%)" },
    bottom: { bottom: 16, left: "50%", transform: "translateX(-50%)" },
    topRight: { top: 16, right: 16 },
    topLeft: { top: 16, left: 16 },
    bottomRight: { bottom: 16, right: 16 },
    bottomLeft: { bottom: 16, left: 16 },
  };

  return (
    <Alert
      severity="error"
      sx={{
        position: "fixed",
        zIndex: 1300, // Always above
        width: "auto",
        maxWidth: 400,
        borderRadius: 2,
        fontSize: "0.95rem",
        fontWeight: 500,
        transition: "opacity 0.5s ease",
        ...positions[position],
      }}
    >
      {message}
    </Alert>
  );
}
