import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { validateEnv } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";




dotenv.config();
validateEnv();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);

// SERVE UPLOADED IMAGES
app.use("/uploads", express.static("uploads"));

// TEST
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend running" });
});

app.use(notFound);
app.use(errorHandler);

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
