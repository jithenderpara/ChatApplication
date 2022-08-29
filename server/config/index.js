import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let database;
export const connect = () => {
  // add your own uri below
  const uri = process.env.DB_CONN_STRING;
  if (database) {
    return;
  }
  mongoose.connect(uri, {useMongoClient:true});
  database = mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};
