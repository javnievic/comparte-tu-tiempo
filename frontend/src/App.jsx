import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/UserProvider";
import CreateOffer from "./pages/CreateOffer";
import OfferList from "./pages/OfferList";
import { UIProvider } from "./contexts/UIProvider";
import LoginModal from "./components/LoginModal";
import LayoutGuide from "./components/LayoutGuide";

export default function App() {
  const showguide = false; // Set to true to show the layout guide
  return (

    <Router>
      <UserProvider>
        <UIProvider>
          <Navbar />
          <Box sx={{ height: 96 }} />
          <LayoutGuide show={showguide} />
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
