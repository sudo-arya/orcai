import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUpload, faRefresh } from "@fortawesome/free-solid-svg-icons";


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

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [facingMode, setFacingMode] = useState("user");
  const [cameraAccess, setCameraAccess] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    checkCameraAccess();
  }, []);

  const checkCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraAccess(true))
      .catch(() => setCameraAccess(false));
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages((prev) => ({ ...prev, [sections[currentSectionIndex]]: imageSrc }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => ({ ...prev, [sections[currentSectionIndex]]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextSection = () => {
    setCurrentSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center relative">
      {/* Instructions Popup */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-lg">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Instructions</h2>

            <ul className="text-gray-700 list-disc list-inside text-start">
  <li>Capture clear images of different oral sections.</li>
  <li>Use switch button to toggle between cameras.</li>
  <li>Ensure good lighting for better accuracy.</li>
</ul>

               <br/>

            <button
              className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setShowInstructions(false)}
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
        Capture Oral Images
      </h1>

      {/* Progress Indicator */}
      <p className="text-md font-semibold text-gray-600 mt-3">
        Sections : {currentSectionIndex+1} / {sections.length}
      </p>

      {/* Section Name */}
      <h2 className="text-2xl font-bold my-4 text-blue-600 text-center">
        {sections[currentSectionIndex]} Capture
      </h2>

      {/* Request Camera Access Button */}
      {cameraAccess === false && (
        <button
          className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 mb-4"
          onClick={checkCameraAccess}
        >
          Request Camera Access
        </button>
      )}
{/* Left Arrow (Previous Section) */}
{currentSectionIndex > 0 && (
          <button
            className="absolute left-3 top-1/2 transform -translate-y-24 bg-gray-800 text-white p-5 rounded-full z-40 hover:bg-gray-900 shadow-lg"
            onClick={prevSection}
          >
            ◀
          </button>
        )}
      {/* Camera Frame with Navigation Arrows */}
      <div className="relative w-80 h-96 bg-black rounded-lg shadow-lg overflow-hidden flex items-center justify-center">


        {/* Camera Feed */}
        {cameraAccess ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="absolute inset-0 w-full h-full object-cover"
            videoConstraints={{ facingMode }}
          />
        ) : (
          <p className="text-red-500 font-semibold mt-4">Camera access required!</p>
        )}

        {/* Right Arrow (Next Section) */}

      </div>
      {currentSectionIndex < sections.length - 1 && (
          <button
            className="absolute right-1 top-1/2 transform -translate-y-24 bg-gray-800 text-white p-5 rounded-full  z-40 hover:bg-gray-900 shadow-lg"
            onClick={nextSection}
          >
            ▶
          </button>
        )}
      {/* Controls */}
      <div className="mt-4 flex items-center gap-6">
        <button
          className="p-4 px-6 bg-green-600 text-white rounded-full shadow-lg text-2xl hover:bg-green-600"
          onClick={captureImage}
          disabled={!cameraAccess}
        >
          <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />

        </button>
        <label className="cursor-pointer p-4 px-6 bg-gray-500 text-white rounded-full shadow-lg text-2xl hover:bg-gray-600">
          <FontAwesomeIcon icon={faUpload} className="text-white text-2xl" />

          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <button
          className="p-4 px-6 bg-yellow-500 text-white rounded-full shadow-lg text-2xl hover:bg-yellow-600"
          onClick={toggleCamera}
          disabled={!cameraAccess}
        >
          <FontAwesomeIcon icon={faRefresh} className="text-white text-2xl" />
        </button>
      </div>

      {/* Captured Images with Section Number Overlay */}
      <div className="mt-6 w-full max-w-md overflow-x-auto whitespace-nowrap flex space-x-3 p-2 bg-white rounded-lg shadow-md">
        {Object.keys(images).length > 0 ? (
          Object.keys(images).map((section, index) => (
            <div key={section} className="relative w-24 h-24 flex-shrink-0 border rounded-lg overflow-hidden shadow">
              <img src={images[section]} alt={section} className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-br-lg">
                Section {index + 1}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No images captured yet.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          className="bg-indigo-500 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-600"
          onClick={() => navigate("/review")}
        >
          Review Images
        </button>
      </div>
    </div>
  );
}
