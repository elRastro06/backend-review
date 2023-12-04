//carga cosas de la base de datos

import { MongoClient } from "mongodb";
import 'dotenv/config';                 //esta libreria se encarga de cargar las credencias del .env

const connectionString = process.env.CONNECTION_STRING;
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}


let db = conn.db("web");                    //cargar db
let reviews = db.collection("reviews");   //cargar coleccion
export default reviews;
