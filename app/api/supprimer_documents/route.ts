import { NextResponse } from "next/server";
import fs from "fs/promises"; 
import path from "path";
import { DocumentModel } from "@/models/document"; 
import { DBConnect } from "@/data/mongoose";

export const DELETE = async (req: Request) => {
  try {
    // Connexion à la base de données
    await DBConnect();

    // Récupérer le nom du fichier à partir du corps de la requête
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ message: "Nom du fichier manquant" }, { status: 400 });
    }

    // Définir le chemin du fichier
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    // Vérifier si le fichier existe avant de le supprimer
    try {
      await fs.access(filePath); // Vérifie si le fichier existe
      await fs.unlink(filePath); // Supprime le fichier
    } catch (error) {
      return NextResponse.json({ message: "Fichier non trouvé" }, { status: 404 });
    }

    // Supprimer le document de la base de données
    const result = await DocumentModel.deleteOne({ nom: fileName });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Document non trouvé dans la base de données" }, { status: 404 });
    }

    // Retourner une réponse de succès
    return NextResponse.json({ message: "Document supprimé avec succès" }, { status: 200 });

  } catch (error) {
    console.error(" Erreur lors de la suppression :", error);
    return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
  }
};
