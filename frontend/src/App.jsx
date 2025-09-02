import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Box} from "@mui/material";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/UserProvider";
import CreateOffer from "./pages/CreateOffer";
import OfferList from "./pages/OfferList";

export default function App() {
  
  return (
    <Router>
      <UserProvider>
      <Navbar />
      <Box sx={{ height: 96 }} /> 
      <Routes>
        <Route path="/" element={<OfferList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-offer" element={<CreateOffer />} />
      </Routes>
      </UserProvider>
    </Router>
  );
}
