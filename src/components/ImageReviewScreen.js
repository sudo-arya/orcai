import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { UserContext } from "./UserContext";
import { useContext } from "react";


export default function ImageReviewScreen({ images, setImages }) {
//   const navigate = useNavigate();
  const webcamRef = useRef(null);
  const { userData } = useContext(UserContext);
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

  const [uploadStatus, setUploadStatus] = useState(""); // ✅ Move useState outside
  const uploadImages = async () => {
    setUploadStatus("Uploading images... Please wait."); // ✅ Update status

    const formData = new FormData();
    formData.append("user_name", userData?.name || "Test User");
formData.append("age", userData?.age || "25");
formData.append("gender", userData?.gender || 'Male');
formData.append("habits", userData?.habits || "None");


    // Convert Base64 images to Blob and add to FormData
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
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus("✅ Images uploaded successfully!");
        console.log("Upload Response:", data);
      } else {
        setUploadStatus("❌ Failed to upload images. Please try again.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus("❌ Error uploading images. Check your internet connection.");
    }
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
{uploadStatus && <p className="text-center text-lg font-semibold mt-4">{uploadStatus}</p>}

      {!recaptureSection && <button
  className="bg-green-500 text-white px-5 py-2 mt-6 rounded-lg shadow hover:bg-green-600"
  onClick={uploadImages} // Call upload function
>
  Upload & Finish
</button>
}
    </div>
  );
}
