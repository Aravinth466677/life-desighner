import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { uploadProjectImages } from "../middleware/uploadProjects.js";
import { initCloudinary } from "../config/cloudinary.js";

const router = express.Router();
const cloudinary = initCloudinary();

function parsePagination(req) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(48, Math.max(1, Number(req.query.limit || 12)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

async function destroyCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch {
    // best-effort cleanup
  }
}

// CREATE (admin)
router.post(
  "/",
  verifyAdmin,
  uploadProjectImages.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery", maxCount: 12 },
  ]),
  async (req, res) => {
    const { title, location, category } = req.body;
    const coverFile = req.files?.cover?.[0];
    const galleryFiles = req.files?.gallery ?? [];

    if (!title || !location || !category || !coverFile) {
      return res
        .status(400)
        .json({ message: "Title, location, category, and cover are required" });
    }

    const project = await Project.create({
      title,
      location,
      category,
      cover: { url: coverFile.path, publicId: coverFile.filename },
      gallery: galleryFiles.map((f) => ({ url: f.path, publicId: f.filename })),
      image: coverFile.path, // legacy
    });

    res.status(201).json(project);
  }
);

// LIST (public) with pagination + optional filter/search
router.get("/", async (req, res) => {
  const { page, limit, skip } = parsePagination(req);
  const category = req.query.category;
  const q = String(req.query.q || "").trim();

  const filter = {};
  if (category === "interior" || category === "exterior") {
    filter.category = category;
  }
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
    ];
  }

  const [total, items] = await Promise.all([
    Project.countDocuments(filter),
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);

  const pages = Math.max(1, Math.ceil(total / limit));
  res.json({ items, page, pages, total });
});

// DETAILS (public)
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// UPDATE (admin)
router.put(
  "/:id",
  verifyAdmin,
  uploadProjectImages.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery", maxCount: 12 },
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid project id" });
      }

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      project.title = req.body.title || project.title;
      project.location = req.body.location || project.location;
      project.category = req.body.category || project.category;

      const coverFile = req.files?.cover?.[0];
      const galleryFiles = req.files?.gallery ?? [];

      if (coverFile) {
        await destroyCloudinary(project.cover?.publicId);
        project.cover = { url: coverFile.path, publicId: coverFile.filename };
        project.image = coverFile.path; // legacy
      }

      if (galleryFiles.length) {
        const newItems = galleryFiles.map((f) => ({
          url: f.path,
          publicId: f.filename,
        }));
        project.gallery = [...(project.gallery ?? []), ...newItems];
      }

      await project.save();
      res.json(project);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE (admin)
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await destroyCloudinary(project.cover?.publicId);
    for (const img of project.gallery ?? []) {
      await destroyCloudinary(img.publicId);
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
