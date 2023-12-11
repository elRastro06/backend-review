//carga cosas de la base de datos

import { MongoClient } from "mongodb";
import 'dotenv/config';                 //esta libreria se encarga de cargar las credencias del .env

const user = process.env.MONGO_USER;
const pwd = process.env.MONGO_PWD;
const field1 = process.env.MONGO_CONNECTION_FIELD_1;
const field2 = process.env.MONGO_CONNECTION_FIELD_2;
const connectionString = `mongodb+srv://${user}:${pwd}@${field1}.${field2}.mongodb.net/?retryWrites=true&w=majority`;
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
