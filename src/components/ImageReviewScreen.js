import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Webcam from "react-webcam";
import { UserContext } from "./UserContext";
import { useContext } from "react";

export default function ImageReviewScreen({ images, setImages }) {
  const webcamRef = useRef(null);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize navigate function
  const [recaptureSection, setRecaptureSection] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

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

  const uploadImages = async () => {
    setLoading(true); // Show loading screen
    setUploadStatus("Uploading images... Please wait.");

    const formData = new FormData();
    formData.append("user_name", userData?.name || "Test User");
    formData.append("age", userData?.age || "25");
    formData.append("gender", userData?.gender || "Male");
    formData.append("habits", userData?.habits || "None");

    await Promise.all(
      Object.entries(images).map(([section, image], index) =>
        fetch(image)
          .then((res) => res.blob())
          .then((blob) => {
            formData.append("images", new File([blob], `image_${index}.jpg`, { type: "image/jpeg" }));
          })
          .catch((error) => console.error("Error converting image:", error))
      )
    );

    try {
      const backendURL = "https://orcai.onrender.com"; // Replace with actual Render URL

const response = await fetch(`${backendURL}/upload`, {
  method: "POST",
  body: formData,
});


      const data = await response.json();

      if (response.ok) {
        setUploadStatus("✅ Images uploaded successfully!");
        setLoading(false);
        setAnalyzing(true);

        setTimeout(() => {
          setAnalyzing(false);
          navigate("/results"); // Redirect user after analysis
        }, 4000); // Wait for 4 seconds
      } else {
        setUploadStatus("❌ Failed to upload images. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus("❌ Error uploading images. Check your internet connection.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      {loading ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <p className="text-lg font-semibold">{uploadStatus}</p>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      ) : analyzing ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <p className="text-lg font-semibold">🔍 Analyzing using AI...</p>
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      ) : recaptureSection ? (
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

      {!recaptureSection && !loading && !analyzing && (
        <button className="bg-green-500 text-white px-5 py-2 mt-6 rounded-lg shadow hover:bg-green-600" onClick={uploadImages}>
          Upload & Finish
        </button>
      )}
    </div>
  );
}
