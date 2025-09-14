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

export default function App() {
  const showguide = false; // Set to true to show the layout guide
  return (

    <Router>
      <UserProvider>
        <UIProvider>
          <Navbar />
          <LayoutGuide show={showguide} />
          <Box
            sx={{
              px: "100px", // lateral margins
              maxWidth: "1440px", // optional, to not exceed a certain width
              mx: "auto", // center horizontally
              mt: 5,
            }}
          >
            <Routes>
              <Route path="/" element={<OfferList />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-offer" element={<CreateOffer />} />
              <Route path="/offers/:id" element={<OfferDetail />} />
              <Route path="/users/:id" element={<UserProfile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              {/* userId mandatory and offerId is passed as a query param */}
              <Route path="/send-time/users/:userId" element={<SendTimeForm />} />
              <Route path="/send-time/offers/:offerId" element={<SendTimeForm />} />
              <Route path="/my-transactions" element={<MyTransactions />} />
            </Routes>
          </Box>
          <Box sx={{ height: 96 }} />
          {/*<footer>
            <Box sx={{ height: 96 }} />
          </footer>*/}
          <LoginModal />
        </UIProvider>
      </UserProvider>
    </Router>

  );
}
