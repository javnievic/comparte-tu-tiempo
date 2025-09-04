import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/UserProvider";
import CreateOffer from "./pages/CreateOffer";
import OfferList from "./pages/OfferList";
import { UIProvider } from "./contexts/UIProvider";
import LoginModal from "./components/LoginModal";

export default function App() {
  return (

    <Router>
      <UserProvider>
        <UIProvider>
          <Navbar />
          <Box sx={{ height: 96 }} />
          <Box
            sx={{
              px: "100px", // lateral margins
              maxWidth: "1440px", // optional, to not exceed a certain width
              mx: "auto", // center horizontally
            }}
          >
            <Routes>
              <Route path="/" element={<OfferList />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-offer" element={<CreateOffer />} />
            </Routes>
          </Box>
          <LoginModal />
        </UIProvider>
      </UserProvider>
    </Router>

  );
}
