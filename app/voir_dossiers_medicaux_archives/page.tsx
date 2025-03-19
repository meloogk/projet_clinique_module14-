"use client";
import { useState, useEffect } from "react";
import { Eye, Trash, FileText } from "lucide-react";
import { Document } from "../../type";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fonction pour récupérer les documents depuis l'API
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
      localStorage.setItem( 'data',JSON.stringify(data))

      console.log("Données récupérées:", data);

      // Assurez-vous que les données sont dans le bon format
      if (!data || !Array.isArray(data)) {
        throw new Error("Les données récupérées ne sont pas au format attendu");
      }

      setDocuments(data); // Mise à jour de l'état des documents
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les documents au démarrage
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fonction pour gérer la visualisation d'un document
  const handleView = (documents: Document) => {
    alert(`Aperçu du fichier : ${documents.nom}`);
    console.log(documents);
  };

  // Fonction pour supprimer un document
  const handleDelete = async (fileName: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        const response = await fetch("/api/supprimer_documents", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName }) // Envoyer le nom du fichier
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setDocuments(documents.filter((doc) => doc.nom !== fileName)); // Mise à jour de l'état
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
  
      <div className="max-w-6xl w-full mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Documents Archivés
        </h2>
  
        {/* Affichage de l'état de chargement */}
        {loading ? (
          <div className="flex justify-center py-4">
            <span>Chargement des documents...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="min-w-full bg-white rounded-xl">
              <thead className="bg-blue-700 text-white text-lg">
                <tr>
                  <th className="py-4 px-6 text-left text-xs sm:text-sm">Document</th>
                  <th className="py-4 px-6 text-left text-xs sm:text-sm">Type</th>
                  <th className="py-4 px-6 text-left text-xs sm:text-sm">Taille(Ko)</th>
                  <th className="py-4 px-6 text-left text-xs sm:text-sm">Date</th>
                  <th className="py-4 px-6 text-center text-xs sm:text-sm">Actions</th>
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
                        <button
                          onClick={() => handleView(doc)}
                          className="text-blue-600 hover:text-blue-800 transition duration-300"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.nom)}
                          className="text-red-600 hover:text-red-800 transition duration-300"
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
    </div>
  );
  
  
};

export default DocumentsPage;
