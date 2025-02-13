// eslint-disable-next-line
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { UserContext } from "./UserContext";
import { useContext, useEffect } from "react";

export default function ImageCaptureScreen({ images, setImages }) {
  // eslint-disable-next-line
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [uploadingSection, setUploadingSection] = useState(null);

  const sections = [
    "Labial Mucosa",
    "Right Buccal",
    "Left Buccal",
    "Palate",
    "Tongue",
    "Floor of Mouth",
  ];

  useEffect(() => {
    navigator.permissions
      .query({ name: "camera" })
      .then((result) => {
        console.log("Camera permission state:", result.state);
        if (result.state === "denied") {
          alert(
            "Camera permission is denied. Please allow it in your browser settings."
          );
        }
      })
      .catch((error) => console.error("Permission query error:", error));

    navigator.mediaDevices
      .getUserMedia({ video: true })
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
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

  const handleImageUpload = (event, section) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => ({ ...prev, [section]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
  className="min-h-screen flex flex-col items-center justify-center bg-blue-100 bg-repeat"
  style={{
    backgroundImage:
      "url('https://thumbs.dreamstime.com/b/dentist-orthodontics-blue-seamless-pattern-line-icons-dental-care-medical-equipment-braces-tooth-prosthesis-floss-caries-120849082.jpg')",
    backgroundSize: "350px 350px",
  }}
>
  <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl text-center w-full max-w-lg">
    <h2 className="text-3xl font-bold mb-4 text-[#2189c6]">
      Capture or Upload Oral Image
    </h2>

    {/* AI Tips Section */}
    <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 w-full text-center rounded-lg">
      <p className="text-sm font-semibold">
        AI Tips: Ensure proper lighting and image clarity for best results.
      </p>
    </div>

    {/* Request Camera Access Button */}
    <button
      onClick={requestCameraAccess}
      className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg shadow-lg transition transform hover:scale-105 mb-4"
    >
      Request Camera Access
    </button>

    {/* Webcam Component */}
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="w-80 h-80 border rounded-lg shadow-lg mb-4"
      videoConstraints={{ facingMode: "user" }}
      onUserMediaError={(err) => console.error("Webcam error:", err)}
    />

    {/* Image Capture & Upload Options */}
    <div className="grid grid-cols-2 gap-4">
      {sections.map((section) => (
        <div
          key={section}
          className="p-4 bg-white bg-opacity-90 border rounded-lg shadow-lg text-center"
        >
          <p className="font-semibold text-[#2189c6]">{section}</p>

          {images[section] ? (
            <img
              src={images[section]}
              alt={section}
              className="w-20 h-20 mx-auto mt-2 rounded border"
            />
          ) : (
            <>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg transition transform hover:scale-105"
                onClick={() => captureImage(section)}
              >
                Take a Photo
              </button>
              <label className="mt-2 block text-sm text-gray-700 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleImageUpload(event, section)}
                />
                <span className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg transition transform hover:scale-105">
                  Upload from Gallery
                </span>
              </label>
            </>
          )}
        </div>
      ))}
    </div>

    {/* Placeholder for future Adjust & Crop feature */}
    <button
      className="bg-purple-500 text-white px-6 py-3 mt-4 rounded-lg shadow-lg transition transform hover:scale-105"
      onClick={() => alert("Adjust & Crop feature coming soon!")}
    >
      Adjust & Crop
    </button>

    {/* Navigate to Review Images */}
    <button
      className="bg-green-500 text-white px-6 py-3 mt-6 rounded-lg shadow-lg transition transform hover:scale-105"
      onClick={() => navigate("/review")}
    >
      Review Images
    </button>
  </div>
</div>
  );
}
