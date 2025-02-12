import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

export default function ImageReviewScreen({ images, setImages }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [recaptureSection, setRecaptureSection] = useState(null);

  const sections = [
    "Labial Mucosa",
    "Right Buccal",
    "Left Buccal",
    "Palate",
    "Tongue",
    "Floor of Mouth",
  ];

  const captureNewImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages((prev) => ({ ...prev, [recaptureSection]: imageSrc }));
    setRecaptureSection(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Review Captured Images</h2>

      {recaptureSection ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Re-capturing: {recaptureSection}</h3>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-80 h-80 border rounded shadow-lg mx-auto" />
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600" onClick={captureNewImage}>
            Capture Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section) => (
            <div key={section} className="p-4 bg-white border rounded shadow text-center">
              <p className="font-semibold">{section}</p>
              <img src={images[section]} alt={section} className="w-20 h-20 mx-auto mt-2 rounded border" />
              <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600" onClick={() => setRecaptureSection(section)}>
                Re-Capture
              </button>
            </div>
          ))}
        </div>
      )}

      {!recaptureSection && <button className="bg-green-500 text-white px-5 py-2 mt-6 rounded-lg shadow hover:bg-green-600" onClick={() => navigate("/")}>Finish</button>}
    </div>
  );
}
