"use client";
import { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
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
    fetchDocuments();
  }, []);

  const handleSign = async () => {
    if (!selectedDocument) return alert("Sélectionnez un document à signer.");
    if (!signatureData) return alert("Veuillez sauvegarder votre signature avant de continuer.");

    setIsUploading(true);
    setUploadError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/signer_documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: selectedDocument._id,
          signature: signatureData,
          signataire: "dr koffi",
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-teal-100 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl w-full border border-gray-200">
        <div className="flex justify-center mb-6">
          <Image src="/images/clinic-logo.png" alt="Logo" width={180} height={70} />
        </div>
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
         Procédez à la Signature Électronique de vos  Documents 
        </h2>
        {!selectedDocument ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sélectionnez un document :</h3>
            {documents.map((document) => (
              <button
                key={document._id}
                className="flex justify-between items-center border p-4 w-full text-left hover:bg-teal-50 transition rounded-lg"
                onClick={() => setSelectedDocument(document)}
              >
                <FiEye size={20} className="mr-2 text-teal-500" />
                <span className="text-gray-700 font-medium">{document.nom}</span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center border p-4 mb-4 rounded-lg bg-gray-100">
              <h3 className="text-lg font-medium text-gray-800">{selectedDocument.nom}</h3>
              <button onClick={() => setSelectedDocument(null)} className="text-red-500 font-semibold">
                Changer de document
              </button>
            </div>
            {selectedDocument.url.endsWith(".pdf") && (
              <iframe
                src={selectedDocument.url}
                className="w-full h-72 border rounded-lg shadow-sm"
                title="Prévisualisation du document"
              ></iframe>
            )}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Dessinez votre signature :</h3>
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "border rounded-lg shadow-sm",
                }}
              />
              <div className="flex justify-between mt-2">
                <button onClick={saveSignature} className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                  Sauvegarder
                </button>
                <button onClick={clearSignature} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                  Effacer
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSign}
                className="bg-teal-700 hover:bg-teal-800 text-white py-3 px-6 rounded-lg transition shadow-md"
                disabled={isUploading}
              >
                {isUploading ? "Signature en cours..." : "Signer le document"}
              </button>
            </div>
            {successMessage && <p className="text-green-600 text-center font-semibold mt-4">{successMessage}</p>}
            {uploadError && <p className="text-red-600 text-center font-semibold mt-4">{uploadError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
