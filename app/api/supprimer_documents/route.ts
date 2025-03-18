import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DocumentModel } from "@/models/document"; 

export const DELETE = async (req: Request) => {
  try {
    // Récupérer le nom du fichier à partir du corps de la requête
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ message: "Nom du fichier manquant" }, { status: 400 });
    }

    // Définir le chemin du fichier
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "Fichier non trouvé" }, { status: 404 });
    }

    // Supprimer le fichier du système de fichiers
    fs.unlinkSync(filePath);

    // Supprimer le document de la base de données (si nécessaire)
    await DocumentModel.deleteOne({ nom: fileName });

    // Retourner une réponse de succès
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier :", error);
    return NextResponse.json({ message: "Erreur serveur", error }, { status: 500 });
  }
};
