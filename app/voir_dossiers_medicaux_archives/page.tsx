"use client";
"use client";
import { useState } from "react";
import { UploadCloud, Eye, Trash, FileText } from "lucide-react";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Dossier médical - Patient 1", type: "PDF", size: "2.5 MB", date: "10 Mars 2025" },
    { id: 2, name: "Rapport clinique - Dr. koffi", type: "DOCX", size: "1.2 MB", date: "8 Mars 2025" },
  ]);

  const handleUpload = () => {
    alert("Téléchargement du document...");
  };

  const handleView = (doc: string) => {
    alert(`Aperçu du fichier : ${doc}`);
  };

  const handleDelete = (id: number) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 px-6">
      {/* Titre & Illustration */}
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800">Gestion des Documents Médicaux</h1>
        <p className="text-gray-600 mt-3">Stockez et accédez aux dossiers médicaux en toute sécurité.</p>
        <img src="/medical-documents.svg" alt="Documents" className="w-64 mx-auto my-6" />
      </div>

      {/* Upload Section */}
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-6 mt-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700">Ajouter un document</h2>
          <p className="text-gray-500">Téléchargez un dossier médical ou administratif.</p>
        </div>
        <button
          onClick={handleUpload}
          className="flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-5 rounded-xl shadow-lg transition-all duration-300"
        >
          <UploadCloud className="w-6 h-6" />
          Télécharger
        </button>
      </div>

      {/* Tableau des Documents */}
      <div className="max-w-6xl w-full mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Documents Archivés</h2>
        <div className="overflow-hidden rounded-xl shadow-lg">
          <table className="min-w-full bg-white rounded-xl">
            <thead className="bg-blue-700 text-white text-lg">
              <tr>
                <th className="py-4 px-6 text-left">Document</th>
                <th className="py-4 px-6 text-left">Type</th>
                <th className="py-4 px-6 text-left">Taille</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-gray-700">{doc.name}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{doc.type}</td>
                  <td className="py-4 px-6 text-gray-600">{doc.size}</td>
                  <td className="py-4 px-6 text-gray-600">{doc.date}</td>
                  <td className="py-4 px-6 text-center flex justify-center gap-4">
                    <button
                      onClick={() => handleView(doc.name)}
                      className="text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                      <Eye className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-800 transition duration-300"
                    >
                      <Trash className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
