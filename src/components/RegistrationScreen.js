import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", gender: "", habits: [] });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (habit) => {
    setForm((prev) => ({
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
          <label className="inline-flex items-center ml-4">
            <input type="checkbox" onChange={() => handleCheckbox("Tobacco Use")} />
            <span className="ml-2">Tobacco Use</span>
          </label>
        </div>

        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          onClick={() => navigate("/capture")}
        >
          Next
        </button>
      </div>
    </div>
  );
}
