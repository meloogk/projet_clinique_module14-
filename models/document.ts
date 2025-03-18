import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema(
  {
    nom: { type: String, required: true },
    type: { type: String, required: true }, // Exemple: "PDF", "Image"
    url: { type: String, required: true }, // URL du fichier stocké
    dateAjout: { type: Date, default: Date.now },
    signature: { type: String, default: null }, // Stockage de la signature
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.models.Document || mongoose.model("Document", DocumentSchema);
