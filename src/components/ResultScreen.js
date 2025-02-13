import React from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { DownloadCloud, Share2, Calendar } from "lucide-react";
import { jsPDF } from "jspdf";

const ResultsScreen = ({ user = {} }) => {
  // Dummy test result
  const { userData } = useContext(UserContext); // Ensure userData is retrieved
  if (!userData) {
    return <p className="text-center text-red-500">User data not available.</p>;
  }

  const result = {
    lesionType: "Precancerous",
    probabilityScore: "78%",
    areaAffected: "Lower Left Molar",
    severity: "Moderate",
    recommendedAction: "See a Specialist",
  };

  // Ensure user properties are always defined



// Function to generate PDF and return Blob
const generatePDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Oral Health Assessment Report", 20, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  let y = 40;
  doc.text(`Name: ${userData.name || "Test User"}`, 20, y);
  y += 10;
  doc.text(`Age: ${userData.age || "25"}`, 20, y);
  y += 10;
  doc.text(`Gender: ${userData.gender || "Male"}`, 20, y);
  y += 10;
  doc.line(20, y, 190, y);
  y += 10;
  doc.text(`Lesion Type: ${result.lesionType}`, 20, y);
  y += 10;
  doc.text(`Probability Score: ${result.probabilityScore}`, 20, y);
  y += 10;
  doc.text(`Area Affected: ${result.areaAffected}`, 20, y);
  y += 10;
  doc.text(`Severity Level: ${result.severity}`, 20, y);
  y += 10;
  doc.text(`Recommended Actions: ${result.recommendedAction}`, 20, y);

  return doc;
};
  // Function to generate and download a PDF report
   // Function to download the PDF report
   const handleDownloadReport = () => {
    const doc = generatePDF();
    doc.save("Oral_Health_Report.pdf");
  };

  // Function to share the PDF report
  const handleShareReport = async () => {
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], "Oral_Health_Report.pdf", { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Oral Health Report",
          text: "Here is my assessment report."
        });
      } catch (error) {
        console.error("Error sharing report:", error);
      }
    } else {
      alert("Sharing is not supported on this device");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Results</h2>

        <div className="text-left space-y-2">
          <p><strong>Name:</strong> {userData.name || "Test User"}</p>
          <p><strong>Age:</strong> {userData.age || "25"}</p>
          <p><strong>Gender:</strong> {userData.gender || "Male"}</p>
          <hr className="my-4 border-gray-300" />
          <p><strong>Lesion Type:</strong> {result.lesionType}</p>
          <p><strong>Probability Score:</strong> {result.probabilityScore}</p>
          <p><strong>Area Affected:</strong> {result.areaAffected}</p>
          <p><strong>Severity Level:</strong> {result.severity}</p>
          <p><strong>Recommended Actions:</strong> {result.recommendedAction}</p>
        </div>

        <div className="mt-6 flex flex-col space-y-3">
        <button
            onClick={handleDownloadReport}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            <DownloadCloud className="w-5 h-5 mr-2" />
            Download Report
          </button>

          <button
            onClick={() => alert("Redirecting to appointment page...")}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule an Appointment
          </button>

          <button
            onClick={handleShareReport}
            className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
