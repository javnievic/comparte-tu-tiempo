import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Box} from "@mui/material";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  
  return (
    <Router>
      <UserProvider>
      <Navbar />
      <Box sx={{ height: 96 }} /> 
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
      </UserProvider>
    </Router>
  );
}
