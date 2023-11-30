import mongoose from "mongoose";
const productCartSchema = new mongoose.Schema(
  {
    product: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      thumbnail: { type: String },
      size: { type: String, enum: ["S", "M", "L", "XL"] },
      quantity: { type: Number, required: true },
      price: { type: Number, require: true },
      code: { type: String, required: true },
      stock: { type: Number, required: true },
      total: { type: Number }
    }
  },
  { _id: false }
);

export default mongoose.model("product", productCartSchema);
