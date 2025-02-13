import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-blue-100 bg-repeat"
      style={{
        backgroundImage:
          "url('https://thumbs.dreamstime.com/b/dentist-orthodontics-blue-seamless-pattern-line-icons-dental-care-medical-equipment-braces-tooth-prosthesis-floss-caries-120849082.jpg')",
        backgroundSize:"350px 350px",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-90 text-[#2189c6]">ORCAI App</h1>
        <h3 className="text-2xl font-semibold mb-6 text-blue-80 text-[#2189c6]">
          AI-Based Oral Screening
        </h3>

        <div className="mt-6 flex flex-col space-y-4 w-64">
          <button
            className="px-6 py-3 bg-blue-60 bg-[#2189c6] text-white rounded-lg text-lg shadow-lg transition transform hover:scale-105"
            onClick={() => navigate("/register")}
          >
            Scan Now
          </button>

          <button
            className="px-6 py-3 bg-green-800 bg[#2189c6] bg-opacity-80 text-white rounded-lg text-lg shadow-lg transition transform hover:scale-105"
            onClick={() => navigate("/records")}
          >
            Patient Records
          </button>

          <button
            className="px-6 py-3 bg-purple-800 bg[#2189c6] bg-opacity-80 text-white rounded-lg text-lg shadow-lg transition transform hover:scale-105"
            onClick={() => navigate("/guidelines")}
          >
            Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
