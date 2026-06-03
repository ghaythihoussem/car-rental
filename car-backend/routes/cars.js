import express from "express";
import Car from "../models/Car.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/upload.js";

import fs from "fs";
import csv from "csv-parser";
import multer from "multer";

const router = express.Router();

/* =========================
   🟢 GET ALL CARS
========================= */
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   🟢 GET ONE CAR
========================= */
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   🟢 ADD CAR (ADMIN + IMAGES)
========================= */
router.post(
  "/add",
  verifyToken,
  isAdmin,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const images = req.files
        ? req.files.map(
            (f) => `${process.env.VITE_API_URL}/uploads/${f.filename}`
          )
        : [];

      const car = await Car.create({
        ...req.body,
        pricePerDay: Number(req.body.pricePerDay),
        year: Number(req.body.year),
        images,
      });

      res.json(car);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================
   🟢 UPDATE CAR
========================= */
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   🟢 DELETE CAR
========================= */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted 🚗" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   🟢 CSV IMPORT (ADMIN ONLY)
========================= */

// multer خاص بالCSV
const uploadCSV = multer({ dest: "uploads/" });

router.post(
  "/import",
  verifyToken,
  isAdmin,
  uploadCSV.single("file"),
  async (req, res) => {
    try {
      const results = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          results.push({
            brand: row.brand,
            name: row.name,
            category: row.category,
            pricePerDay: Number(row.pricePerDay),
            year: Number(row.year),
            description: row.description || "",
            images: [],
          });
        })
        .on("end", async () => {
          await Car.insertMany(results);

          fs.unlinkSync(req.file.path); // cleanup

          res.json({
            message: "🚀 Cars imported successfully",
            count: results.length,
          });
        });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router