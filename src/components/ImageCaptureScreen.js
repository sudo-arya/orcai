 // eslint-disable-next-line
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import { useEffect } from "react";


export default function ImageCaptureScreen({ images, setImages }) {
     // eslint-disable-next-line
    const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const sections = [
    "Labial Mucosa",
    "Right Buccal",
    "Left Buccal",
    "Palate",
    "Tongue",
    "Floor of Mouth",
  ];



  useEffect(() => {
    navigator.permissions.query({ name: "camera" })
      .then((result) => {
        console.log("Camera permission state:", result.state);
        if (result.state === "denied") {
          alert("Camera permission is denied. Please allow it in your browser settings.");
        }
      })
      .catch((error) => console.error("Permission query error:", error));

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        console.log("Camera access granted!", stream);
      })
      .catch((error) => {
        console.error("Camera access denied:", error);
        alert(`Camera access denied: ${error.message}`);
      });
  }, []);






  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera access granted!", stream);
      alert("Camera access granted!");
    } catch (error) {
      console.error("Camera access denied:", error);
      alert(`Error: ${error.message}`);
    }
  };





  const captureImage = (section) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages((prev) => ({ ...prev, [section]: imageSrc }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Capture Oral Images</h2>
      <button onClick={requestCameraAccess} className="px-3 py-2 bg-red-500 text-white rounded shadow">
  Request Camera Access
</button>

<Webcam
  ref={webcamRef}
  screenshotFormat="image/jpeg"
  className="w-80 h-80 border rounded shadow-lg mb-4"
  videoConstraints={{
    facingMode: "user", // or "environment"
  }}
  onUserMediaError={(err) => console.error("Webcam error:", err)}
/>


      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => (
          <div key={section} className="p-4 bg-white border rounded shadow text-center">
            <p className="font-semibold">{section}</p>
            {images[section] ? (
              <img src={images[section]} alt={section} className="w-20 h-20 mx-auto mt-2 rounded border" />
            ) : (
              <button
                className="mt-2 px-3 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                onClick={() => captureImage(section)}
              >
                Capture
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        className="bg-green-500 text-white px-5 py-2 mt-6 rounded-lg shadow hover:bg-green-600"
        onClick={() => navigate("/review")}
      >
        Review Images
      </button>
    </div>
  );
}
