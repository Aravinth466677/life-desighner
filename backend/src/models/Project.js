import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["interior", "exterior"],
      required: true,
    },
    cover: {
      url: { type: String },
      publicId: { type: String },
    },
    gallery: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
