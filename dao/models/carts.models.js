import mongoose from "mongoose";

const cartProducts = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  { _id: false }
);

const CartsSchema = new mongoose.Schema(
  {
    products: { type: [cartProducts], default: [] }
  },
  { timestamps: true }
);

CartsSchema.pre("find", function () {
  this.populate("products.product");
});

export default mongoose.model("carts", CartsSchema);
