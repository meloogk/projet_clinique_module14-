
"use client"
import { useState, useEffect, useRef } from "react";
import { FaSign } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { Document } from "@/type";
import SignatureCanvas from "react-signature-canvas";
import Image from "next/image"; 

export default function SignDocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const signatureRef = useRef<SignatureCanvas | null>(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/voir_archives");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        setUploadError("Erreur lors du chargement des documents.");
      }
    } catch (error) {
      setUploadError("Erreur lors de la connexion au serveur");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSign = async () => {
    if (!selectedDocument) return alert("Sélectionnez un document à signer.");
    if (!signatureData) return alert("Veuillez dessiner votre signature.");

    setIsUploading(true);
    setUploadError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/signer_documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: selectedDocument._id,
          signature: signatureData, // Signature en base64
          signataire: "John Doe", // Exemple, à remplacer par le nom réel du signataire
        }),
      });

      if (response.ok) {
        setSuccessMessage("Document signé avec succès !");
      } else {
        const error = await response.json();
        setUploadError(`Erreur lors de la signature: ${error.message}`);
      }
    } catch (error) {
      setUploadError("Erreur lors de la connexion au serveur");
    } finally {
      setIsUploading(false);
    }
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      setSignatureData(signatureRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureData(null);
    }
  };

  const renderDocumentsList = () => {
    if (documents.length === 0) {
      return <p>Aucun document disponible pour signature.</p>;
    }
    return documents.map((document) => (
      <button
        key={document._id}
        className="flex justify-between items-center border-2 p-4 cursor-pointer hover:border-teal-500 w-full text-left"
        onClick={() => setSelectedDocument(document)}
        aria-label={`Sélectionner ${document.nom}`}
      >
        <div className="flex items-center">
          <FiEye size={20} className="mr-2 text-teal-500" />
          <p className="truncate">{document.nom}</p>
        </div>
        <span className="text-teal-500">Sélectionner</span>
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-white flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/clinic-logo.png"
            alt="Logo"
            width={200}
            height={80}
            className="h-20 object-contain"
          />
        </div>
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">
          Signature Électronique de Document Médical
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sélectionnez un document à signer électroniquement.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label
              htmlFor="documents"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Documents disponibles à signer
            </label>
            <div id="documents" className="space-y-4">
              {selectedDocument === null ? (
                renderDocumentsList()
              ) : (
                <div className="flex justify-between items-center border-2 p-4">
                  <div className="flex items-center">
                    <FiEye size={20} className="mr-2 text-teal-500" />
                    <p className="truncate">{selectedDocument.nom}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedDocument && (
            <div className="mb-4 flex justify-between items-center text-gray-700">
              <div className="flex items-center">
                <FiEye size={20} className="mr-2 text-teal-500" />
                <p className="truncate">{selectedDocument.nom}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="signature"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Dessinez votre signature
            </label>
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: "border-2 border-gray-300 rounded-lg",
              }}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={saveSignature}
                className="bg-teal-500 text-white py-2 px-4 rounded-lg"
                aria-label="Sauvegarder la signature"
              >
                Sauvegarder la signature
              </button>
              <button
                onClick={clearSignature}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                aria-label="Effacer la signature"
              >
                Effacer
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="mb-4 text-green-500 text-center">
              {successMessage}
            </div>
          )}
          {uploadError && (
            <div className="mb-4 text-red-500 text-center">{uploadError}</div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSign}
              className="flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
              disabled={isUploading}
              aria-label="Signer le document"
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
        <p className="text-center text-sm text-gray-600 mt-4">
          Une fois signé, vous recevrez une copie du document signé.
        </p>
      </div>
    </div>
  );
}
