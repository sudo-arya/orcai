import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Oral Cavity Imaging App</h1>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-lg transition transform hover:scale-105"
        onClick={() => navigate("/register")}
      >
        Get Started
      </button>
    </div>
  );
}
