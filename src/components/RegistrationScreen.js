import { useContext } from "react";
import { useState } from "react"; // Ensure useState is imported
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function RegistrationScreen() {
    const [consent, setConsent] = useState(false);

  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (habit) => {
    setUserData((prev) => ({
      ...prev,
      habits: prev.habits.includes(habit)
        ? prev.habits.filter((h) => h !== habit)
        : [...prev.habits, habit],
    }));
  };

  return (
    <div
  className="h-screen flex flex-col items-center justify-center bg-blue-100 bg-repeat"
  style={{
    backgroundImage:
      "url('https://thumbs.dreamstime.com/b/dentist-orthodontics-blue-seamless-pattern-line-icons-dental-care-medical-equipment-braces-tooth-prosthesis-floss-caries-120849082.jpg')",
    backgroundSize: "350px 350px",
  }}
>
  <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl text-center w-80">
    <h2 className="text-2xl font-bold mb-4 text-[#2189c6]">Patient Registration</h2>

    <input
      type="text"
      name="name"
      placeholder="Full Name"
      className="w-full p-3 mb-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2189c6]"
      onChange={handleChange}
    />

    <input
      type="number"
      name="age"
      placeholder="Age"
      className="w-full p-3 mb-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2189c6]"
      onChange={handleChange}
    />

    <select
      name="gender"
      className="w-full p-3 mb-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2189c6]"
      onChange={handleChange}
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    {/* User Consent Checkbox */}
    <div className="mb-4 flex items-center text-left">
      <input
        type="checkbox"
        checked={consent}
        onChange={() => setConsent(!consent)}
        className="mr-2 w-4 h-4"
      />
      <span className="text-sm text-gray-700">
        I consent to the collection of my personal and health data.
      </span>
    </div>

    <button
      className={`w-full px-4 py-3 rounded-lg text-white text-lg shadow-lg transition transform hover:scale-105 ${consent ? 'bg-[#2189c6] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
      onClick={() => navigate("/capture")}
      disabled={!consent}
    >
      Next
    </button>
  </div>
</div>


  );
}
