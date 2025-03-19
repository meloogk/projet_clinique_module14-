import { NextResponse } from "next/server";
import { DocumentModel } from "@/models/document";
import { DBConnect } from "@/data/mongoose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export const POST = async (req: Request) => {
  try {
    await DBConnect();
    
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier envoyé" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Définir le chemin du fichier
    const filePath = path.join(uploadDir, file.name);

    // Enregistrer le fichier
    await writeFile(filePath, buffer);

    const document = await DocumentModel.create({
      nom: file.name,
      type: file.type,
      url: `/uploads/${file.name}`,
      size: file.size, 
    });

    return NextResponse.json({ message: "Document ajouté", document }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'upload du document :", error);
    return NextResponse.json({ message: "Erreur serveur", error }, { status: 500 });
  }
};
