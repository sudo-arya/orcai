import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle, faCircleDot, faShieldAlt, faTimes } from "@fortawesome/free-solid-svg-icons"; // Use 'faCheck' instead if needed

export default function HomeScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const guidelines = [
    { text: "Ensure proper lighting for clear image capture.", icon: <FontAwesomeIcon icon={faCircleDot} className="text-indigo-500 text-sm" /> },
    { text: "Hold the camera steady to avoid blurriness.", icon: <FontAwesomeIcon icon={faCircleDot} className="text-indigo-500 text-sm" /> },
    { text: "Make sure the entire oral cavity is visible.", icon: <FontAwesomeIcon icon={faCircleDot} className="text-indigo-500 text-sm" /> },
    { text: "Do not share images with personal identifiers.", icon: <FontAwesomeIcon icon={faCircleDot} className="text-indigo-500 text-sm" /> },
    { text: "All images are encrypted for secure storage.", icon: <FontAwesomeIcon icon={faCircleDot} className="text-indigo-500 text-sm" /> },
  ];

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-blue-100">
  {/* Blurred Background */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://thumbs.dreamstime.com/b/dentist-orthodontics-blue-seamless-pattern-line-icons-dental-care-medical-equipment-braces-tooth-prosthesis-floss-caries-120849082.jpg')",
      backgroundSize: "350px 350px",
      filter: "blur(1px)", // ✅ Correct way to blur
    }}
  ></div>

  {/* Main Content */}
  <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-xl text-center">
    <h1 className="text-3xl font-bold mb-2 text-[#2189c6]">ORCAI App</h1>
    <h3 className="text-xl font-semibold mb-4 text-[#2189c6]">
      (AI-Based Oral Screening)
    </h3>

    <div className="mt-6 flex flex-col space-y-3 w-72">
      <button
        className="px-6 py-3 bg-[#2189c6] text-white rounded-lg text-lg shadow-lg transition transform hover:scale-105"
        onClick={() => navigate("/register")}
      >
        Scan Now
      </button>

      <button
        className="px-6 py-3 bg-purple-800 bg-opacity-80 text-white rounded-lg text-lg shadow-lg transition transform hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        Guidelines
      </button>

    </div>
    <div className=" text-gray-600 text-base mt-6 ">
    Powered by <span className="font-semibold text-[#2189c6]">KlusterMedAi</span>
  </div>
  </div>

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 flex z-20 items-end justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-t-3xl bg-opacity-90 p-6 shadow-lg transition-transform transform translate-y-0">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#2189c6]"> Guidelines</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>
        <ul className="mt-4 space-y-3">
          {guidelines.map((guide, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-700">
              {guide.icon}
              {guide.text}
            </li>
          ))}
        </ul>
        <button
          className="mt-6 w-full bg-[#2189c6] text-white py-2 rounded-lg shadow-lg hover:bg-blue-700"
          onClick={() => setShowModal(false)}
        >
          Got it!
        </button>
      </div>
    </div>
  )}

  {/* Powered by KlusterMedAi */}

</div>


  );
}
