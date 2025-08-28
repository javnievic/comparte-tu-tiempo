import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Box} from "@mui/material";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Box sx={{ height: 96 }} /> 
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
