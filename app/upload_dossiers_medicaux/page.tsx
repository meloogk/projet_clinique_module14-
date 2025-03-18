"use client"

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/telecharger_dossiers", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Fichier téléchargé avec succès !");
      } else {
        alert("Erreur lors du téléchargement.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Section Image */}
        <div className="hidden md:block">
          <Image
            src="/images/img8.avif" 
            alt="Archivage Médical"
            width={800}
            height={800}
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* Section Formulaire */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Archivage Médical Sécurisé
          </h2>
          <p className="text-gray-500 text-lg mb-6">
            Téléchargez vos documents médicaux en toute sécurité et accédez-y à tout moment.
          </p>

          {/* Zone de sélection de fichier */}
          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:bg-gray-100 transition">
            <FiUploadCloud className="text-blue-500 text-5xl mb-3" />
            <span className="text-gray-600 font-medium text-lg">Cliquez ou déposez un fichier</span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          {/* Aperçu du fichier */}
          {preview && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-md">
              <p className="text-lg font-medium text-gray-700">Aperçu :</p>
              <Image
                src={preview}
                alt="Preview"
                width={500}
                height={300}
                className="w-full mt-3 rounded-lg shadow-lg"
                unoptimized
              />
            </div>
          )}

          {/* Bouton de téléchargement */}
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 text-lg"
          >
            <IoCloudUploadOutline className="text-2xl" />
            <span> Télécharger le document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
