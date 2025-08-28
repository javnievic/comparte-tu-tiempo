import { Button, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme, variantstyle }) => {
  const baseStyles = {
    borderRadius: "62px",
    fontSize: "20px",
    fontWeight: 600,
    padding: "12px 25px",
    textTransform: "none",
    boxShadow: "none",
  };

  const variants = {
    primary: {
      background: "linear-gradient(90deg, #6DD6C1 0%, #20ADBB 100%)",
      color: "#fff",
      "&:hover": {
        background: "linear-gradient(90deg, #5cc1ac 0%, #1a99a6 100%)",
      },
    },
    outline: {
      background: "transparent",
      color: theme.palette.primary.main,
      border: `2px solid ${theme.palette.primary.main}`,
      "&:hover": {
        background: theme.palette.primary.main,
        color: "#fff",
      },
    },
    success: {
      background: theme.palette.success.main,
      color: "#fff",
      "&:hover": {
        background: "#43a047",
      },
    },
    error: {
      background: theme.palette.error.main,
      color: "#fff",
      "&:hover": {
        background: "#d32f2f",
      },
    },
    warning: {
      background: "#FFC633",
      color: "#000",
      "&:hover": {
        background: "#e6b02e",
      },
    },
  };

  return {
    ...baseStyles,
    ...(variants[variantstyle] || variants.primary),
  };
});

export default CustomButton;
