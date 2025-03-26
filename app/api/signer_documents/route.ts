import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { DocumentModel } from "@/models/document";
import { DBConnect } from "@/data/mongoose";

interface SignatureRequest {
  fileName: string;
  signature: string; // Signature au format base64
  signataire: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Connexion à la base de données MongoDB
      await DBConnect();

      // Vérification des données reçues
      console.log("Données reçues :", req.body);
      const { fileName, signature, signataire }: SignatureRequest = req.body;

      // Vérification des paramètres
      if (!fileName || !signature || !signataire) {
        return res.status(400).json({ message: "Nom du fichier, signature ou signataire manquants" });
      }

      // Chercher le document correspondant dans la base de données
      const document = await DocumentModel.findOne({ nom: fileName });

      if (!document) {
        return res.status(404).json({ message: "Document non trouvé" });
      }

      // Vérification et extraction du base64 de la signature
      const base64Data = signature.split(',')[1]; // Supprimer la partie "data:image/png;base64,"
      const buffer = Buffer.from(base64Data, 'base64');

      // Répertoire de stockage des signatures
      const signatureDir = path.join(process.cwd(), "public/signatures");

      // Vérifier si le répertoire existe, sinon le créer
      await fs.mkdir(signatureDir, { recursive: true });

      // Générer un nom unique pour la signature
      const signatureFileName = `${Date.now()}_signature.png`;
      const signatureFilePath = path.join(signatureDir, signatureFileName);

      // Sauvegarder la signature
      await fs.writeFile(signatureFilePath, buffer);

      // Mettre à jour le document dans la base de données
      document.signature = {
        signataire,
        dateSignature: new Date(),
        fichierSignature: `/signatures/${signatureFileName}`,
      };

      await document.save();

      console.log("Signature ajoutée avec succès");

      return res.status(200).json({ message: "Signature ajoutée avec succès" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la sauvegarde de la signature:", error.message);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
      }
      console.error("Erreur inconnue:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
