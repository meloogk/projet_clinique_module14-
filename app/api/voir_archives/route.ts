import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mime from "mime-types";

export const GET = async () => {
  try {
   
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Vérifier si le dossier existe
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ message: "Aucun fichier trouvé" }, { status: 404 });
    }

  
    const files = fs.readdirSync(uploadDir);

    // Vérifier s'il y a des fichiers
    if (files.length === 0) {
      return NextResponse.json({ message: "Aucun fichier disponible" }, { status: 404 });
    }

   // Construire l'URL complète pour chaque fichier
const fileUrls = files.map((file) => {
    const filePath = path.join(uploadDir, file);
    const stats = fs.statSync(filePath); 
    const fileType = mime.lookup(filePath) || "application/octet-stream"; 
   
  
    return {
      nom: file,
      size: stats.size,
      type: fileType, 
      dateAjout: stats.birthtime ? stats.birthtime.toISOString().slice(0, 10) : stats.ctime.toISOString().slice(0, 10), 
      url: `/uploads/${file}`,
    };
  });
  
  console.log(fileUrls); 

    return NextResponse.json(fileUrls, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers :", error);
    return NextResponse.json({ message: "Erreur serveur", error }, { status: 500 });
  }
};
