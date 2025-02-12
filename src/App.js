import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import RegistrationScreen from "./components/RegistrationScreen";
import ImageCaptureScreen from "./components/ImageCaptureScreen";
import ImageReviewScreen from "./components/ImageReviewScreen";
import { useState } from "react";

export default function App() {
  const [images, setImages] = useState({});
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/register" element={<RegistrationScreen />} />
        <Route path="/capture" element={<ImageCaptureScreen images={images} setImages={setImages} />} />
        <Route path="/review" element={<ImageReviewScreen images={images} setImages={setImages} />} />
      </Routes>
    </Router>
  );
}
