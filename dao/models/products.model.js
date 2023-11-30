import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const ProductsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    size: { type: String, enum: ["S", "M", "L", "XL"], default: "M" },
    price: { type: Number, require: true },
    quantity: { type: Number, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    total: { type: Number }
  },
  { timestamps: true }
);

ProductsSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", ProductsSchema);
