import mongoose from "mongoose";

const socialLoginSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    socialAccounts: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", socialLoginSchema);
