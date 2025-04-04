"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileSignature, Trash, FileText, PlusCircle } from "lucide-react";
import { Document } from "../../type";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/voir_archives");

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des documents : ${response.statusText}`
        );
      }

      const data = await response.json();
      localStorage.setItem("data", JSON.stringify(data));

      console.log("Données récupérées:", data);

      if (!data || !Array.isArray(data)) {
        throw new Error("Les données récupérées ne sont pas au format attendu");
      }

      setDocuments(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (fileName: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        const response = await fetch("/api/supprimer_documents", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName })
        });

        const data = await response.json();

        if (response.ok) {
          setDocuments(documents.filter((doc) => doc.nom !== fileName));
          alert("Document supprimé avec succès !");
        } else {
          alert(`Erreur: ${data.message}`);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du fichier:", error);
        alert("Échec de la suppression");
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 px-6">
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800">
          Gestion des Documents Médicaux
        </h1>
        <p className="text-gray-600 mt-3">
          Stockez et accédez aux dossiers médicaux en toute sécurité.
        </p>
      </div>

      <div className="max-w-6xl w-full mt-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Documents Archivés</h2>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition transform hover:scale-105 shadow-lg mb-2"
          >
            <PlusCircle className="w-6 h-6" /> Nouvelle Action
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden">
              <Link
                href="/upload_dossiers"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Télécharger un document
              </Link>
              <Link
                href="/signer"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Signer un document
              </Link>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <span>Chargement des documents...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg w-full">
          <table className="min-w-full bg-white rounded-xl">
            <thead className="bg-blue-700 text-white text-lg">
              <tr>
                <th className="py-4 px-6 text-left">Document</th>
                <th className="py-4 px-6 text-left">Type</th>
                <th className="py-4 px-6 text-left">Taille(Ko)</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const key =
                  doc._id ||
                  `${doc.nom || "unknown"}-${doc.dateAjout ? new Date(doc.dateAjout).toISOString() : Date.now()}`;

                const formattedDate = doc.dateAjout
                  ? new Date(doc.dateAjout).toLocaleDateString()
                  : "N/A";

                return (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-gray-700">{doc.nom}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{doc.type}</td>
                    <td className="py-4 px-6 text-gray-600">{doc.size}</td>
                    <td className="py-4 px-6 text-gray-600">{formattedDate}</td>
                    <td className="py-4 px-6 text-center flex justify-center gap-4">
                      <Link href={`/signer`} className="text-blue-600 hover:text-blue-800 transition">
                        <FileSignature className="w-6 h-6" />
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.nom)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
