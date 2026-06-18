import express from "express";
import Car from "../models/Car.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { validateCar } from "../middleware/validation.js";

const router = express.Router();

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "car-rental" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

/* =========================
   🟢 ADD CAR
========================= */
router.post(
  "/add",
  verifyToken,
  isAdmin,
  upload.array("images", 10),
  validateCar,
  async (req, res) => {
    try {
      const uploadedImages = [];

      if (req.files && req.files.length > 0) {
        const uploadResults = await Promise.all(
          req.files.map((file) => uploadBufferToCloudinary(file.buffer))
        );

        uploadResults.forEach((result) => {
          if (result?.secure_url) uploadedImages.push(result.secure_url);
        });
      }

      const car = await Car.create({
        ...req.body,
        pricePerDay: Number(req.body.pricePerDay),
        year: Number(req.body.year),
        images: uploadedImages,
      });

      res.status(201).json({ message: "Car added successfully", car });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================
   🟢 UPDATE INFO ONLY
========================= */
router.put("/:id", verifyToken, isAdmin, validateCar, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car updated successfully", car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🟢 UPDATE IMAGES ONLY
========================= */
router.put(
  "/:id/images",
  verifyToken,
  isAdmin,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images provided" });
      }

      const uploadResults = await Promise.all(
        req.files.map((file) => uploadBufferToCloudinary(file.buffer))
      );
      const uploadedImages = uploadResults
        .filter((result) => result?.secure_url)
        .map((result) => result.secure_url);

      const car = await Car.findByIdAndUpdate(
        req.params.id,
        { images: uploadedImages },
        { new: true }
      );

      if (!car) return res.status(404).json({ message: "Car not found" });
      res.json({ message: "Images updated successfully", car });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================
   🟢 GET ALL
========================= */
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🟢 GET ONE
========================= */
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🟢 DELETE CAR
========================= */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;