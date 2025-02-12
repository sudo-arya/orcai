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
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
  <div className="bg-white p-6 rounded-lg shadow-lg w-80">
    <h2 className="text-xl font-semibold text-center mb-4">Patient Registration</h2>

    <input
      type="text"
      name="name"
      placeholder="Full Name"
      className="w-full p-2 mb-3 border rounded"
      onChange={handleChange}
    />

    <input
      type="number"
      name="age"
      placeholder="Age"
      className="w-full p-2 mb-3 border rounded"
      onChange={handleChange}
    />

    <select
      name="gender"
      className="w-full p-2 mb-3 border rounded"
      onChange={handleChange}
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    <div className="mb-4">
      <label className="block font-medium">Habits:</label>
      <label className="inline-flex items-center mt-2">
        <input type="checkbox" onChange={() => handleCheckbox("Smoking")} />
        <span className="ml-2">Smoking</span>
      </label>
      <label className="inline-flex items-center ml-3">
        <input type="checkbox" onChange={() => handleCheckbox("Tobacco")} />
        <span className="ml-2">Tobacco</span>
      </label>
      <label className="inline-flex items-center ml-3">
        <input type="checkbox" onChange={() => handleCheckbox("Alcohol")} />
        <span className="ml-2">Alcohol</span>
      </label>
    </div>

    {/* User Consent Checkbox */}
    <div className="mb-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={consent}
          onChange={() => setConsent(!consent)}
          className="mr-2"
        />
        <span className="text-sm text-gray-700">
          I consent to the collection of my personal and health data.
        </span>
      </label>
    </div>

    <button
      className={`w-full px-4 py-2 rounded shadow ${consent ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 cursor-not-allowed'}`}
      onClick={() => navigate("/capture")}
      disabled={!consent}
    >
      Next
    </button>
  </div>
</div>

  );
}
