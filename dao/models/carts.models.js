import mongoose from "mongoose";

const CartsSchema = new mongoose.Schema(
  {
    products: [{}]
  },
  { timestamps: true }
);

export default mongoose.model("carts", CartsSchema);
