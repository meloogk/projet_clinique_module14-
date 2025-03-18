import mongoose from "mongoose"
import dotenv from "dotenv" //Pour utiliser les variables d'environnement stocker dans le fichier .env
dotenv.config()

const url = process.env.MONGOOSE_URL//Pour recupérer notre varible MONGOOSE_URL qui contient la chaine de connection pour notre cluster, stocker dans le fichier .env

export const DBConnect = async () => {
    //On definie les options de connexion au cluster mongoose
    const options = { 
        serverApi: { version: '1', strict: true, deprecationErrors: true },
        dbName: "db_clinique"
    }
    //On se connecte à la base de données
    mongoose.connect(url, options)
    .then(() => console.log("Connexion réussi à la base de données"))
    .catch((er) => console.log("Erreur détecté", er))
}



