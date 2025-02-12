 // eslint-disable-next-line
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import RegistrationScreen from "./components/RegistrationScreen";
import ImageCaptureScreen from "./components/ImageCaptureScreen";
import ImageReviewScreen from "./components/ImageReviewScreen";
import RessultScreen from "./components/ResultScreen";
import { useState } from "react";
import { UserProvider } from "./components/UserContext";

export default function App() {
  const [images, setImages] = useState({});
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/register" element={<RegistrationScreen />} />
        <Route path="/capture" element={<ImageCaptureScreen images={images} setImages={setImages} />} />
        <Route path="/review" element={<ImageReviewScreen images={images} setImages={setImages} />} />
        <Route path="/results" />
      </Routes>
    </Router>
    </UserProvider>
  );
}
