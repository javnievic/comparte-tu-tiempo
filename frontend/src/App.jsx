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
import OfferDetail from "./pages/OfferDetail";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import SendTimeForm from "./pages/SendTimeForm";
import MyTransactions from "./pages/MyTransactions";
import EditOffer from "./pages/EditOffer";
import Footer from "./components/Footer"

export default function App() {
  const showguide = false;

  return (
    <Router>
      <UserProvider>
        <UIProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh", // <-- ocupa toda la pantalla
            }}
          >
            <Navbar />
            <LayoutGuide show={showguide} />

            {/* Contenido principal */}
            <Box
              sx={{
                flex: 1, // <-- empuja el footer hacia abajo
                px: "100px",
                maxWidth: "1440px",
                mx: "auto",
                mt: 5,
                mb: 5,
                width: "100%",
              }}
            >
              <Routes>
                <Route path="/" element={<OfferList />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-offer" element={<CreateOffer />} />
                <Route path="/offers/:id" element={<OfferDetail />} />
                <Route path="offers/:id/edit" element={<EditOffer />} />
                <Route path="/users/:id" element={<UserProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/send-time/users/:userId" element={<SendTimeForm />} />
                <Route path="/send-time/offers/:offerId" element={<SendTimeForm />} />
                <Route path="/my-transactions" element={<MyTransactions />} />
              </Routes>
            </Box>

            <Footer /> 
            <LoginModal />
          </Box>
        </UIProvider>
      </UserProvider>
    </Router>
  );
}

