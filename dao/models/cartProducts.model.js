import mongoose from "mongoose";
const productCartSchema = new mongoose.Schema(
  {
    product: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      thumbnail: { type: String },
      size: { type: String, enum: ["S", "M", "L", "XL"] },
      price: { type: Number, require: true },
      code: { type: String, required: true },
      stock: { type: Number, required: true }
    }
  },
  { _id: false }
);

export default mongoose.model("product", productCartSchema);
