import express from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

/* USER SUBMIT */
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      whatsapp,
      place,
    } = req.body;

    if (!name || !whatsapp || !place) {
      return res.status(400).json({ message: "All fields required" });
    }

    const contact = await Contact.create({
      name,
      whatsapp,
      place,
    });

    res.json(contact);
  } catch (err) {
    next(err);
  }
});

/* ADMIN GET ALL */
router.get("/", verifyAdmin, async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

/* MARK CONTACTED */
router.put("/:id/contacted", verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid contact id" });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { contacted: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(contact);
  } catch (err) {
    next(err);
  }
});

export default router;
