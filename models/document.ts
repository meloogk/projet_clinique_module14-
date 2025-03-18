import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema(
  {
    nom: { type: String, required: true },
    type: { type: String, required: true }, 
    url: { type: String, required: true }, 
    size : { type: Number, required: true }, 
    dateAjout: { type: Date, default: Date.now },
    signature: { type: String, default: null },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.models.Document || mongoose.model("Document", DocumentSchema);
