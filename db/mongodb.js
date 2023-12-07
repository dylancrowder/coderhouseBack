import mongoose from "mongoose";

export  const URI =
  "mongodb+srv://devdylancrowder:dilan_07@cluster0.pbvemm9.mongodb.net/ecommerce";

export const initMongo = async () => {
  try {
    mongoose.connect(URI);
    console.log("funciona correctamente");
  } catch (erro) {
    console.log("error al intentar conectarse a la db");
  }
};
