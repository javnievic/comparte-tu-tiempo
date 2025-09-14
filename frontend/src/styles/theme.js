import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6DD6C1",
    },
    secondary: {
      main: "#20ADBB",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#E76F51",
    },
    error: {
      main: "#E53935",
    },
    text: {
      primary: "#1C1C1C",
    },
    border: {
      default: "#D9D9D9", // Default borders
      dark: "#B3B3B3",    // Darker borders
    },
  },
  typography: {
    fontFamily: "'Titillium Web', sans-serif",
    h1: { fontSize: "64px", fontWeight: 600 }, // main titles / cover pages
    h2: { fontSize: "48px", fontWeight: 600 }, // highlighted subtitles
    h3: { fontSize: "36px", fontWeight: 600 }, // intermediate headers
    h4: { fontSize: "28px", fontWeight: 600 }, // secondary sections
    h5: { fontSize: "20px", fontWeight: 600 }, // minor headers
    body1: { fontSize: "16px", fontWeight: 400 }, // main text / descriptions
    body2: { fontSize: "12px", fontWeight: 400 }, // notes / labels
    button: { fontSize: "20px", fontWeight: 600, textTransform: "none" }, // buttons
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "16px", 
        },
      },
    },
  },
});

export default theme;
