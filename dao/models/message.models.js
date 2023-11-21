import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: String,
    body: String
  },
  { timestamps: true }
);

const message = mongoose.model("messages", messageSchema);

export default message;
