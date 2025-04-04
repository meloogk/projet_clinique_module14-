export type Document = {
  _id: string;
  nom: string;
  type: string;
  size: number;
  url : string;
  dateAjout: string;
  path: string;
  signature: {
    signataire: string | null;
    dateSignature: string | null;
    fichierSignature: string | null;
  };
};
