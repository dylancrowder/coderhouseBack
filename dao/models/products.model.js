import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    code: { type: String, required: true },
    stock: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductsSchema);
