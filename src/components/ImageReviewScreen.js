import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSync, faRefresh, faUpload } from "@fortawesome/free-solid-svg-icons"; // ✅ Imported faSync

export default function ImageReviewScreen({ images, setImages }) {
  const webcamRef = useRef(null);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [recaptureSection, setRecaptureSection] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [facingMode, setFacingMode] = useState("user"); // ✅ For switching camera

  const sections = [
    "Labial Mucosa",
    "Right Buccal",
    "Left Buccal",
    "Palate",
    "Tongue",
    "Floor of Mouth",
  ];

  // ✅ Capture new image for the selected section
  const captureNewImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages((prev) => ({ ...prev, [recaptureSection]: imageSrc }));
    setRecaptureSection(null);
  };

  // ✅ Upload the recaptured image (currently a placeholder)
  const uploadRecapturedImage = () => {
    alert("Recaptured image uploaded!"); // Replace with actual upload logic
  };

  // ✅ Toggle Camera (Front/Back)
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // ✅ Upload all images
  const uploadImages = async () => {
    setLoading(true);
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
      const backendURL = "https://orcai.onrender.com";
      const response = await fetch(`${backendURL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("✅ Images uploaded successfully!");
        setLoading(false);
        setAnalyzing(true);

        setTimeout(() => {
          setAnalyzing(false);
          navigate("/results");
        }, 4000);
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
    <div className="p-3 bg-gray-100 min-h-screen flex flex-col justify-center items-center" style={{
      backgroundImage:
        "url('https://thumbs.dreamstime.com/b/dentist-orthodontics-blue-seamless-pattern-line-icons-dental-care-medical-equipment-braces-tooth-prosthesis-floss-caries-120849082.jpg')",
      backgroundSize:"350px 350px",
    }}>
  <div className="py-6 px-2 bg-white shadow-lg rounded-lg w-full max-w-4xl text-center bg-opacity-90">
    <h2 className="text-2xl font-bold mb-4 text-center">Captured Images</h2>

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
      <div className="text-center flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Re-capturing: {recaptureSection}</h3>

        <div className="relative w-80 h-80 border rounded shadow-lg overflow-hidden">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode }}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 flex items-center gap-6">
          <button
            className="p-4 px-6 bg-green-600 text-white rounded-full shadow-lg text-2xl hover:bg-green-700"
            onClick={captureNewImage}
          >
            <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
          </button>
          <label className="cursor-pointer p-4 px-6 bg-gray-500 text-white rounded-full shadow-lg text-2xl hover:bg-gray-600">
            <FontAwesomeIcon icon={faUpload} className="text-white text-2xl" />
            <input type="file" accept="image/*" className="hidden" onChange={uploadRecapturedImage} />
          </label>
          <button
            className="p-4 px-6 bg-yellow-500 text-white rounded-full shadow-lg text-2xl hover:bg-yellow-600"
            onClick={switchCamera}
          >
            <FontAwesomeIcon icon={faRefresh} className="text-white text-2xl" />
          </button>
        </div>
      </div>
    ) : (
      <div className="w-full overflow-x-auto whitespace-nowrap py-4 ">
        <div className="flex space-x-4">
          {sections.map((section) => (
            <div key={section} className="bg-white border rounded shadow-lg text-center flex-shrink-0 w-80 relative p- ">
              <p className="font-semibold p-2 bg-gray-200 rounded-t-lg">{section}</p>
              <div className="relative">
                <img src={images[section]} alt={section} className="w-full mx-auto rounded border" />
                <button
                  className="absolute bottom-2 right-32 bg-green-600 p-2 px-5 text-white shadow-lg hover:bg-red-600 rounded-full"
                  onClick={() => setRecaptureSection(section)}
                >
                  <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {!recaptureSection && !loading && !analyzing && (
      <button className="bg-indigo-500 text-white px-5 py-2 mt-4 rounded-lg shadow-lg hover:bg-green-600" onClick={uploadImages}>
        Upload & Finish
      </button>
    )}
  </div>
</div>
  );
}
