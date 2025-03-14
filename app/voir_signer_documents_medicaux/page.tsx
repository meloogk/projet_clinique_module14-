"use client";
import { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai"; 
import { FaSign } from "react-icons/fa"; 
import { FiEye } from "react-icons/fi"; 

export default function SignDocumentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Sélectionnez un document");

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/sign", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Document signé !");
    } else {
      alert("Erreur lors de la signature");
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-white flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-center mb-6">
          <img
            src="/images/clinic-logo.png"
            alt="Logo"
            className="h-20 object-contain"
          />
        </div>
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">
          Signature Électronique de Document Médical
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Téléchargez le document à signer électroniquement.
        </p>

        {/* Formulaire d'upload */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Sélectionner un document PDF
            </label>
            <div className="flex items-center justify-between border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-teal-500">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-700"
              />
              <AiOutlineCloudUpload size={28} className="text-teal-600 ml-4" />
            </div>
          </div>

          {/* Affichage du fichier sélectionné */}
          {file && (
            <div className="mb-4 flex justify-between items-center text-gray-700">
              <div className="flex items-center">
                <FiEye size={20} className="mr-2 text-teal-500" />
                <p className="truncate">{file.name}</p>
              </div>
            </div>
          )}

          {/* Bouton de signature */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleUpload}
              className="flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="spinner-border spinner-border-sm mr-2" />
              ) : (
                <FaSign size={20} />
              )}
              Signer le document
            </button>
          </div>
        </div>

        {/* Message de validation */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Une fois signé, vous recevrez une copie du document signé.
        </p>
      </div>
    </div>
  );
}
